import { CONTENT } from './content';
import { ProjectItem } from './github';
import { renderCheckboxIcon } from './svg/assets';

/**
 * Renders the fast, accessible plain single-page document layout
 * sharing the exact same design tokens and content.
 */
export function renderPlainPortfolio(container: HTMLElement, projects: ProjectItem[]): void {
  const factsHtml = CONTENT.about.quickFacts
    .map(
      (f) => `
      <div class="fact-row">
        <dt class="fact-label">${f.label}</dt>
        <dd class="fact-value">${f.value}</dd>
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
            <h3 class="timeline-role">${entry.title}</h3>
            <span class="timeline-dates">${entry.dates}</span>
          </div>
          <p class="timeline-org">${entry.organization}${entry.location ? ` · ${entry.location}` : ''}</p>
          <ul class="timeline-bullets">${entry.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        </article>
      `
      )
      .join('');

  const skillsHtml = CONTENT.skills
    .map(
      (group) => `
      <div class="skill-group-card">
        <h3 class="subsection-label">${group.category}</h3>
        <div class="skill-cb-list">
          ${group.items
            .map(
              (item) => `
            <div class="cb-row">
              ${renderCheckboxIcon(item.checked)}
              <span>${item.name}</span>
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
          <span class="project-type-tag">${project.type}</span>
          <span class="project-year">${project.year}${project.stars ? ` · ★ ${project.stars}` : ''}</span>
        </div>
        <h3 class="project-name">${project.name}</h3>
        <p class="project-client">${project.client}</p>
        <p class="project-desc">${project.description}</p>
        <div class="project-card-footer">
          <div class="tech-chips">${project.tech.map((t) => `<span class="tech-chip">${t}</span>`).join('')}</div>
          <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link-btn">OPEN FILE ↗</a>
        </div>
      </article>
    `
    )
    .join('');

  const socialsHtml = CONTENT.contact.socials
    .map(
      (s) => `
      <a href="${s.href}" target="_blank" rel="noopener noreferrer" class="social-chip-link">
        <span class="social-chip-k">${s.label}</span>
        <span class="social-chip-v">${s.handle} ↗</span>
      </a>
    `
    )
    .join('');

  container.innerHTML = `
    <article class="plain-dossier">
      <header class="plain-hero">
        <div class="plain-hero-id">
          <span class="stamp-status" style="display:inline-block; transform:rotate(-2deg)">${CONTENT.statusStamp}</span>
          <h1>${CONTENT.owner}</h1>
          <p class="plain-hero-roles">${CONTENT.roles.join(' · ')}</p>
          <p class="plain-hero-meta">${CONTENT.caseNumber} · Age ${CONTENT.age} · ${CONTENT.location.label} · ${CONTENT.currently}</p>
        </div>
        <img
          class="plain-photo"
          src="${CONTENT.photo.src}"
          alt="${CONTENT.photo.alt}"
          width="${CONTENT.photo.width}"
          height="${CONTENT.photo.height}"
        />
      </header>

      <nav class="plain-quick-nav" aria-label="Plain view sections">
        <a href="#plain-about">About</a>
        <a href="#plain-exp">Experience &amp; Education</a>
        <a href="#plain-skills">Skills</a>
        <a href="#plain-projects">Projects</a>
        <a href="#plain-thesis">Thesis</a>
        <a href="#plain-contact">Contact</a>
        <a href="${CONTENT.cv.url}" download="${CONTENT.cv.filename}">↓ Download CV</a>
      </nav>

      <section id="plain-about" class="plain-section">
        <h2>01 // About Me</h2>
        ${CONTENT.about.paragraphs.map((p) => `<p class="page-copy" style="margin-bottom:10px">${p}</p>`).join('')}
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
        <p><strong>${CONTENT.thesis.title}</strong> (${CONTENT.thesis.status})</p>
        <p class="page-copy" style="margin:8px 0">${CONTENT.thesis.abstract}</p>
        <p class="timeline-org">${CONTENT.thesis.university} · Supervisor: ${CONTENT.thesis.supervisor}</p>
        <div class="thesis-actions" style="margin-top:12px">
          <a href="${CONTENT.thesis.pdfUrl}" class="paper-action-btn" target="_blank" rel="noopener noreferrer">THESIS PDF ↗</a>
          <a href="${CONTENT.thesis.repoUrl}" class="paper-action-btn paper-action-btn--secondary" target="_blank" rel="noopener noreferrer">RESEARCH REPO ↗</a>
        </div>
      </section>

      <section id="plain-contact" class="plain-section">
        <h2>06 // Contact</h2>
        <p class="page-copy" style="margin-bottom:12px">${CONTENT.contact.intro}</p>
        <div class="contact-quick-row">
          <button type="button" class="copy-email-btn" data-copy-email="${CONTENT.contact.email}">
            <span class="copy-email-text">${CONTENT.contact.email}</span>
            <span class="copy-email-badge">COPY</span>
          </button>
          <a href="mailto:${CONTENT.contact.email}" class="paper-action-btn paper-action-btn--secondary">MAILTO ✉</a>
          <a href="${CONTENT.cv.url}" download="${CONTENT.cv.filename}" class="paper-action-btn">↓ ${CONTENT.cv.label}</a>
        </div>
        <div class="socials-row" style="margin-top:12px">${socialsHtml}</div>
      </section>
    </article>
  `;
}

