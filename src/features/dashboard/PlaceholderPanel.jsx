import { FiLock, FiBarChart2, FiBookOpen, FiClock, FiAward, FiZap } from 'react-icons/fi';

const PLACEHOLDER_SECTIONS = [
  {
    id: 'portfolio-analytics',
    title: 'Portfolio Analytics',
    icon: <FiBarChart2 size={24} />,
    description: 'Track real visitor statistics, session durations, geographic data, device breakdowns, and traffic trends.',
    service: 'Analytics Backend',
    features: ['Total Visitors', 'Session Duration', 'Bounce Rate', 'Device Breakdown', 'Geographic Data'],
    color: '#06b6d4',
  },
  {
    id: 'blog-analytics',
    title: 'Blog Analytics',
    icon: <FiBookOpen size={24} />,
    description: 'Automatically fetch and display blog posts with reading time, view counts, likes, and popular categories.',
    service: 'Blog Platform (e.g., Dev.to, Hashnode)',
    features: ['Total Articles', 'Total Views', 'Reading Time', 'Popular Categories', 'Engagement Metrics'],
    color: '#ec4899',
  },
  {
    id: 'coding-activity',
    title: 'Coding Activity',
    icon: <FiClock size={24} />,
    description: 'Display coding hours, favorite languages, editor usage, and productivity insights from your coding activity tracker.',
    service: 'WakaTime',
    features: ['Hours Today', 'Hours This Week', 'Favorite Language', 'Most Productive Day', 'Editor Usage'],
    color: '#f59e0b',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    icon: <FiAward size={24} />,
    description: 'Unlock and display development milestones like first open source contribution, 100 commits, and more.',
    service: 'Custom Achievement Engine',
    features: ['First OSS Contribution', '100 GitHub Commits', '10 Projects Completed', 'First Full Stack Project'],
    color: '#8b5cf6',
  },
  {
    id: 'quick-insights',
    title: 'Quick Insights',
    icon: <FiZap size={24} />,
    description: 'AI-generated summary cards showing your most-used tech, fastest growing repo, and current learning focus.',
    service: 'Insights Engine',
    features: ['Most Used Tech', 'Most Starred Project', 'Longest Maintained Repo', 'Current Learning Focus'],
    color: '#10b981',
  },
];

export default function PlaceholderPanel() {
  return (
    <div className="dash-placeholder-section">
      <div className="dash-placeholder-header">
        <h4 className="dash-panel-title">Coming Soon</h4>
        <p className="dash-panel-subtitle">
          These sections are ready to be activated when you connect the required services.
        </p>
      </div>

      <div className="dash-placeholder-grid">
        {PLACEHOLDER_SECTIONS.map((section) => (
          <div className="dash-placeholder-card" key={section.id}>
            <div className="dash-placeholder-icon" style={{ color: section.color }}>
              {section.icon}
              <FiLock className="dash-placeholder-lock" size={12} />
            </div>
            <h5 className="dash-placeholder-title">{section.title}</h5>
            <p className="dash-placeholder-desc">{section.description}</p>
            <div className="dash-placeholder-features">
              {section.features.map((f) => (
                <span key={f} className="dash-placeholder-feature">{f}</span>
              ))}
            </div>
            <div className="dash-placeholder-cta">
              Connect {section.service}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
