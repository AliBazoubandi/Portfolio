import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CONFIG } from './config';
import { soundEngine } from './audio';
import { animateSkillCheckboxes } from './pages/skills';
import { renderHandStamper, renderPageTopGrip } from './svg/assets';

gsap.registerPlugin(ScrollTrigger);

export interface PageDefinition {
  id: string;
  tabLabel: string;
  html: string;
  isSkills?: boolean;
  isContact?: boolean;
}

interface DwellWindow {
  id: string;
  pageIndex: number;
  startProg: number;
  endProg: number;
  targetProg: number;
}

const PROGRESS_STORAGE_KEY = 'ali-portfolio-scroll-progress';

/**
 * Measures actual rAF cadence over a brief 8-frame probe to flag weak/throttled devices
 * alongside hardwareConcurrency, deviceMemory, and prefers-reduced-motion.
 */
async function detectSimpleMode(): Promise<boolean> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;
  if (cores <= CONFIG.performance.minCores || mem <= CONFIG.performance.minMemoryGb) {
    return true;
  }

  return new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    const tick = () => {
      frames++;
      if (frames >= 8) {
        const elapsed = performance.now() - start;
        const fps = (frames / Math.max(elapsed, 1)) * 1000;
        resolve(fps < CONFIG.performance.minProbeFps);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export class FolderChoreography {
  private lenis: Lenis | null = null;
  private masterTl: gsap.core.Timeline | null = null;
  private trigger: ScrollTrigger | null = null;
  private dwellWindows: DwellWindow[] = [];
  private totalScrollPx = CONFIG.baseScrollDistancePx;
  private activePageIndex = -1;
  private lastSettledPage = -1;
  private flippedFromPage = -1;
  private closedStamped = false;
  private coverOpened = false;
  private suppressFlipSound = false;
  private simpleMode = false;
  private pageEls: HTMLElement[] = [];
  private tabBtns: HTMLButtonElement[] = [];

  constructor(private pages: PageDefinition[]) {}

  public async init(): Promise<void> {
    const stackEl = document.getElementById('page-stack');
    const pageTopGrip = document.getElementById('page-top-grip');
    const tabsEl = document.getElementById('folder-index-tabs');
    const scrollTrack = document.getElementById('scroll-track');
    const pinnedStage = document.getElementById('pinned-stage');
    const folderRoot = document.getElementById('folder-root');
    const coverHinge = document.getElementById('folder-cover-hinge');
    const stampClosed = document.getElementById('stamp-closed');
    const handStamper = document.getElementById('hand-stamper');
    const closedActions = document.getElementById('closed-actions');
    const scrollHint = document.getElementById('scroll-hint');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (
      !stackEl ||
      !tabsEl ||
      !scrollTrack ||
      !pinnedStage ||
      !folderRoot ||
      !coverHinge ||
      !stampClosed ||
      !closedActions
    ) {
      return;
    }

    if (pageTopGrip) {
      pageTopGrip.innerHTML = renderPageTopGrip();
    }
    if (handStamper) {
      handStamper.innerHTML = renderHandStamper();
    }

    this.simpleMode = await detectSimpleMode();
    if (this.simpleMode) {
      document.documentElement.classList.add('is-simple-motion');
    }

    // 1. Mount internal pages inside top-bound stack (preserving #folder-index-tabs inside #page-stack)
    // Bottom-most page sits at Z=0px, upper pages step forward by +1.1px so nothing ever
    // drops behind .folder-back (which sits at Z=-14px).
    stackEl.querySelectorAll('.folder-page').forEach((el) => el.remove());
    tabsEl.innerHTML = '';
    this.pageEls = this.pages.map((page, idx) => {
      const pageEl = document.createElement('div');
      pageEl.className = 'folder-page';
      pageEl.id = `page-${page.id}`;
      pageEl.dataset.pageIndex = String(idx);
      pageEl.style.zIndex = String(this.pages.length - idx);
      if (!this.simpleMode) {
        pageEl.style.transform = `translateZ(${(this.pages.length - 1 - idx) * 1.1}px)`;
      } else {
        pageEl.style.opacity = '0';
      }
      pageEl.setAttribute('inert', '');

      const shadowEl = document.createElement('div');
      shadowEl.className = 'page-flip-shadow';
      shadowEl.setAttribute('aria-hidden', 'true');

      const backEl = document.createElement('div');
      backEl.className = 'folder-page-back';
      backEl.setAttribute('aria-hidden', 'true');

      pageEl.innerHTML = page.html;
      pageEl.appendChild(shadowEl);
      pageEl.appendChild(backEl);
      stackEl.appendChild(pageEl);

      // Right-side index tab
      const tabBtn = document.createElement('button');
      tabBtn.type = 'button';
      tabBtn.className = 'index-tab-btn';
      tabBtn.textContent = page.tabLabel;
      tabBtn.dataset.targetPage = String(idx);
      tabBtn.addEventListener('click', () => this.scrollToPage(idx));
      tabsEl.appendChild(tabBtn);

      return pageEl;
    });

    this.tabBtns = Array.from(tabsEl.querySelectorAll<HTMLButtonElement>('.index-tab-btn'));

    // Compute total scroll distance (scales when extra Projects spread pages exist)
    const extraProjectPages = Math.max(0, this.pages.length - 6);
    this.totalScrollPx =
      CONFIG.baseScrollDistancePx + extraProjectPages * CONFIG.extraProjectPageScrollPx;

    // 2. Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    this.lenis = new Lenis({
      duration: CONFIG.lenis.duration,
      wheelMultiplier: CONFIG.lenis.wheelMultiplier,
      touchMultiplier: CONFIG.lenis.touchMultiplier,
      syncTouch: !isTouch ? false : false,
    });

    this.lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      this.lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 3. Build Master Timeline with dynamic normalized segments
    this.masterTl = gsap.timeline({ paused: true });
    this.buildChoreography(
      folderRoot,
      coverHinge,
      pageTopGrip,
      handStamper,
      stampClosed,
      closedActions
    );

    // 4. Attach ScrollTrigger pinning the full-viewport stage
    this.trigger = ScrollTrigger.create({
      trigger: scrollTrack,
      start: 'top top',
      end: `+=${this.totalScrollPx}`,
      pin: pinnedStage,
      pinSpacing: true,
      scrub: CONFIG.scrubSmoothness,
      animation: this.masterTl,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (scrollHint) {
          scrollHint.classList.toggle('is-hidden', p > 0.015);
        }
        folderRoot.classList.toggle('is-closed-hover', p < 0.02);
        this.syncDwellState(p);
        this.syncAudioAndStampEvents(p, self.direction, closedActions);

        try {
          sessionStorage.setItem(PROGRESS_STORAGE_KEY, p.toFixed(4));
        } catch {
          // Ignore storage quota errors
        }
      },
    });

    // 5. Back to Top button (silent rewind without page-flip sound effects)
    backToTopBtn?.addEventListener('click', () => {
      this.scrollToProgress(0, true);
    });

    // 6. Keyboard Navigation (Arrows, PageUp/Down, Home, End)
    this.bindKeyboardNavigation();

    // 7. Resize & visibility deterministic refresh
    let resizeTimer: number | undefined;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 160);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        ScrollTrigger.refresh();
      }
    });

    // 8. Anchor deep-link (#about, #projects, etc.) or reload restoration
    this.handleInitialRouteOrRestore();
  }

  private buildChoreography(
    folderRoot: HTMLElement,
    coverHinge: HTMLElement,
    pageTopGrip: HTMLElement | null,
    handStamper: HTMLElement | null,
    stampClosed: HTMLElement,
    closedActions: HTMLElement
  ): void {
    if (!this.masterTl) return;

    const tl = this.masterTl;
    const w = CONFIG.weights;
    const e = CONFIG.easings;
    this.dwellWindows = [];

    const desktopShiftX = window.innerWidth > 960 ? Math.min(window.innerWidth * 0.14, 175) : 0;

    // Phase 0 -> 12%: Cover Opens (or fades aside in simpleMode)
    if (!this.simpleMode) {
      tl.to(folderRoot, { rotation: 0, scale: 1.02, x: desktopShiftX, duration: w.coverOpen, ease: e.coverOpen }, 0);
      tl.to(coverHinge, { rotateY: -162, duration: w.coverOpen, ease: e.coverOpen }, 0);
    } else {
      tl.to(coverHinge, { opacity: 0, y: -18, duration: w.coverOpen, ease: 'power2.out' }, 0);
    }

    if (pageTopGrip) {
      tl.to(pageTopGrip, { opacity: 1, duration: w.coverOpen * 0.35, ease: 'power1.out' }, w.coverOpen * 0.45);
    }

    let cursor = w.coverOpen;

    // Pages 1..N: Dwell -> Flip -> Dwell
    this.pages.forEach((page, i) => {
      const dwellDur = page.isContact
        ? w.contactDwell
        : page.id.startsWith('projects')
          ? w.projectsDwellPerPage
          : w.pageDwellDefault;

      const dwellStart = cursor;
      const dwellEnd = cursor + dwellDur;

      this.dwellWindows.push({
        id: page.id,
        pageIndex: i,
        startProg: dwellStart,
        endProg: dwellEnd,
        targetProg: dwellStart + dwellDur * 0.45,
      });

      if (this.simpleMode) {
        // Ensure page is visible during its dwell in simpleMode
        tl.to(this.pageEls[i], { opacity: 1, y: 0, duration: 1.2 }, Math.max(0, dwellStart - 1.2));
      }

      cursor = dwellEnd;

      // Flip page i up to reveal page i + 1 (except last page which stays flat until reverse cascade)
      if (i < this.pages.length - 1) {
        const flipStart = cursor;
        const pageEl = this.pageEls[i];
        const nextPageEl = this.pageEls[i + 1];
        const nextShadow = nextPageEl.querySelector<HTMLElement>('.page-flip-shadow');

        if (!this.simpleMode) {
          tl.to(
            pageEl,
            {
              rotateX: 165,
              duration: w.pageFlip,
              ease: e.pageFlip,
            },
            flipStart
          );
          // Subtle paper bend mid-flip
          tl.to(
            pageEl,
            { skewX: 2.2, duration: w.pageFlip * 0.45, ease: 'sine.out' },
            flipStart
          ).to(
            pageEl,
            { skewX: 0, duration: w.pageFlip * 0.55, ease: 'sine.in' },
            flipStart + w.pageFlip * 0.45
          );
          // Fade out past 100deg so top-flipped sheet doesn't collide with top chrome
          tl.to(
            pageEl,
            { opacity: 0, duration: w.pageFlip * 0.35, ease: 'power1.in' },
            flipStart + w.pageFlip * 0.52
          );
          if (nextShadow) {
            tl.fromTo(
              nextShadow,
              { opacity: 0 },
              { opacity: 0.7, duration: w.pageFlip * 0.45, yoyo: true, repeat: 1 },
              flipStart
            );
          }
        } else {
          tl.to(pageEl, { opacity: 0, y: -16, duration: w.pageFlip * 0.6 }, flipStart);
        }

        cursor += w.pageFlip;
      }
    });

    // Reverse Cascade: bring all flipped pages back down
    const reverseStart = cursor;
    const flippedPages = this.pageEls.slice(0, -1).reverse();
    if (!this.simpleMode) {
      flippedPages.forEach((el, idx) => {
        const offset = idx * (w.reverseCascade / Math.max(flippedPages.length + 2, 1)) * 0.55;
        tl.to(
          el,
          { opacity: 1, duration: w.reverseCascade * 0.35, ease: 'power1.out' },
          reverseStart + offset
        );
        tl.to(
          el,
          { rotateX: 0, duration: w.reverseCascade * 0.65, ease: e.reverseCascade },
          reverseStart + offset
        );
      });
    } else {
      tl.to(flippedPages, { opacity: 0, duration: w.reverseCascade * 0.5 }, reverseStart);
    }
    cursor += w.reverseCascade;

    // Cover Closes back over the stack
    const closeStart = cursor;
    if (pageTopGrip) {
      tl.to(pageTopGrip, { opacity: 0, duration: w.coverClose * 0.35, ease: 'power1.in' }, closeStart);
    }
    if (!this.simpleMode) {
      tl.to(coverHinge, { rotateY: 0, duration: w.coverClose, ease: e.coverClose }, closeStart);
      tl.to(folderRoot, { rotation: -1.35, scale: 1, x: 0, duration: w.coverClose, ease: e.coverClose }, closeStart);
    } else {
      tl.to(coverHinge, { opacity: 1, y: 0, duration: w.coverClose }, closeStart);
    }
    cursor += w.coverClose;

    // Real overhead Hand Stamper descends toward the folder, presses onto the paper,
    // leaves the "CASE CLOSED" impression, and lifts back toward the viewer.
    const stampStart = cursor;
    const slamMoment = stampStart + w.stampSlam * 0.55;

    if (handStamper && !this.simpleMode) {
      tl.fromTo(
        handStamper,
        { x: 0, y: 0, scale: 1.5, rotation: 4, opacity: 0 },
        { x: 0, y: 0, scale: 1.05, rotation: 0, opacity: 1, duration: w.stampSlam * 0.4, ease: 'power2.out' },
        stampStart
      )
        .to(
          handStamper,
          { scale: 0.97, duration: w.stampSlam * 0.16, ease: 'power4.in' },
          stampStart + w.stampSlam * 0.4
        )
        .to(
          handStamper,
          { x: 18, y: -18, scale: 1.48, rotation: 6, opacity: 0, duration: w.stampSlam * 0.42, ease: 'power2.in' },
          slamMoment + 0.08
        );
    }

    tl.fromTo(
      stampClosed,
      { scale: 1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.08, ease: 'none' },
      slamMoment + 0.04
    );

    if (!this.simpleMode) {
      tl.to(
        folderRoot,
        {
          x: 4,
          y: 3,
          duration: 0.08,
          yoyo: true,
          repeat: 3,
          ease: 'none',
        },
        slamMoment
      ).set(folderRoot, { x: 0, y: 0 });
    }

    tl.to(closedActions, { opacity: 1, y: 0, duration: w.postStampHold * 0.8 }, slamMoment + 0.15);
    cursor += w.stampSlam + w.postStampHold;

    // Normalize dwell window positions into 0..1 progress
    const totalDur = tl.duration();
    this.dwellWindows = this.dwellWindows.map((win) => ({
      ...win,
      startProg: win.startProg / totalDur,
      endProg: win.endProg / totalDur,
      targetProg: win.targetProg / totalDur,
    }));
  }

  private syncDwellState(progress: number): void {
    let foundIdx = -1;
    for (const win of this.dwellWindows) {
      if (progress >= win.startProg && progress <= win.endProg) {
        foundIdx = win.pageIndex;
        break;
      }
    }

    if (foundIdx === this.activePageIndex) return;

    // Trigger page-flip sound once per turn: either right when leaving a page into the flip
    // gap, or on a fast direct jump between pages (suppressed during Back-to-Top rewind).
    if (!this.suppressFlipSound) {
      if (foundIdx === -1 && this.activePageIndex >= 0 && progress > 0.12 && progress < 0.94) {
        soundEngine.playPaperFlip();
        this.flippedFromPage = this.activePageIndex;
      } else if (
        foundIdx >= 0 &&
        this.lastSettledPage !== -1 &&
        foundIdx !== this.lastSettledPage &&
        this.flippedFromPage === -1
      ) {
        soundEngine.playPaperFlip();
      }
    }

    if (foundIdx >= 0) {
      this.lastSettledPage = foundIdx;
      this.flippedFromPage = -1;
    }
    this.activePageIndex = foundIdx;

    this.pageEls.forEach((el, idx) => {
      const isActive = idx === foundIdx;
      el.classList.toggle('is-active', isActive);
      if (isActive) {
        el.removeAttribute('inert');
        if (this.pages[idx]?.isSkills) {
          animateSkillCheckboxes(el);
        }
      } else {
        el.setAttribute('inert', '');
      }
    });

    this.tabBtns.forEach((btn, idx) => {
      if (idx === foundIdx) {
        btn.setAttribute('aria-current', 'step');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  private syncAudioAndStampEvents(progress: number, _direction: number, closedActions: HTMLElement): void {
    // Play page-flip sound when cover opens or closes back down
    if (progress > 0.03 && !this.coverOpened) {
      this.coverOpened = true;
      if (!this.suppressFlipSound) soundEngine.playPaperFlip();
    } else if (progress < 0.02 && this.coverOpened) {
      this.coverOpened = false;
      this.lastSettledPage = -1;
      this.flippedFromPage = -1;
      if (!this.suppressFlipSound) soundEngine.playPaperFlip();
    }

    if (this.suppressFlipSound && progress <= 0.015) {
      this.suppressFlipSound = false;
    }

    // Stamp slam & Back-to-top interactivity
    const isClosed = progress >= 0.975;
    closedActions.classList.toggle('is-visible', isClosed);
    if (isClosed && !this.closedStamped) {
      this.closedStamped = true;
      soundEngine.playStampSlam();
    } else if (!isClosed && this.closedStamped) {
      this.closedStamped = false;
    }
  }

  public scrollToPage(pageIndex: number): void {
    const win = this.dwellWindows.find((d) => d.pageIndex === pageIndex);
    if (!win) return;
    this.scrollToProgress(win.targetProg);
  }

  public scrollToAnchor(anchorId: string): boolean {
    const normalized = anchorId.replace(/^#/, '').toLowerCase();
    const win = this.dwellWindows.find((d) => d.id.startsWith(normalized));
    if (!win) return false;
    this.scrollToProgress(win.targetProg);
    return true;
  }

  public scrollToProgress(progress: number, suppressFlipAudio = false): void {
    if (!this.trigger) return;
    if (suppressFlipAudio) {
      this.suppressFlipSound = true;
      window.setTimeout(() => {
        this.suppressFlipSound = false;
      }, 1300);
    }
    const clamped = Math.max(0, Math.min(1, progress));
    const y = this.trigger.start + clamped * (this.trigger.end - this.trigger.start);
    if (this.lenis) {
      this.lenis.scrollTo(y, {
        duration: 1.05,
        onComplete: () => {
          if (suppressFlipAudio) this.suppressFlipSound = false;
        },
      });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  private bindKeyboardNavigation(): void {
    window.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Home') {
        e.preventDefault();
        this.scrollToProgress(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.scrollToProgress(1);
      } else if (e.key === 'PageDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = Math.min(this.pages.length - 1, Math.max(0, this.activePageIndex + 1));
        this.scrollToPage(nextIdx);
      } else if (e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (this.activePageIndex <= 0) {
          this.scrollToProgress(0);
        } else {
          this.scrollToPage(this.activePageIndex - 1);
        }
      }
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        this.scrollToAnchor(window.location.hash);
      }
    });
  }

  private handleInitialRouteOrRestore(): void {
    if (window.location.hash && window.location.hash !== '#plain') {
      const jumped = this.scrollToAnchor(window.location.hash);
      if (jumped) return;
    }

    try {
      const saved = sessionStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        const prog = parseFloat(saved);
        if (!Number.isNaN(prog) && prog > 0.02) {
          window.requestAnimationFrame(() => {
            if (!this.trigger) return;
            const y = this.trigger.start + prog * (this.trigger.end - this.trigger.start);
            window.scrollTo(0, y);
            ScrollTrigger.update();
          });
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  public refresh(): void {
    ScrollTrigger.refresh();
  }

  public destroy(): void {
    this.trigger?.kill();
    this.masterTl?.kill();
    this.lenis?.destroy();
  }
}
