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

/**
 * Loads curated projects from projects.json and merges/enriches with live
 * GitHub API repositories for CONTENT.github.username, falling back cleanly
 * if offline, rate-limited, or unconfigured.
 */
export async function loadProjects(): Promise<ProjectItem[]> {
  const curated: ProjectItem[] = fallbackProjects.map((p) => ({
    ...p,
    source: 'curated',
  }));

  const username = CONTENT.github.username.trim();
  if (!username) return curated;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/vnd.github+json' },
      }
    );
    window.clearTimeout(timeout);

    if (!res.ok) return curated;
    const repos = (await res.json()) as GitHubRepo[];
    if (!Array.isArray(repos) || repos.length === 0) return curated;

    const pinnedSet = new Set(CONTENT.github.pinnedRepos.map((r) => r.toLowerCase()));
    const nonForks = repos.filter((r) => !r.fork);

    // Prioritize pinned repos first, then most starred/recent
    const sorted = [...nonForks].sort((a, b) => {
      const aPinned = pinnedSet.has(a.name.toLowerCase()) ? 1 : 0;
      const bPinned = pinnedSet.has(b.name.toLowerCase()) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return b.stargazers_count - a.stargazers_count;
    });

    const mapped: ProjectItem[] = sorted.slice(0, CONTENT.github.maxProjects).map((repo) => {
      const matchCurated = curated.find(
        (c) => c.id.toLowerCase() === repo.name.toLowerCase()
      );
      const tech =
        matchCurated?.tech ||
        [repo.language, ...(repo.topics || []).slice(0, 3)].filter(
          (t): t is string => Boolean(t)
        );

      return {
        id: repo.name,
        name: matchCurated?.name || repo.name.replace(/[-_]/g, ' '),
        client: matchCurated?.client || `GitHub · ${username}`,
        type: matchCurated?.type || (repo.language ? `${repo.language.toUpperCase()} REPO` : 'OPEN SOURCE'),
        tech: tech.length ? tech : ['Software'],
        description:
          repo.description ||
          matchCurated?.description ||
          'Open-source engineering repository.',
        year: new Date(repo.pushed_at).getFullYear().toString(),
        url: repo.homepage || repo.html_url,
        stars: repo.stargazers_count,
        source: 'github',
      };
    });

    return mapped.length > 0 ? mapped : curated;
  } catch {
    window.clearTimeout(timeout);
    return curated;
  }
}

