import { useState, useMemo } from 'react';
import { FiStar, FiGitBranch, FiExternalLink, FiGithub, FiSearch } from 'react-icons/fi';
import { useGithubRepos } from '@/hooks/useGithubData';
import { LANGUAGE_COLORS, formatRelativeTime } from '@/services/githubApi';
import ErrorState from './components/ErrorState';
import { SkeletonCard } from './components/SkeletonLoader';

const SORT_OPTIONS = [
  { key: 'updated', label: 'Recently Updated' },
  { key: 'stars', label: 'Most Starred' },
  { key: 'name', label: 'Alphabetical' },
];

export default function RepoList() {
  const { data: repos, isLoading, isError, error, refetch } = useGithubRepos();
  const [sortBy, setSortBy] = useState('updated');
  const [search, setSearch] = useState('');

  const filteredAndSorted = useMemo(() => {
    if (!repos) return [];

    let filtered = repos.filter((repo) => !repo.fork);

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case 'stars':
        return [...filtered].sort((a, b) => b.stargazers_count - a.stargazers_count);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'updated':
      default:
        return [...filtered].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }
  }, [repos, sortBy, search]);

  if (isError) {
    return (
      <ErrorState
        message={error?.message}
        isRateLimit={error?.isRateLimit}
        resetDate={error?.resetDate}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="dash-repos-section">
      {/* Controls */}
      <div className="dash-repos-controls">
        <div className="dash-repos-search">
          <FiSearch className="dash-search-icon" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dash-search-input"
            aria-label="Search repositories"
          />
        </div>
        <div className="dash-repos-sort">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`dash-sort-btn ${sortBy === opt.key ? 'active' : ''}`}
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Repo Grid */}
      {isLoading ? (
        <div className="dash-repos-grid">
          <SkeletonCard height="180px" count={6} />
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="dash-empty-state">
          <p>No repositories found{search ? ` matching "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="dash-repos-grid">
          {filteredAndSorted.map((repo) => (
            <div className="dash-repo-card" key={repo.id}>
              <div className="dash-repo-header">
                <h4 className="dash-repo-name">{repo.name}</h4>
                <span className={`dash-repo-visibility ${repo.private ? 'private' : 'public'}`}>
                  {repo.private ? 'Private' : 'Public'}
                </span>
              </div>

              <p className="dash-repo-desc">
                {repo.description || 'No description provided.'}
              </p>

              <div className="dash-repo-meta">
                {repo.language && (
                  <span className="dash-repo-lang">
                    <span
                      className="dash-lang-dot"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#666' }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="dash-repo-updated">
                  {formatRelativeTime(repo.updated_at)}
                </span>
              </div>

              <div className="dash-repo-links">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dash-repo-link"
                  aria-label={`View ${repo.name} on GitHub`}
                >
                  <FiGithub size={14} /> Code
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dash-repo-link demo"
                    aria-label={`View ${repo.name} demo`}
                  >
                    <FiExternalLink size={14} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
