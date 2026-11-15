import gsap from 'gsap';
import { soundEngine } from './audio';
import { CONTENT } from './content';
import { esc } from './escape';

let toastTimer: number | undefined;

/** Displays an on-theme rubber-stamp toast notification. */
export function showStampToast(message: string, variant: 'info' | 'secret' = 'info'): void {
  const toast = document.getElementById('toast-stamp');
  if (!toast) return;

  toast.textContent = message;
  toast.style.borderColor = variant === 'secret' ? 'var(--stamp-red)' : 'var(--accent-blue)';
  toast.style.color = variant === 'secret' ? 'var(--stamp-red)' : 'var(--ink)';
  toast.hidden = false;

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

/**
 * Sets up cover pointer/device-tilt parallax, circular badge click easter egg,
 * keyboard sequence easter eggs ("case" and Konami code), copy-to-clipboard,
 * and accessible contact form validation & submission.
 */
export function initInteractions(): void {
  initParallax();
  initEasterEggs();
  initCopyEmailButtons();
  initContactForm();
}

function initParallax(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!layers.length) return;

  // One reusable tween per axis per layer. quickTo mutates a single tween's target
  // instead of allocating a fresh tween on every pointer event, so a high-polling
  // mouse can no longer flood the shared GSAP ticker (Lenis + ScrollTrigger) and
  // drop frames — which is what made the cover layers visibly jitter.
  const setters = layers.map((el) => {
    const depth = Number(el.dataset.parallax || 0.4);
    return {
      depth,
      x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out', force3D: true }),
      y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out', force3D: true }),
    };
  });

  const cover = document.getElementById('cover-front');
  let targetX = 0;
  let targetY = 0;
  let rafId = 0;

  const apply = () => {
    rafId = 0;
    // The choreography marks the cover inert once it scrolls out of view; there is
    // nothing to parallax then, so skip the work entirely.
    if (cover?.inert) return;
    for (const s of setters) {
      s.x(targetX * 6 * s.depth);
      s.y(targetY * 5 * s.depth);
    }
  };

  // Coalesce bursts of pointer events into a single update per animation frame.
  const schedule = () => {
    if (!rafId) rafId = window.requestAnimationFrame(apply);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    },
    { passive: true }
  );

  // Device tilt is only used on touch devices so it never fights the mouse pointer.
  if (window.matchMedia('(pointer: coarse)').matches && window.DeviceOrientationEvent) {
    window.addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma === null || e.beta === null) return;
        targetX = Math.max(-1, Math.min(1, e.gamma / 25));
        targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        schedule();
      },
      { passive: true }
    );
  }
}

function initEasterEggs(): void {
  // (a) Clicking the round badge spins it and shows a short secret note
  const badgeBtn = document.getElementById('cover-badge-btn');
  badgeBtn?.addEventListener('click', () => {
    badgeBtn.classList.remove('is-spinning');
    void badgeBtn.offsetWidth;
    badgeBtn.classList.add('is-spinning');
    soundEngine.playPaperFlip();
    showStampToast(CONTENT.badgeEasterEgg.secretNote, 'info');
  });

  // (b) Typing "case" or Konami code triggers a fun stamp variation
  const konami = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  let typedBuffer = '';
  let konamiIdx = 0;

  window.addEventListener('keydown', (e) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (key.length === 1) {
      typedBuffer = (typedBuffer + key).slice(-4);
      if (typedBuffer === 'case') {
        soundEngine.playStampSlam();
        showStampToast('STAMP UNLOCKED: TOP SECRET // READY FOR HIRE', 'secret');
      }
    }

    if (key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        soundEngine.playStampSlam();
        showStampToast('KONAMI CLEARANCE: LEVEL 99 ENGINEER APPROVED!', 'secret');
      }
    } else {
      konamiIdx = 0;
    }
  });
}

function initCopyEmailButtons(): void {
  document.addEventListener('click', async (e) => {
    const btn = (e.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-copy-email]');
    if (!btn) return;
    const email = btn.dataset.copyEmail || '';
    const badge = btn.querySelector('.copy-email-badge');
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.className = 'visually-hidden';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    soundEngine.playStampSlam();
    if (badge) {
      badge.textContent = 'COPIED!';
      badge.classList.add('is-copied');
      window.setTimeout(() => {
        badge.textContent = 'COPY';
        badge.classList.remove('is-copied');
      }, 2200);
    }
    showStampToast(`COPIED TO CLIPBOARD: ${email}`);
  });
}

function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  const statusEl = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn') as HTMLButtonElement | null;
  const fields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[required], textarea[required]'
    )
  );

  // Accessible validation sync (:user-invalid + aria-invalid + aria-describedby + polite live region)
  const linkError = (el: HTMLElement, shown: boolean) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const syncFieldState = (el: HTMLInputElement | HTMLTextAreaElement, forceShow = false) => {
    const isInvalid = forceShow ? !el.validity.valid : el.matches(':user-invalid');
    el.classList.toggle('is-field-invalid', isInvalid);
    el.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
    linkError(el, isInvalid);
    return !isInvalid;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => syncFieldState(field, field.value.trim().length > 0));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        syncFieldState(field, false);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const gotcha = (form.elements.namedItem('_gotcha') as HTMLInputElement | null)?.value;
    if (gotcha) return;

    let firstInvalid: HTMLElement | null = null;
    for (const field of fields) {
      const ok = syncFieldState(field, true);
      if (!ok && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const endpoint = CONTENT.contact.formEndpoint.trim();
    const formData = new FormData(form);

    if (!endpoint) {
      // Graceful mailto fallback when no endpoint env var is set
      const name = String(formData.get('name') || '');
      const message = String(formData.get('message') || '');
      const subject = encodeURIComponent(`Portfolio Case Inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${formData.get('email')})`);
      if (statusEl) {
        statusEl.innerHTML = `<span class="sent-stamp">READY VIA EMAIL</span> <a href="${esc(`mailto:${CONTENT.contact.email}?subject=${subject}&body=${body}`)}">Open Mail App ↗</a>`;
      }
      soundEngine.playStampSlam();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'DISPATCHING...';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!res.ok) throw new Error('Network error');

      soundEngine.playStampSlam();
      form.reset();
      fields.forEach((f) => {
        f.classList.remove('is-field-invalid');
        f.setAttribute('aria-invalid', 'false');
        linkError(f, false);
      });
      if (statusEl) {
        statusEl.innerHTML = `<span class="sent-stamp">SENT</span> Dispatch delivered to ${esc(CONTENT.firstName)}.`;
      }
    } catch {
      if (statusEl) {
        statusEl.innerHTML = `Could not reach endpoint. <a href="${esc(`mailto:${CONTENT.contact.email}`)}">Send via email instead ↗</a>`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEND DISPATCH';
      }
    }
  });
}
