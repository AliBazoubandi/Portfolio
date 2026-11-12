import { CONTENT } from '../content';
import {
  renderCheckboxIcon,
  renderCircularBadge,
  renderMaskingTape,
  renderPaperclipBack,
  renderPaperclipFront,
  renderPostageFlagStamp,
} from '../svg/assets';

/**
 * Renders Page 0: the front cover matching the reference case-study folder
 * and the inside-cover surface revealed when the folder opens.
 */
export function renderCover(frontEl: HTMLElement, insideEl: HTMLElement): void {
  const leftCheckboxes = CONTENT.coverSkillsLeft.items
    .map(
      (item, idx) => `
      <div class="cb-row ${item.checked ? 'is-pending' : ''}" data-cover-cb="${idx}">
        ${renderCheckboxIcon(item.checked)}
        <span>${item.label}</span>
      </div>
    `
    )
    .join('');

  const rightCheckboxes = CONTENT.coverSkillsRight.items
    .map(
      (item, idx) => `
      <div class="cb-row ${item.checked ? 'is-pending' : ''}" data-cover-cb="${idx + CONTENT.coverSkillsLeft.items.length}">
        ${renderCheckboxIcon(item.checked)}
        <span>${item.label}</span>
      </div>
    `
    )
    .join('');

  frontEl.innerHTML = `
    <div class="cover-spine" aria-hidden="true">
      <span class="spine-code">${CONTENT.caseNumber}</span>
      <span class="spine-code">${CONTENT.domain}</span>
    </div>
    <div class="cover-body">
      <div class="cover-top-row">
        <div class="stamp-status" id="cover-status-stamp">${CONTENT.statusStamp}</div>

        <button
          type="button"
          id="cover-badge-btn"
          class="badge-btn"
          aria-label="Spin Ali Bazoubandi seal badge for a secret note"
        >
          ${renderCircularBadge(CONTENT.badgeEasterEgg.ringText)}
        </button>

        <div class="polaroid-wrap" data-parallax="0.9">
          ${renderPaperclipBack()}
          <figure class="polaroid-card" style="margin:0">
            <img
              class="polaroid-photo"
              src="${CONTENT.photo.src}"
              alt="${CONTENT.photo.alt}"
              width="${CONTENT.photo.width}"
              height="${CONTENT.photo.height}"
              decoding="async"
            />
            <figcaption class="polaroid-caption">${CONTENT.roleBanner}</figcaption>
          </figure>
          ${renderPaperclipFront()}
        </div>
      </div>

      <div class="cover-case-caption">${CONTENT.caseNumber} // PORTFOLIO</div>

      <div class="cover-form-box" data-parallax="0.35">
        ${renderPostageFlagStamp(CONTENT.location.flagCode, CONTENT.location.label)}

        <div class="form-line-row">
          <span class="field-label">Name</span>
          <h1 class="field-value-hero">${CONTENT.owner}</h1>
        </div>
        <div class="form-line-row form-line-row--split">
          <span class="field-label">Role</span>
          <span class="field-value">${CONTENT.roles.join(' & ')}</span>
          <span class="field-label">Age</span>
          <span class="field-value">${CONTENT.age}</span>
        </div>
        <div class="form-line-row">
          <span class="field-label">Currently</span>
          <span class="field-value">${CONTENT.currently}</span>
        </div>
      </div>

      <div class="cover-checkbox-grid" aria-label="Core technical summary">
        <div>
          <p class="cb-col-heading">${CONTENT.coverSkillsLeft.heading}</p>
          <div class="cb-list">${leftCheckboxes}</div>
        </div>
        <div>
          <p class="cb-col-heading">${CONTENT.coverSkillsRight.heading}</p>
          <div class="cb-list">${rightCheckboxes}</div>
        </div>
      </div>

      <div class="cover-about-box" data-parallax="0.25">
        <div class="tape-corner">${renderMaskingTape()}</div>
        <p class="about-box-tag">// ABOUT ME</p>
        <p class="about-box-copy">${CONTENT.aboutShort}</p>
        <div class="about-box-footer">
          <a
            href="${CONTENT.cv.url}"
            download="${CONTENT.cv.filename}"
            class="cover-cv-btn"
          >
            ↓ ${CONTENT.cv.label}
          </a>
          <div class="year-field">
            <span class="field-label">Year</span>
            <span class="year-field-val">${CONTENT.year}</span>
          </div>
        </div>
      </div>

      <div class="cover-footer-note">${CONTENT.footerRecordNote}</div>
    </div>
  `;

  insideEl.innerHTML = `
    <div class="inside-cover-label">PERSONAL FILE // ${CONTENT.owner.toUpperCase()}</div>
    <div class="inside-cover-pocket">
      <strong>ARCHIVE RECORD:</strong> ${CONTENT.caseNumber} · ${CONTENT.domain}<br />
      Scroll down to flip through the dossier pages, or use the right-hand index tabs to jump directly to any section.
    </div>
  `;
}

