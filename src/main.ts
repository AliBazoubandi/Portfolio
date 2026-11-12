import '@fontsource/jost/500.css';
import '@fontsource/jost/600.css';
import '@fontsource/jost/700.css';
import '@fontsource/special-elite/400.css';

import './styles/tokens.css';
import './styles/folder.css';
import './styles/pages.css';
import './styles/plain.css';

import gsap from 'gsap';
import { CONFIG } from './config';
import { soundEngine } from './audio';
import { loadProjects } from './github';
import { initInteractions } from './interactions';
import { renderCover } from './pages/cover';
import { renderAboutPage } from './pages/about';
import { renderExperiencePage } from './pages/experience';
import { renderSkillsPage } from './pages/skills';
import { renderProjectPages } from './pages/projects';
import { renderThesisPage } from './pages/thesis';
import { renderContactPage } from './pages/contact';
import { renderPlainPortfolio } from './plain';
import { FolderChoreography, PageDefinition } from './timeline';

async function bootstrap(): Promise<void> {
  const loaderEl = document.getElementById('folder-loader');
  const loaderTimer = window.setTimeout(() => {
    if (loaderEl) loaderEl.hidden = false;
  }, CONFIG.loaderDelayMs);

  const coverFront = document.getElementById('cover-front');
  const coverInside = document.getElementById('cover-inside');
  const folderRoot = document.getElementById('folder-root');
  const mainStage = document.getElementById('main-stage');
  const plainRoot = document.getElementById('plain-root');
  const plainToggleBtn = document.getElementById('plain-toggle-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  if (!coverFront || !coverInside || !folderRoot || !mainStage || !plainRoot) {
    window.clearTimeout(loaderTimer);
    return;
  }

  // 1. Render Cover immediately
  renderCover(coverFront, coverInside);
  folderRoot.classList.add('is-closed-hover');

  // 2. Load projects (GitHub API with curated JSON fallback)
  const projects = await loadProjects();
  const projectPages = renderProjectPages(projects);

  const pages: PageDefinition[] = [
    { id: 'about', tabLabel: '01 ABOUT', html: renderAboutPage() },
    { id: 'experience', tabLabel: '02 EXP', html: renderExperiencePage() },
    { id: 'skills', tabLabel: '03 SKILLS', html: renderSkillsPage(), isSkills: true },
    ...projectPages.map((p, i) => ({
      id: projectPages.length > 1 ? `projects-${i + 1}` : 'projects',
      tabLabel: projectPages.length > 1 ? `04 PROJ ${i + 1}` : '04 PROJ',
      html: p.html,
    })),
    { id: 'thesis', tabLabel: '05 THESIS', html: renderThesisPage() },
    { id: 'contact', tabLabel: '06 CONTACT', html: renderContactPage(), isContact: true },
  ];

  // 3. Initialize scroll-driven 3D choreography
  const choreography = new FolderChoreography(pages);
  await choreography.init();

  // 4. Mount interactions (parallax, easter eggs, email copy, contact form)
  initInteractions();

  // 5. Sound Toggle UI
  const updateSoundButton = (enabled: boolean) => {
    if (!soundToggleBtn) return;
    soundToggleBtn.setAttribute('aria-pressed', String(enabled));
    const icon = soundToggleBtn.querySelector('.sound-icon');
    const label = soundToggleBtn.querySelector('.sound-label');
    if (icon) icon.textContent = enabled ? '🔊' : '🔇';
    if (label) label.textContent = enabled ? 'SOUND: ON' : 'SOUND: OFF';
  };
  updateSoundButton(soundEngine.isEnabled());

  soundToggleBtn?.addEventListener('click', () => {
    const nowOn = soundEngine.toggle();
    updateSoundButton(nowOn);
  });

  // 6. Plain Version Toggle (?view=plain or #plain)
  let plainMode =
    new URLSearchParams(window.location.search).get('view') === 'plain' ||
    window.location.hash === '#plain';

  const applyPlainMode = (enabled: boolean) => {
    plainMode = enabled;
    if (enabled && !plainRoot.hasChildNodes()) {
      renderPlainPortfolio(plainRoot, projects);
    }
    plainRoot.hidden = !enabled;
    mainStage.hidden = enabled;
    if (plainToggleBtn) {
      plainToggleBtn.setAttribute('aria-pressed', String(enabled));
      const lbl = plainToggleBtn.querySelector('.pill-label');
      if (lbl) lbl.textContent = enabled ? 'RETURN TO 3D FOLDER' : 'SKIP TO PLAIN VERSION';
    }
    if (!enabled) {
      window.requestAnimationFrame(() => choreography.refresh());
    }
    const url = new URL(window.location.href);
    if (enabled) url.searchParams.set('view', 'plain');
    else url.searchParams.delete('view');
    window.history.replaceState({}, '', url.toString());
  };

  if (plainMode) applyPlainMode(true);

  plainToggleBtn?.addEventListener('click', () => {
    applyPlainMode(!plainMode);
  });

  // 7. Run Cover entrance animation if starting at the top
  if (window.scrollY < 40 && !plainMode) {
    runCoverEntrance(folderRoot, coverFront);
  } else {
    coverFront.querySelectorAll<HTMLElement>('.cb-row.is-pending').forEach((el) => el.classList.remove('is-pending'));
  }

  // Dismiss loader if shown
  window.clearTimeout(loaderTimer);
  if (loaderEl) loaderEl.hidden = true;
}

function runCoverEntrance(folderRoot: HTMLElement, coverFront: HTMLElement): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const checkboxes = coverFront.querySelectorAll<HTMLElement>('.cb-row.is-pending');
  const statusStamp = document.getElementById('cover-status-stamp');

  if (prefersReduced) {
    checkboxes.forEach((el) => el.classList.remove('is-pending'));
    return;
  }

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .fromTo(
      folderRoot,
      { y: 54, opacity: 0, rotation: -3 },
      { y: 0, opacity: 1, rotation: -1.35, duration: 0.68 }
    )
    .to(
      folderRoot,
      { rotation: -0.95, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' },
      '-=0.12'
    );

  if (statusStamp) {
    intro.fromTo(
      statusStamp,
      { scale: 1.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.26, ease: 'power4.in', clearProps: 'transform' },
      '-=0.22'
    );
  }

  checkboxes.forEach((row, idx) => {
    intro.call(() => row.classList.remove('is-pending'), undefined, 0.5 + idx * 0.055);
  });
}

void bootstrap();
