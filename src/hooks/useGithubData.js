import { useQuery } from '@tanstack/react-query';
import {
  fetchGithubProfile,
  fetchGithubRepos,
  fetchGithubEvents,
  fetchAllLanguages,
  computeRepoStats,
  buildContributionMap,
  buildWeeklyCommits,
} from '@/services/githubApi';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch GitHub user profile.
 */
export function useGithubProfile() {
  return useQuery({
    queryKey: ['github', 'profile'],
    queryFn: fetchGithubProfile,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

/**
 * Fetch all GitHub repos.
 */
export function useGithubRepos() {
  return useQuery({
    queryKey: ['github', 'repos'],
    queryFn: fetchGithubRepos,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}

/**
 * Fetch GitHub events.
 */
export function useGithubEvents() {
  return useQuery({
    queryKey: ['github', 'events'],
    queryFn: fetchGithubEvents,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: 2,
  });
}

/**
 * Compute aggregated repo stats (depends on repos query).
 */
export function useGithubStats() {
  const { data: repos, ...rest } = useGithubRepos();

  return {
    ...rest,
    data: repos ? computeRepoStats(repos) : null,
    repos,
  };
}

/**
 * Fetch aggregated language data (depends on repos query).
 */
export function useGithubLanguages() {
  const { data: repos } = useGithubRepos();

  return useQuery({
    queryKey: ['github', 'languages'],
    queryFn: () => fetchAllLanguages(repos),
    enabled: !!repos && repos.length > 0,
    staleTime: STALE_TIME * 2,
    gcTime: CACHE_TIME,
    retry: 1,
  });
}

/**
 * Build contribution heatmap data (depends on events query).
 */
export function useContributionMap() {
  const { data: events, ...rest } = useGithubEvents();

  return {
    ...rest,
    data: events ? buildContributionMap(events) : null,
  };
}

/**
 * Build weekly commit chart data (depends on events query).
 */
export function useWeeklyCommits() {
  const { data: events, ...rest } = useGithubEvents();

  return {
    ...rest,
    data: events ? buildWeeklyCommits(events) : null,
  };
}
