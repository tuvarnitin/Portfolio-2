import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiGithub, FiFolder, FiLayers, FiCode, FiActivity, FiGrid } from 'react-icons/fi';
import { SkeletonGrid } from './components/SkeletonLoader';

gsap.registerPlugin(ScrollTrigger);

const GitHubStats = lazy(() => import('./GitHubStats'));
const RepoList = lazy(() => import('./RepoList'));
const ProjectAnalytics = lazy(() => import('./ProjectAnalytics'));
const TechStack = lazy(() => import('./TechStack'));
const ActivityFeed = lazy(() => import('./ActivityFeed'));
const PlaceholderPanel = lazy(() => import('./PlaceholderPanel'));

const TABS = [
  { key: 'github', label: 'GitHub', icon: <FiGithub size={15} /> },
  { key: 'repos', label: 'Repos', icon: <FiFolder size={15} /> },
  { key: 'projects', label: 'Projects', icon: <FiLayers size={15} /> },
  { key: 'techstack', label: 'Tech Stack', icon: <FiCode size={15} /> },
  { key: 'more', label: 'More', icon: <FiGrid size={15} /> },
];

const TabFallback = () => (
  <div style={{ padding: '2rem 0' }}>
    <SkeletonGrid cols={3} cardHeight="140px" />
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('github');
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.dash-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dash-header',
          start: 'top 85%',
        },
      });

      gsap.from('.dash-tabs', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.dash-tabs',
          start: 'top 90%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'github':
        return <GitHubStats />;
      case 'repos':
        return <RepoList />;
      case 'projects':
        return <ProjectAnalytics />;
      case 'techstack':
        return <TechStack />;
      case 'activity':
        return <ActivityFeed />;
      case 'more':
        return <PlaceholderPanel />;
      default:
        return <GitHubStats />;
    }
  };

  return (
    <section
      className="section dash-section"
      id="dashboard"
      ref={sectionRef}
      aria-label="Developer Dashboard"
    >
      <div className="container">
        <div className="section-header dash-header">
          <span className="section-number">06</span>
          <h2 className="section-title">Developer Dashboard</h2>
          <p className="section-desc">
            Real-time analytics and insights — powered by live data from GitHub and project metrics.
          </p>
          <div className="section-divider" />
        </div>

        {/* Tab Navigation */}
        <div className="dash-tabs" role="tablist" aria-label="Dashboard sections">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`dash-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="dash-content" role="tabpanel" id={`panel-${activeTab}`}>
          <Suspense fallback={<TabFallback />}>{renderTab()}</Suspense>
        </div>
      </div>
    </section>
  );
}
