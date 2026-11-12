import { CONTENT } from '../content';

export function renderContactPage(): string {
  const { contact, cv } = CONTENT;
  const socialsHtml = contact.socials
    .map(
      (s) => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-chip-link">
        <span class="social-chip-k">${s.label}</span>
        <span class="social-chip-v">${s.handle} ↗</span>
      </a>
    `
    )
    .join('');

  return `
    <section class="page-inner" aria-labelledby="page-contact-title">
      <header class="page-header">
        <h2 id="page-contact-title" class="page-title">${contact.heading}</h2>
        <span class="page-folio">PAGE 06</span>
      </header>
      <p class="page-copy">${contact.intro}</p>

      <div class="contact-quick-row">
        <button
          type="button"
          class="copy-email-btn"
          data-copy-email="${contact.email}"
          aria-label="Copy email address ${contact.email}"
        >
          <span class="copy-email-text">${contact.email}</span>
          <span class="copy-email-badge">COPY</span>
        </button>
        <a href="mailto:${contact.email}" class="paper-action-btn paper-action-btn--secondary">
          MAILTO ✉
        </a>
        <a href="${cv.url}" download="${cv.filename}" class="paper-action-btn">
          ↓ ${cv.label}
        </a>
      </div>

      <div class="socials-row">${socialsHtml}</div>

      <form class="dossier-form" id="contact-form" novalidate aria-labelledby="contact-form-heading">
        <p id="contact-form-heading" class="about-box-tag">// DISPATCH MESSAGE</p>

        <!-- Honeypot against bots -->
        <div class="visually-hidden" aria-hidden="true">
          <label for="company-website">Leave this blank</label>
          <input type="text" id="company-website" name="_gotcha" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form-grid-2">
          <div class="form-field">
            <label for="contact-name">Your Name <span aria-hidden="true">*</span></label>
            <input
              type="text"
              id="contact-name"
              name="name"
              autocomplete="name"
              required
              minlength="2"
              aria-invalid="false"
              data-error="contact-name-error"
              enterkeyhint="next"
            />
            <div id="contact-name-error" class="field-error">
              <span role="img" aria-label="Error">!</span> Please enter your name (at least 2 characters).
            </div>
          </div>

          <div class="form-field">
            <label for="contact-email">Email Address <span aria-hidden="true">*</span></label>
            <input
              type="email"
              id="contact-email"
              name="email"
              autocomplete="email"
              autocorrect="off"
              autocapitalize="none"
              spellcheck="false"
              required
              aria-invalid="false"
              data-error="contact-email-error"
              enterkeyhint="next"
            />
            <div id="contact-email-error" class="field-error">
              <span role="img" aria-label="Error">!</span> Enter a valid email like you@example.com.
            </div>
          </div>
        </div>

        <div class="form-field">
          <label for="contact-message">Message <span aria-hidden="true">*</span></label>
          <textarea
            id="contact-message"
            name="message"
            rows="3"
            required
            minlength="10"
            aria-invalid="false"
            data-error="contact-message-error"
            enterkeyhint="send"
          ></textarea>
          <div id="contact-message-error" class="field-error">
            <span role="img" aria-label="Error">!</span> Please write at least 10 characters.
          </div>
        </div>

        <div class="form-submit-row">
          <button type="submit" class="paper-action-btn" id="contact-submit-btn">
            SEND DISPATCH
          </button>
          <div class="form-status" id="contact-form-status" role="status" aria-live="polite"></div>
        </div>
      </form>
    </section>
  `;
}

