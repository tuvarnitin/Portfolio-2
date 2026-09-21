const GITHUB_USERNAME = 'tuvarnitin';
const BASE_URL = 'https://api.github.com';

// Optional auth token from env
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Generic fetcher with rate-limit handling.
 */
async function githubFetch(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const res = await fetch(url, { headers: getHeaders() });

  if (res.status === 403) {
    const resetTime = res.headers.get('X-RateLimit-Reset');
    const resetDate = resetTime ? new Date(resetTime * 1000) : null;
    const error = new Error('GitHub API rate limit exceeded');
    error.resetDate = resetDate;
    error.isRateLimit = true;
    throw error;
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Fetch user profile.
 */
export async function fetchGithubProfile() {
  return githubFetch(`/users/${GITHUB_USERNAME}`);
}

/**
 * Fetch all public repositories (handles pagination).
 */
export async function fetchGithubRepos() {
  let page = 1;
  let allRepos = [];
  const perPage = 100;

  while (true) {
    const repos = await githubFetch(
      `/users/${GITHUB_USERNAME}/repos?per_page=${perPage}&page=${page}&sort=updated`
    );
    allRepos = allRepos.concat(repos);
    if (repos.length < perPage) break;
    page++;
  }

  return allRepos;
}

/**
 * Fetch recent events (last 100, max provided by GitHub).
 */
export async function fetchGithubEvents() {
  let allEvents = [];
  for (let page = 1; page <= 3; page++) {
    try {
      const events = await githubFetch(
        `/users/${GITHUB_USERNAME}/events/public?per_page=100&page=${page}`
      );
      allEvents = allEvents.concat(events);
      if (events.length < 100) break;
    } catch {
      break;
    }
  }
  return allEvents;
}

/**
 * Fetch languages for a single repo.
 */
export async function fetchRepoLanguages(repoName) {
  return githubFetch(`/repos/${GITHUB_USERNAME}/${repoName}/languages`);
}

/**
 * Aggregate languages across all repos.
 */
export async function fetchAllLanguages(repos) {
  const languageTotals = {};

  // Limit to top 20 repos by size to avoid too many API calls
  const topRepos = [...repos]
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 20);

  const results = await Promise.allSettled(
    topRepos.map((repo) => fetchRepoLanguages(repo.name))
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      Object.entries(result.value).forEach(([lang, bytes]) => {
        languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
      });
    }
  });

  const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0);

  return Object.entries(languageTotals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

/**
 * Compute aggregate stats from repos.
 */
export function computeRepoStats(repos) {
  let totalStars = 0;
  let totalForks = 0;
  let totalSize = 0;

  repos.forEach((repo) => {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    totalSize += repo.size || 0;
  });

  return { totalStars, totalForks, totalSize, totalRepos: repos.length };
}

/**
 * Build a contribution heatmap from push events (last 90 days).
 * Returns an object: { [YYYY-MM-DD]: count }
 */
export function buildContributionMap(events) {
  const map = {};
  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Initialize all days with 0
  for (let d = new Date(ninetyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    map[d.toISOString().split('T')[0]] = 0;
  }

  // Count push events
  events
    .filter((e) => e.type === 'PushEvent')
    .forEach((e) => {
      const day = e.created_at.split('T')[0];
      if (map[day] !== undefined) {
        map[day] += e.payload?.commits?.length || 1;
      }
    });

  return map;
}

/**
 * Build weekly commit data from events (last 12 weeks).
 */
export function buildWeeklyCommits(events) {
  const weeks = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const commits = events
      .filter((e) => e.type === 'PushEvent')
      .filter((e) => {
        const d = new Date(e.created_at);
        return d >= weekStart && d < weekEnd;
      })
      .reduce((sum, e) => sum + (e.payload?.commits?.length || 1), 0);

    weeks.push({ week: label, commits });
  }

  return weeks;
}

/**
 * Format relative time string.
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
}

// Language colors for charts
export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  SCSS: '#c6538c',
  Vue: '#41b883',
  EJS: '#a91e50',
  Pug: '#a86454',
  Handlebars: '#f7931e',
};

export { GITHUB_USERNAME };
