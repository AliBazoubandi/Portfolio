/**
 * Central content file for Ali Bazoubandi's Portfolio.
 * Edit all personal copy, links, skills, education, experience, and thesis here.
 * Every placeholder value is marked with a `TODO` comment.
 */

export interface CoverCheckboxItem {
  label: string;
  checked: boolean;
}

export interface TimelineEntry {
  title: string;
  organization: string;
  location?: string;
  dates: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: {
    name: string;
    checked: boolean;
  }[];
}

export interface ThesisContent {
  title: string;
  status: string;
  university: string;
  supervisor: string;
  year: string;
  keywords: string[];
  abstract: string;
  pdfUrl: string;
  repoUrl: string;
}

export interface SocialLink {
  id: 'email' | 'github' | 'linkedin' | 'telegram';
  label: string;
  handle: string;
  href: string;
}

export interface PortfolioContent {
  owner: string;
  firstName: string;
  roles: string[];
  roleBanner: string;
  age: number;
  domain: string;
  caseNumber: string;
  statusStamp: string;
  closedStamp: string;
  footerRecordNote: string;
  photo: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  location: {
    label: string;
    flagCode: 'IR' | 'CA' | 'DE' | 'NL' | 'US' | 'GB';
  };
  currently: string;
  year: string;
  /** Max ~4 lines for the taped cover note box. */
  aboutShort: string;
  coverSkillsLeft: {
    heading: string;
    items: CoverCheckboxItem[];
  };
  coverSkillsRight: {
    heading: string;
    items: CoverCheckboxItem[];
  };
  cv: {
    url: string;
    filename: string;
    label: string;
  };
  github: {
    username: string;
    /** Repo names to prioritize when fetching from GitHub API. */
    pinnedRepos: string[];
    maxProjects: number;
  };
  about: {
    heading: string;
    paragraphs: string[];
    quickFacts: { label: string; value: string }[];
  };
  education: TimelineEntry[];
  experience: TimelineEntry[];
  skills: SkillGroup[];
  thesis: ThesisContent;
  contact: {
    heading: string;
    intro: string;
    email: string;
    socials: SocialLink[];
    formEndpoint: string;
    formNote: string;
  };
  badgeEasterEgg: {
    ringText: string;
    secretNote: string;
  };
  seo: {
    title: string;
    description: string;
    url: string;
    sameAs: string[];
  };
}

