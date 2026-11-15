import fallbackProjects from './projects.json';
import { CONTENT } from './content';

export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  type: string;
  tech: string[];
  description: string;
  year: string;
  url: string;
  stars?: number;
  source?: 'github' | 'curated';
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

interface RepoCacheEntry {
  ts: number;
  repos: GitHubRepo[];
}

const CACHE_KEY = 'ali-portfolio-github-repos';
const CACHE_TTL_MS = 30 * 60 * 1000;
/** Repos the site must never feature (it would otherwise showcase itself). */
const EXCLUDED_REPOS = ['Portfolio', 'AliBazoubandi'];

function readRepoCache(): GitHubRepo[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as RepoCacheEntry;
    if (!entry || typeof entry.ts !== 'number' || !Array.isArray(entry.repos)) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
    return entry.repos;
  } catch {
    return null;
  }
}

function writeRepoCache(repos: GitHubRepo[]): void {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), repos } satisfies RepoCacheEntry)
    );
  } catch {
    // Storage unavailable (private mode / quota): fall back to live fetch next time.
  }
}

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function fetchRepos(username: string): Promise<GitHubRepo[] | null> {
  const cached = readRepoCache();
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3500);
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
      }
    );
    window.clearTimeout(timeout);
    if (!res.ok) return null;
    const repos = (await res.json()) as GitHubRepo[];
    if (!Array.isArray(repos)) return null;
    writeRepoCache(repos);
    return repos;
  } catch {
    window.clearTimeout(timeout);
    return null;
  }
}

/**
 * Curated projects (projects.json) are the single source of truth. The GitHub
 * API only ENRICHES matching curated ids with live stars, topics, and a
 * validated homepage link; it never replaces or adds arbitrary repositories.
 * Falls back to the untouched curated list when offline / rate-limited.
 */
export async function loadProjects(): Promise<ProjectItem[]> {
  const curated: ProjectItem[] = fallbackProjects.map((p) => ({
    ...p,
    source: 'curated',
  }));

  // Pinned repos lead the spread order; everything else keeps JSON order.
  const pinned = CONTENT.github.pinnedRepos.map((r) => r.toLowerCase());
  const pinRank = (id: string) => {
    const idx = pinned.indexOf(id.toLowerCase());
    return idx < 0 ? Number.MAX_SAFE_INTEGER : idx;
  };
  curated.sort((a, b) => pinRank(a.id) - pinRank(b.id));

  const username = CONTENT.github.username.trim();
  if (!username) return curated;

  const repos = await fetchRepos(username);
  if (!repos) return curated;

  const excluded = new Set(EXCLUDED_REPOS.map((r) => r.toLowerCase()));
  const byName = new Map(
    repos
      .filter((r) => !r.fork && !excluded.has(r.name.toLowerCase()))
      .map((r) => [r.name.toLowerCase(), r])
  );

  return curated.map((item) => {
    const repo = byName.get(item.id.toLowerCase());
    if (!repo) return item;

    const tech = [...item.tech];
    for (const topic of (repo.topics || []).slice(0, 3)) {
      if (!tech.some((t) => t.toLowerCase() === topic.toLowerCase())) tech.push(topic);
    }

    const homepage = isHttpUrl(repo.homepage) ? repo.homepage : null;
    return {
      ...item,
      description: item.description || repo.description || item.description,
      tech: tech.slice(0, 6),
      url: homepage || repo.html_url || item.url,
      stars: repo.stargazers_count,
      source: 'curated',
    };
  });
}
