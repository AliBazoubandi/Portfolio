import gsap from 'gsap';
import { soundEngine } from './audio';
import { CONTENT } from './content';

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

  const layers = document.querySelectorAll<HTMLElement>('[data-parallax]');
  if (!layers.length) return;

  const moveLayers = (nx: number, ny: number) => {
    layers.forEach((el) => {
      const depth = Number(el.dataset.parallax || 0.4);
      gsap.to(el, {
        x: nx * 6 * depth,
        y: ny * 5 * depth,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      moveLayers(nx, ny);
    },
    { passive: true }
  );

  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma === null || e.beta === null) return;
        const nx = Math.max(-1, Math.min(1, e.gamma / 25));
        const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        moveLayers(nx, ny);
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
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required], textarea[required]'));

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
        statusEl.innerHTML = `<span class="sent-stamp">READY VIA EMAIL</span> <a href="mailto:${CONTENT.contact.email}?subject=${subject}&body=${body}">Open Mail App ↗</a>`;
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
        statusEl.innerHTML = `<span class="sent-stamp">SENT</span> Dispatch delivered to ${CONTENT.firstName}.`;
      }
    } catch {
      if (statusEl) {
        statusEl.innerHTML = `Could not reach endpoint. <a href="mailto:${CONTENT.contact.email}">Send via email instead ↗</a>`;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'SEND DISPATCH';
      }
    }
  });
}