export const CONTENT: PortfolioContent = {
  owner: 'Ali Bazoubandi',
  firstName: 'Ali',
  roles: ['Software Engineer', 'Data Scientist'],
  roleBanner: 'SOFTWARE ENGINEER / DATA SCIENTIST',
  age: 25,
  // TODO: Replace with your live domain
  domain: 'AliBazoubandi.me',
  caseNumber: 'CASE FILE #01',
  statusStamp: 'AVAILABLE FOR WORK',
  closedStamp: 'CASE CLOSED',
  footerRecordNote: 'INFORMATION IN THIS RECORD IS PUBLIC',

  photo: {
    // TODO: Drop your real halftone portrait at public/assets/photo-halftone.png
    src: '/assets/photo-halftone.png',
    alt: 'Pop-art halftone portrait of Ali Bazoubandi',
    width: 1254,
    height: 1254,
  },

  location: {
    // TODO: Replace with your city/country and matching flagCode ('IR' | 'CA' | 'DE' | 'NL' | 'US' | 'GB')
    label: 'IRAN',
    flagCode: 'IR',
  },

  // TODO: Update your current focus / availability summary
  currently: 'Building ML pipelines & full-stack systems',
  year: String(new Date().getFullYear()),

  // TODO: Customize your 3–4 line cover bio
  aboutShort:
    'Software engineer and data scientist building production backends, ERP integrations, and applied machine learning pipelines. Focused on turning messy operational data into reliable, observable software.',

  coverSkillsLeft: {
    heading: 'STACK:',
    items: [
      { label: 'PYTHON', checked: true },
      { label: 'SQL', checked: true },
      { label: 'PHP', checked: true },
      { label: 'JS / TYPESCRIPT', checked: true },
      { label: 'RUST / GO', checked: false },
    ],
  },

  coverSkillsRight: {
    heading: 'FOCUS:',
    items: [
      { label: 'MACHINE LEARNING', checked: true },
      { label: 'DATA PIPELINES', checked: true },
      { label: 'ERP INTEGRATIONS', checked: true },
      { label: 'THREE.JS / WEBGL', checked: true },
    ],
  },

  cv: {
    // TODO: Place your real CV PDF at public/assets/Ali-Bazoubandi-CV.pdf
    url: '/assets/Ali-Bazoubandi-CV.pdf',
    filename: 'Ali-Bazoubandi-CV.pdf',
    label: 'DOWNLOAD CV',
  },

  github: {
    username: 'alibazoubandi',
    pinnedRepos: [
      'data-gateway',
      'Intelligent-BPM',
      'competitor-price-intelligence',
      'family-library-3d',
      'Bale-Telegram-Bot',
    ],
    maxProjects: 6,
  },

  about: {
    heading: '01 // ABOUT ME',
    // TODO: Replace with your full biography paragraphs
    paragraphs: [
      'I am Ali Bazoubandi, a 25-year-old Software Engineer and Data Scientist who enjoys living at the intersection of dependable systems engineering and statistical modeling.',
      'Across enterprise ERP integrations, automated ETL workflows, and applied ML research, I prefer pragmatic architectures: clean schemas, reproducible experiments, fast APIs, and interfaces that respect the person using them.',
    ],
    quickFacts: [
      { label: 'Full Name', value: 'Ali Bazoubandi' },
      { label: 'Primary Roles', value: 'Software Engineer · Data Scientist' },
      // TODO: Update location, languages, and interests
      { label: 'Base / Location', value: 'Tehran, Iran (Remote-ready)' },
      { label: 'Languages', value: 'Persian (Native), English (Fluent)' },
      { label: 'Interests', value: 'ML Systems, Data Engineering, Creative Web' },
    ],
  },

  education: [
    {
      // TODO: Replace with your actual degree, university, dates, and highlights
      title: 'M.Sc. in Computer Science / Data Science',
      organization: 'University of Tehran (Placeholder)',
      location: 'Tehran',
      dates: '2023 – 2025',
      bullets: [
        'Research focus on time-series anomaly detection and interpretable tabular ML.',
        'Graduate coursework in distributed systems, statistical learning, and optimization.',
      ],
    },
    {
      // TODO: Replace with your Bachelor's degree details
      title: 'B.Sc. in Software Engineering',
      organization: 'Sharif / Engineering University (Placeholder)',
      location: 'Tehran',
      dates: '2019 – 2023',
      bullets: [
        'Built database-backed web systems and mentored junior students in algorithms.',
        'Capstone project on automated invoice reconciliation and ETL orchestration.',
      ],
    },
  ],

  experience: [
    {
      // TODO: Replace with your current / most recent job
      title: 'Software Engineer & Data Scientist',
      organization: 'Enterprise Systems & Analytics Team (Placeholder)',
      dates: '2024 – Present',
      bullets: [
        'Designed Python & SQL data pipelines syncing financial and inventory records across ERP modules with sub-minute latency.',
        'Built REST/webhook middleware in PHP & TypeScript with idempotent retry queues and audit logs.',
        'Trained demand-forecasting and outlier-detection models integrated directly into operational dashboards.',
      ],
    },
    {
      // TODO: Replace with earlier role / internship
      title: 'Backend & Integration Developer',
      organization: 'Cloud Commerce Studio (Placeholder)',
      dates: '2022 – 2024',
      bullets: [
        'Maintained high-throughput PHP/Laravel and Node.js services powering multi-tenant reporting.',
        'Reduced analytical SQL query latency by 62% via partitioning, indexing, and materialized views.',
      ],
    },
  ],

  skills: [
    {
      category: 'Languages',
      items: [
        { name: 'Python', checked: true },
        { name: 'SQL (Postgres)', checked: true },
        { name: 'TypeScript / JS', checked: true },
        { name: 'PHP', checked: true },
        { name: 'Bash', checked: true },
      ],
    },
    {
      category: 'Data & ML',
      items: [
        { name: 'scikit-learn / XGBoost', checked: true },
        { name: 'PyTorch', checked: true },
        { name: 'Pandas / Polars', checked: true },
        { name: 'Airflow / dbt', checked: true },
        { name: 'MLflow', checked: true },
      ],
    },
    {
      category: 'Backend & ERP',
      items: [
        { name: 'FastAPI / Laravel', checked: true },
        { name: 'ERP Connectors', checked: true },
        { name: 'Webhooks & Queues', checked: true },
        { name: 'REST / GraphQL', checked: true },
      ],
    },
    {
      category: 'Frontend & 3D',
      items: [
        { name: 'HTML5 / Modern CSS', checked: true },
        { name: 'Three.js / WebGL', checked: true },
        { name: 'GSAP / Canvas', checked: true },
        { name: 'Accessibility (a11y)', checked: true },
      ],
    },
    {
      category: 'Tools & Ops',
      items: [
        { name: 'Docker / Linux', checked: true },
        { name: 'Git / CI-CD', checked: true },
        { name: 'PostgreSQL / Redis', checked: true },
        { name: 'Observability', checked: true },
      ],
    },
  ],

  thesis: {
    // TODO: Replace with your real thesis title, abstract, supervisor, and links
    title: 'Robust Anomaly Detection in Heterogeneous Enterprise Event Streams',
    status: 'COMPLETED // DEFENDED 2025',
    university: 'Department of Computer Science (TODO: University Name)',
    supervisor: 'Dr. Placeholder Supervisor',
    year: '2025',
    keywords: [
      'Time-Series',
      'Anomaly Detection',
      'Representation Learning',
      'Data Pipelines',
      'ERP Logs',
    ],
    abstract:
      'Enterprise operational logs combine structured transactional tables with irregular event timestamps, causing standard univariate detectors to trigger excessive false positives. This thesis proposes a lightweight hybrid architecture combining temporal feature aggregation with self-supervised tabular embeddings, improving F1 detection accuracy by 14% on real-world ERP audit streams while keeping inference latency under 12 ms per batch.',
    // TODO: Link your real thesis PDF and repository
    pdfUrl: '#thesis-pdf-todo',
    repoUrl: 'https://github.com/alibazoubandi',
  },

  contact: {
    heading: '06 // OPEN A NEW CASE',
    intro:
      'Available for full-time roles, ML/data engineering consulting, or technically ambitious collaborations.',
    // TODO: Replace with your real email address
    email: 'hello@alibazoubandi.me',
    socials: [
      {
        id: 'github',
        label: 'GitHub',
        // TODO: Update handle & href
        handle: 'github.com/alibazoubandi',
        href: 'https://github.com/alibazoubandi',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        // TODO: Update handle & href
        handle: 'linkedin.com/in/alibazoubandi',
        href: 'https://linkedin.com/in/alibazoubandi',
      },
      {
        id: 'telegram',
        label: 'Telegram',
        // TODO: Update handle & href
        handle: '@alibazoubandi',
        href: 'https://t.me/alibazoubandi',
      },
    ],
    // TODO: Set VITE_CONTACT_ENDPOINT in .env (e.g. https://formspree.io/f/your_id)
    formEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || '',
    formNote: 'Direct dispatch via encrypted endpoint — or use mailto fallback below.',
  },

  badgeEasterEgg: {
    ringText: 'ENGINEER • DATA SCIENTIST • ALI BAZOUBANDI • ',
    secretNote: 'CASE NOTE: Clean data beats clever tricks. Type "case" anytime for a bonus stamp!',
  },

  seo: {
    title: 'Ali Bazoubandi — Software Engineer & Data Scientist | Case File Portfolio',
    description:
      'Interactive case-study folder portfolio of Ali Bazoubandi — Software Engineer and Data Scientist specializing in Python, SQL, PHP, TypeScript, Machine Learning, Data Pipelines, and ERP Integrations.',
    // TODO: Replace with canonical deployed URL
    url: 'https://alibazoubandi.me',
    sameAs: ['https://github.com/alibazoubandi', 'https://linkedin.com/in/alibazoubandi'],
  },
};
