import { useMemo } from 'react';
import { FiGitCommit, FiGitBranch, FiStar, FiEye, FiTrash2, FiMessageSquare, FiPlus } from 'react-icons/fi';
import { useGithubEvents } from '@/hooks/useGithubData';
import { formatRelativeTime } from '@/services/githubApi';
import ErrorState from './components/ErrorState';
import { SkeletonText } from './components/SkeletonLoader';

const EVENT_CONFIG = {
  PushEvent: {
    icon: <FiGitCommit size={14} />,
    color: '#10b981',
    format: (e) => {
      const commits = e.payload?.commits?.length || 0;
      return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${e.repo?.name?.split('/')[1] || e.repo?.name}`;
    },
  },
  CreateEvent: {
    icon: <FiPlus size={14} />,
    color: '#06b6d4',
    format: (e) => {
      const type = e.payload?.ref_type || 'repository';
      const name = e.payload?.ref || e.repo?.name?.split('/')[1] || e.repo?.name;
      return `Created ${type} ${type !== 'repository' ? name + ' in ' : ''}${e.repo?.name?.split('/')[1] || ''}`;
    },
  },
  WatchEvent: {
    icon: <FiStar size={14} />,
    color: '#f59e0b',
    format: (e) => `Starred ${e.repo?.name}`,
  },
  ForkEvent: {
    icon: <FiGitBranch size={14} />,
    color: '#8b5cf6',
    format: (e) => `Forked ${e.repo?.name}`,
  },
  DeleteEvent: {
    icon: <FiTrash2 size={14} />,
    color: '#ef4444',
    format: (e) => `Deleted ${e.payload?.ref_type} ${e.payload?.ref} from ${e.repo?.name?.split('/')[1] || ''}`,
  },
  IssueCommentEvent: {
    icon: <FiMessageSquare size={14} />,
    color: '#ec4899',
    format: (e) => `Commented on issue in ${e.repo?.name?.split('/')[1] || e.repo?.name}`,
  },
  PullRequestEvent: {
    icon: <FiGitBranch size={14} />,
    color: '#6366f1',
    format: (e) => `${e.payload?.action} PR in ${e.repo?.name?.split('/')[1] || e.repo?.name}`,
  },
  IssuesEvent: {
    icon: <FiEye size={14} />,
    color: '#14b8a6',
    format: (e) => `${e.payload?.action} issue in ${e.repo?.name?.split('/')[1] || e.repo?.name}`,
  },
};

export default function ActivityFeed() {
  const { data: events, isLoading, isError, error, refetch } = useGithubEvents();

  const feed = useMemo(() => {
    if (!events) return [];
    return events
      .filter((e) => EVENT_CONFIG[e.type])
      .slice(0, 30)
      .map((e) => ({
        id: e.id,
        type: e.type,
        config: EVENT_CONFIG[e.type],
        message: EVENT_CONFIG[e.type].format(e),
        time: e.created_at,
        repoUrl: e.repo?.url?.replace('api.github.com/repos', 'github.com') || '#',
      }));
  }, [events]);

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
    <div className="dash-activity-section">
      <div className="dash-panel">
        <h4 className="dash-panel-title">Recent Activity</h4>
        <p className="dash-panel-subtitle">Live events from GitHub</p>

        {isLoading ? (
          <SkeletonText lines={8} />
        ) : feed.length === 0 ? (
          <div className="dash-empty-state">
            <p>No recent activity found.</p>
          </div>
        ) : (
          <div className="dash-activity-timeline">
            {feed.map((item) => (
              <div className="dash-activity-item" key={item.id}>
                <div className="dash-activity-dot" style={{ backgroundColor: item.config.color }}>
                  {item.config.icon}
                </div>
                <div className="dash-activity-content">
                  <p className="dash-activity-message">{item.message}</p>
                  <span className="dash-activity-time">{formatRelativeTime(item.time)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
