import { CONTENT, TimelineEntry } from '../content';

function renderEntry(entry: TimelineEntry): string {
  const bullets = entry.bullets.map((b) => `<li>${b}</li>`).join('');
  return `
    <article class="timeline-card">
      <div class="timeline-card-top">
        <h4 class="timeline-role">${entry.title}</h4>
        <span class="timeline-dates">${entry.dates}</span>
      </div>
      <p class="timeline-org">${entry.organization}${entry.location ? ` · ${entry.location}` : ''}</p>
      <ul class="timeline-bullets">${bullets}</ul>
    </article>
  `;
}

export function renderExperiencePage(): string {
  const expHtml = CONTENT.experience.map(renderEntry).join('');
  const eduHtml = CONTENT.education.map(renderEntry).join('');

  return `
    <section class="page-inner" aria-labelledby="page-exp-title">
      <header class="page-header">
        <h2 id="page-exp-title" class="page-title">02 // EXPERIENCE &amp; EDUCATION</h2>
        <span class="page-folio">PAGE 02</span>
      </header>
      <div class="exp-section">
        <h3 class="subsection-label">WORK EXPERIENCE</h3>
        <div class="timeline-list">${expHtml}</div>
      </div>
      <div class="exp-section">
        <h3 class="subsection-label">EDUCATION</h3>
        <div class="timeline-list">${eduHtml}</div>
      </div>
    </section>
  `;
}

