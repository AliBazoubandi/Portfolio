import { CONTENT } from '../content';
import { renderCheckboxIcon } from '../svg/assets';
import { esc } from '../escape';

export function renderSkillsPage(): string {
  let globalIdx = 0;
  const groupsHtml = CONTENT.skills
    .map((group) => {
      const itemsHtml = group.items
        .map((item) => {
          const idx = globalIdx++;
          return `
            <div class="cb-row skill-cb-row ${item.checked ? 'is-pending' : ''}" data-skill-idx="${idx}">
              ${renderCheckboxIcon(item.checked)}
              <span>${esc(item.name)}</span>
            </div>
          `;
        })
        .join('');

      return `
        <div class="skill-group-card">
          <h3 class="subsection-label">${esc(group.category)}</h3>
          <div class="skill-cb-list">${itemsHtml}</div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="page-inner" aria-labelledby="page-skills-title">
      <header class="page-header">
        <h2 id="page-skills-title" class="page-title">03 // TECHNICAL SKILLS</h2>
        <span class="page-folio">PAGE 03</span>
      </header>
      <p class="page-copy">Verified tools and production capabilities across software engineering, data infrastructure, and applied ML.</p>
      <div class="skills-grid">${groupsHtml}</div>
    </section>
  `;
}

/** Triggers sequential check animation when the Skills page enters view. */
export function animateSkillCheckboxes(pageEl: HTMLElement): void {
  const rows = pageEl.querySelectorAll<HTMLElement>('.skill-cb-row.is-pending');
  rows.forEach((row, i) => {
    window.setTimeout(() => {
      row.classList.remove('is-pending');
    }, i * 35);
  });
}
