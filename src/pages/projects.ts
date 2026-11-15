import { ProjectItem } from '../github';
import { esc } from '../escape';

function renderProjectCard(project: ProjectItem): string {
  const chips = project.tech
    .slice(0, 5)
    .map((t) => `<span class="tech-chip">${esc(t)}</span>`)
    .join('');

  return `
    <article class="project-card">
      <div class="project-card-top">
        <span class="project-type-tag">${esc(project.type)}</span>
        <span class="project-year">${esc(project.year)}${project.stars ? ` · ★ ${esc(project.stars)}` : ''}</span>
      </div>
      <h3 class="project-name">${esc(project.name)}</h3>
      <p class="project-client">${esc(project.client)}</p>
      <p class="project-desc">${esc(project.description)}</p>
      <div class="project-card-footer">
        <div class="tech-chips">${chips}</div>
        <a
          href="${esc(project.url)}"
          target="_blank"
          rel="noopener noreferrer"
          class="project-link-btn"
        >
          OPEN FILE ↗ <span class="visually-hidden">${esc(project.name)}</span>
        </a>
      </div>
    </article>
  `;
}

/**
 * Splits projects into spreads: if <= 4 projects, renders 1 page;
 * if > 4 projects, paginates at 2 projects per page so every spread flips cleanly.
 */
export function renderProjectPages(projects: ProjectItem[]): { title: string; html: string }[] {
  if (projects.length <= 4) {
    const cards = projects.map(renderProjectCard).join('');
    return [
      {
        title: '04 // SELECTED CASE STUDIES',
        html: `
          <section class="page-inner" aria-labelledby="page-projects-0">
            <header class="page-header">
              <h2 id="page-projects-0" class="page-title">04 // PROJECTS</h2>
              <span class="page-folio">PAGE 04</span>
            </header>
            <div class="projects-grid">${cards}</div>
          </section>
        `,
      },
    ];
  }

  const pages: { title: string; html: string }[] = [];
  const perPage = 2;
  const totalSpreads = Math.ceil(projects.length / perPage);

  for (let i = 0; i < totalSpreads; i++) {
    const slice = projects.slice(i * perPage, i * perPage + perPage);
    const cards = slice.map(renderProjectCard).join('');
    pages.push({
      title: `04 // PROJECTS (${i + 1}/${totalSpreads})`,
      html: `
        <section class="page-inner" aria-labelledby="page-projects-${i}">
          <header class="page-header">
            <h2 id="page-projects-${i}" class="page-title">04 // PROJECTS (${i + 1}/${totalSpreads})</h2>
            <span class="page-folio">PAGE 04.${i + 1}</span>
          </header>
          <div class="projects-grid projects-grid--spread">${cards}</div>
        </section>
      `,
    });
  }

  return pages;
}
