import { CONTENT } from '../content';

export function renderAboutPage(): string {
  const paragraphs = CONTENT.about.paragraphs
    .map((p) => `<p class="page-copy">${p}</p>`)
    .join('');

  const facts = CONTENT.about.quickFacts
    .map(
      (fact) => `
      <div class="fact-row">
        <dt class="fact-label">${fact.label}</dt>
        <dd class="fact-value">${fact.value}</dd>
      </div>
    `
    )
    .join('');

  return `
    <section class="page-inner" aria-labelledby="page-about-title">
      <header class="page-header">
        <h2 id="page-about-title" class="page-title">${CONTENT.about.heading}</h2>
        <span class="page-folio">PAGE 01</span>
      </header>
      <div class="about-paragraphs">${paragraphs}</div>
      <div class="paper-card">
        <p class="about-box-tag">// QUICK FACTS RECORD</p>
        <dl class="facts-list">${facts}</dl>
      </div>
    </section>
  `;
}

