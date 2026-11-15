import { CONTENT } from '../content';
import { esc } from '../escape';

export function renderThesisPage(): string {
  const { thesis } = CONTENT;
  const keywords = thesis.keywords
    .map((kw) => `<span class="tech-chip">${esc(kw)}</span>`)
    .join('');

  return `
    <section class="page-inner" aria-labelledby="page-thesis-title">
      <header class="page-header">
        <h2 id="page-thesis-title" class="page-title">05 // RESEARCH &amp; THESIS</h2>
        <span class="page-folio">PAGE 05</span>
      </header>
      <div class="thesis-stamp-row">
        <span class="thesis-status-stamp">${esc(thesis.status)}</span>
        <span class="thesis-year">${esc(thesis.year)}</span>
      </div>
      <div class="paper-card">
        <h3 class="thesis-title">${esc(thesis.title)}</h3>
        <dl class="facts-list">
          <div class="fact-row">
            <dt class="fact-label">Institution</dt>
            <dd class="fact-value">${esc(thesis.university)}</dd>
          </div>
          <div class="fact-row">
            <dt class="fact-label">Supervisor</dt>
            <dd class="fact-value">${esc(thesis.supervisor)}</dd>
          </div>
        </dl>
      </div>
      <div class="paper-card">
        <p class="about-box-tag">// ABSTRACT</p>
        <p class="page-copy">${esc(thesis.abstract)}</p>
        <div class="tech-chips" style="margin-top: 10px">${keywords}</div>
      </div>
      <div class="thesis-actions">
        <a href="${esc(thesis.pdfUrl)}" class="paper-action-btn" target="_blank" rel="noopener noreferrer">
          THESIS PDF ↗
        </a>
        <a href="${esc(thesis.repoUrl)}" class="paper-action-btn paper-action-btn--secondary" target="_blank" rel="noopener noreferrer">
          RESEARCH REPO ↗
        </a>
      </div>
    </section>
  `;
}
