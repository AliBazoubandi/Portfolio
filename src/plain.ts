import { CONTENT } from './content';
import { ProjectItem } from './github';
import { renderCheckboxIcon, renderCircularBadge } from './svg/assets';
import { esc } from './escape';

/**
 * Renders the fast, accessible plain single-page document layout
 * sharing the exact same design tokens and content.
 */
export function renderPlainPortfolio(container: HTMLElement, projects: ProjectItem[]): void {
  const factsHtml = CONTENT.about.quickFacts
    .map(
      (f) => `
      <div class="fact-row">
        <dt class="fact-label">${esc(f.label)}</dt>
        <dd class="fact-value">${esc(f.value)}</dd>
      </div>
    `
    )
    .join('');

  const renderTimeline = (items: typeof CONTENT.experience) =>
    items
      .map(
        (entry) => `
        <article class="timeline-card">
          <div class="timeline-card-top">
            <h3 class="timeline-role">${esc(entry.title)}</h3>
            <span class="timeline-dates">${esc(entry.dates)}</span>
          </div>
          <p class="timeline-org">${esc(entry.organization)}${entry.location ? ` · ${esc(entry.location)}` : ''}</p>
          <ul class="timeline-bullets">${entry.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        </article>
      `
      )
      .join('');

  const skillsHtml = CONTENT.skills
    .map(
      (group) => `
      <div class="skill-group-card">
        <h3 class="subsection-label">${esc(group.category)}</h3>
        <div class="skill-cb-list">
          ${group.items
            .map(
              (item) => `
            <div class="cb-row">
              ${renderCheckboxIcon(item.checked)}
              <span>${esc(item.name)}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const projectsHtml = projects
    .map(
      (project) => `
      <article class="project-card">
        <div class="project-card-top">
          <span class="project-type-tag">${esc(project.type)}</span>
          <span class="project-year">${esc(project.year)}${project.stars ? ` · ★ ${esc(project.stars)}` : ''}</span>
        </div>
        <h3 class="project-name">${esc(project.name)}</h3>
        <p class="project-client">${esc(project.client)}</p>
        <p class="project-desc">${esc(project.description)}</p>
        <div class="project-card-footer">
          <div class="tech-chips">${project.tech.map((t) => `<span class="tech-chip">${esc(t)}</span>`).join('')}</div>
          <a href="${esc(project.url)}" target="_blank" rel="noopener noreferrer" class="project-link-btn">OPEN FILE ↗</a>
        </div>
      </article>
    `
    )
    .join('');

  const socialsHtml = CONTENT.contact.socials
    .map(
      (s) => `
      <a href="${esc(s.href)}" target="_blank" rel="noopener noreferrer" class="social-chip-link">
        <span class="social-chip-k">${esc(s.label)}</span>
        <span class="social-chip-v">${esc(s.handle)} ↗</span>
      </a>
    `
    )
    .join('');

  container.innerHTML = `
    <article class="plain-dossier">
      <header class="plain-hero">
        <div class="plain-hero-id">
          <div class="plain-hero-brand">
            ${renderCircularBadge(CONTENT.badgeEasterEgg.ringText)}
            <span class="stamp-status" style="display:inline-block; transform:rotate(-2deg)">${esc(CONTENT.statusStamp)}</span>
          </div>
          <h1>${esc(CONTENT.owner)}</h1>
          <p class="plain-hero-roles">${esc(CONTENT.roles.join(' · '))}</p>
          <p class="plain-hero-meta">${esc(CONTENT.caseNumber)} · Age ${esc(CONTENT.age)} · ${esc(CONTENT.location.label)} · ${esc(CONTENT.currently)}</p>
        </div>
        <span class="plain-photo-frame">
          <span class="plain-photo-clip">
            <img
              class="plain-photo"
              src="${esc(CONTENT.photo.src)}"
              alt="${esc(CONTENT.photo.alt)}"
              width="${esc(CONTENT.photo.width)}"
              height="${esc(CONTENT.photo.height)}"
            />
          </span>
        </span>
      </header>

      <nav class="plain-quick-nav" aria-label="Plain view sections">
        <a href="#plain-about">About</a>
        <a href="#plain-exp">Experience &amp; Education</a>
        <a href="#plain-skills">Skills</a>
        <a href="#plain-projects">Projects</a>
        <a href="#plain-thesis">Thesis</a>
        <a href="#plain-contact">Contact</a>
        <a href="${esc(CONTENT.cv.url)}" download="${esc(CONTENT.cv.filename)}">↓ Download CV</a>
      </nav>

      <section id="plain-about" class="plain-section">
        <h2>01 // About Me</h2>
        ${CONTENT.about.paragraphs.map((p) => `<p class="page-copy" style="margin-bottom:10px">${esc(p)}</p>`).join('')}
        <dl class="facts-list">${factsHtml}</dl>
      </section>

      <section id="plain-exp" class="plain-section">
        <h2>02 // Experience &amp; Education</h2>
        <h3 class="subsection-label">Work Experience</h3>
        <div class="timeline-list" style="margin-bottom:16px">${renderTimeline(CONTENT.experience)}</div>
        <h3 class="subsection-label">Education</h3>
        <div class="timeline-list">${renderTimeline(CONTENT.education)}</div>
      </section>

      <section id="plain-skills" class="plain-section">
        <h2>03 // Technical Skills</h2>
        <div class="skills-grid">${skillsHtml}</div>
      </section>

      <section id="plain-projects" class="plain-section">
        <h2>04 // Projects</h2>
        <div class="projects-grid">${projectsHtml}</div>
      </section>

      <section id="plain-thesis" class="plain-section">
        <h2>05 // Thesis &amp; Research</h2>
        <p><strong>${esc(CONTENT.thesis.title)}</strong> (${esc(CONTENT.thesis.status)})</p>
        <p class="page-copy" style="margin:8px 0">${esc(CONTENT.thesis.abstract)}</p>
        <p class="timeline-org">${esc(CONTENT.thesis.university)} · Supervisor: ${esc(CONTENT.thesis.supervisor)}</p>
        <div class="thesis-actions" style="margin-top:12px">
          <a href="${esc(CONTENT.thesis.pdfUrl)}" class="paper-action-btn" target="_blank" rel="noopener noreferrer">THESIS PDF ↗</a>
          <a href="${esc(CONTENT.thesis.repoUrl)}" class="paper-action-btn paper-action-btn--secondary" target="_blank" rel="noopener noreferrer">RESEARCH REPO ↗</a>
        </div>
      </section>

      <section id="plain-contact" class="plain-section">
        <h2>06 // Contact</h2>
        <p class="page-copy" style="margin-bottom:12px">${esc(CONTENT.contact.intro)}</p>
        <div class="contact-quick-row">
          <button type="button" class="copy-email-btn" data-copy-email="${esc(CONTENT.contact.email)}">
            <span class="copy-email-text">${esc(CONTENT.contact.email)}</span>
            <span class="copy-email-badge">COPY</span>
          </button>
          <a href="mailto:${esc(CONTENT.contact.email)}" class="paper-action-btn paper-action-btn--secondary">MAILTO ✉</a>
          <a href="${esc(CONTENT.cv.url)}" download="${esc(CONTENT.cv.filename)}" class="paper-action-btn">↓ ${esc(CONTENT.cv.label)}</a>
        </div>
        <div class="socials-row" style="margin-top:12px">${socialsHtml}</div>
      </section>
    </article>
  `;
}
