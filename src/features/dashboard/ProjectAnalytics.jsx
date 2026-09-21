import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FiGlobe, FiServer, FiMonitor, FiLayers, FiExternalLink, FiGithub } from 'react-icons/fi';
import { projects } from '@/data/projects';
import StatCard from './components/StatCard';
import ChartWrapper, { DarkTooltip } from './components/ChartWrapper';

export default function ProjectAnalytics() {
  // De-duplicate projects by id
  const uniqueProjects = useMemo(() => {
    const seen = new Set();
    return projects.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, []);

  const analytics = useMemo(() => {
    const total = uniqueProjects.length;
    const live = uniqueProjects.filter((p) => p.demo).length;
    const backendKeywords = ['Node.js', 'Express', 'MongoDB', 'JWT', 'Bcrypt'];
    const frontendKeywords = ['React', 'Tailwind CSS', 'Bootstrap', 'CSS'];

    let backend = 0;
    let frontend = 0;
    let fullstack = 0;

    uniqueProjects.forEach((p) => {
      const hasBackend = p.tech.some((t) => backendKeywords.includes(t));
      const hasFrontend = p.tech.some((t) => frontendKeywords.includes(t));
      if (hasBackend && hasFrontend) fullstack++;
      else if (hasBackend) backend++;
      else if (hasFrontend) frontend++;
    });

    return { total, live, backend, frontend, fullstack };
  }, [uniqueProjects]);

  // Tech distribution
  const techDistribution = useMemo(() => {
    const counts = {};
    uniqueProjects.forEach((p) => {
      p.tech.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [uniqueProjects]);

  return (
    <div className="dash-projects-section">
      {/* Summary Stats */}
      <div className="dash-stats-grid">
        <StatCard
          icon={<FiLayers size={20} />}
          label="Total Projects"
          value={analytics.total}
          color="#10b981"
        />
        <StatCard
          icon={<FiGlobe size={20} />}
          label="Live Projects"
          value={analytics.live}
          color="#06b6d4"
          delay={100}
        />
        <StatCard
          icon={<FiLayers size={20} />}
          label="Full Stack"
          value={analytics.fullstack}
          color="#8b5cf6"
          delay={200}
        />
        <StatCard
          icon={<FiServer size={20} />}
          label="Backend Only"
          value={analytics.backend}
          color="#f59e0b"
          delay={300}
        />
        <StatCard
          icon={<FiMonitor size={20} />}
          label="Frontend Only"
          value={analytics.frontend}
          color="#ec4899"
          delay={400}
        />
      </div>

      {/* Tech Distribution Chart */}
      <div className="dash-panel">
        <h4 className="dash-panel-title">Technology Distribution Across Projects</h4>
        <ChartWrapper height={280}>
          <BarChart data={techDistribution} layout="vertical" barCategoryGap="20%">
            <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#999', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<DarkTooltip />} />
            <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="Projects" />
          </BarChart>
        </ChartWrapper>
      </div>

      {/* Project Cards */}
      <div className="dash-panel">
        <h4 className="dash-panel-title">All Projects</h4>
        <div className="dash-project-cards">
          {uniqueProjects.map((project) => (
            <div className="dash-project-card" key={project.id} style={{ borderColor: project.color + '33' }}>
              <div className="dash-project-card-header">
                <h5 className="dash-project-card-name" style={{ color: project.color }}>
                  {project.name}
                </h5>
                <span className={`dash-project-status ${project.demo ? 'live' : 'dev'}`}>
                  {project.demo ? '● Live' : '○ Dev'}
                </span>
              </div>
              <p className="dash-project-card-desc">{project.tagline}</p>
              <div className="dash-project-tech-pills">
                {project.tech.map((t) => (
                  <span key={t} className="dash-tech-pill">{t}</span>
                ))}
              </div>
              <div className="dash-project-card-links">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="dash-repo-link">
                    <FiGithub size={13} /> Source
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="dash-repo-link demo">
                    <FiExternalLink size={13} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
