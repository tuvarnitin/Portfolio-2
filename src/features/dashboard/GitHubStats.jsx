import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FiGitBranch, FiStar, FiUsers, FiUserPlus, FiGitCommit, FiCode } from 'react-icons/fi';
import {
  useGithubProfile,
  useGithubStats,
  useGithubLanguages,
  useContributionMap,
  useWeeklyCommits,
} from '@/hooks/useGithubData';
import { LANGUAGE_COLORS, formatRelativeTime } from '@/services/githubApi';
import StatCard from './components/StatCard';
import ChartWrapper, { DarkTooltip } from './components/ChartWrapper';
import ErrorState from './components/ErrorState';
import { SkeletonGrid, SkeletonChart, SkeletonHeatmap } from './components/SkeletonLoader';

export default function GitHubStats() {
  const profile = useGithubProfile();
  const stats = useGithubStats();
  const languages = useGithubLanguages();
  const contributions = useContributionMap();
  const weeklyCommits = useWeeklyCommits();

  const isLoading = profile.isLoading || stats.isLoading;
  const isError = profile.isError || stats.isError;

  const heatmapDays = useMemo(() => {
    if (!contributions.data) return [];
    return Object.entries(contributions.data).map(([date, count]) => ({ date, count }));
  }, [contributions.data]);

  const totalContributions = useMemo(() => {
    if (!heatmapDays.length) return 0;
    return heatmapDays.reduce((sum, d) => sum + d.count, 0);
  }, [heatmapDays]);

  // Find last commit from events
  const lastCommitDate = useMemo(() => {
    if (!contributions.data) return null;
    const days = Object.entries(contributions.data)
      .filter(([, count]) => count > 0)
      .sort(([a], [b]) => b.localeCompare(a));
    return days.length > 0 ? days[0][0] : null;
  }, [contributions.data]);

  if (isError) {
    const error = profile.error || stats.error;
    return (
      <ErrorState
        message={error?.message}
        isRateLimit={error?.isRateLimit}
        resetDate={error?.resetDate}
        onRetry={() => {
          profile.refetch();
          stats.refetch();
        }}
      />
    );
  }

  return (
    <div className="dash-github-section">
      {/* Stat Cards */}
      {isLoading ? (
        <SkeletonGrid cols={4} cardHeight="130px" />
      ) : (
        <div className="dash-stats-grid">
          <StatCard
            icon={<FiGitBranch size={20} />}
            label="Public Repos"
            value={stats.data?.totalRepos || 0}
            color="#10b981"
            delay={0}
          />
          <StatCard
            icon={<FiStar size={20} />}
            label="Total Stars"
            value={stats.data?.totalStars || 0}
            color="#f59e0b"
            suffix=""
            delay={100}
          />
          <StatCard
            icon={<FiGitBranch size={20} />}
            label="Total Forks"
            value={stats.data?.totalForks || 0}
            color="#6366f1"
            delay={200}
          />
          <StatCard
            icon={<FiUsers size={20} />}
            label="Followers"
            value={profile.data?.followers || 0}
            color="#ec4899"
            delay={300}
          />
          <StatCard
            icon={<FiUserPlus size={20} />}
            label="Following"
            value={profile.data?.following || 0}
            color="#8b5cf6"
            delay={400}
          />
          <StatCard
            icon={<FiGitCommit size={20} />}
            label="Contributions (90d)"
            value={totalContributions}
            color="#10b981"
            delay={500}
          />
          {lastCommitDate && (
            <StatCard
              icon={<FiCode size={20} />}
              label="Last Commit"
              value={formatRelativeTime(lastCommitDate)}
              color="#06b6d4"
              delay={600}
            />
          )}
        </div>
      )}

      <div className="dash-charts-row">
        {/* Contribution Heatmap */}
        {/* <div className="dash-panel dash-heatmap-panel">
          <h4 className="dash-panel-title">Contribution Activity (Last 90 Days)</h4>
          {contributions.isLoading ? (
            <SkeletonHeatmap />
          ) : (
            <div className="dash-heatmap-container">
              <div className="dash-heatmap-grid">
                {heatmapDays.map(({ date, count }) => (
                  <div
                    key={date}
                    className="dash-heatmap-cell"
                    data-level={
                      count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4
                    }
                    title={`${date}: ${count} contribution${count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
              <div className="dash-heatmap-legend">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className="dash-heatmap-cell legend-cell" data-level={level} />
                ))}
                <span>More</span>
              </div>
            </div>
          )}
        </div> */}

        {/* Language Distribution */}
        <div className="dash-panel">
          <h4 className="dash-panel-title">Language Distribution</h4>
          {languages.isLoading ? (
            <SkeletonChart height="250px" />
          ) : languages.data && languages.data.length > 0 ? (
            <div className="dash-language-chart">
              <ChartWrapper height={250}>
                <PieChart>
                  <Pie
                    data={languages.data.slice(0, 8)}
                    dataKey="bytes"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {languages.data.slice(0, 8).map((lang) => (
                      <Cell key={lang.name} fill={LANGUAGE_COLORS[lang.name] || '#666'} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="dash-chart-tooltip">
                          <p style={{ color: payload[0].payload.fill }}>
                            {payload[0].name}: {payload[0].payload.percentage}%
                          </p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ChartWrapper>
              <div className="dash-language-labels">
                {languages.data.slice(0, 8).map((lang) => (
                  <div key={lang.name} className="dash-language-label">
                    <span
                      className="dash-lang-dot"
                      style={{ backgroundColor: LANGUAGE_COLORS[lang.name] || '#666' }}
                    />
                    <span className="dash-lang-name">{lang.name}</span>
                    <span className="dash-lang-pct">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="dash-empty-text">No language data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
