import { useMemo, useEffect, useRef, useState } from 'react';
import { skills } from '@/data/skills';
import { projects } from '@/data/projects';
import { useGithubLanguages } from '@/hooks/useGithubData';
import { LANGUAGE_COLORS } from '@/services/githubApi';
import { SkeletonCard } from './components/SkeletonLoader';

/**
 * Animated progress bar that fills on scroll.
 */
function AnimatedBar({ percentage, color, label, detail, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percentage), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage, delay]);

  return (
    <div className="dash-tech-bar-row" ref={ref}>
      <div className="dash-tech-bar-info">
        <span className="dash-tech-bar-label">{label}</span>
        <span className="dash-tech-bar-detail">{detail}</span>
      </div>
      <div className="dash-tech-bar-track">
        <div
          className="dash-tech-bar-fill"
          style={{
            width: `${width}%`,
            backgroundColor: color,
            transition: `width 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

export default function TechStack() {
  const githubLangs = useGithubLanguages();

  // Merge skill proficiency + project usage counts
  const techData = useMemo(() => {
    // Count project usage per tech
    const projectUsage = {};
    const seen = new Set();
    projects.forEach((p) => {
      if (seen.has(p.id)) return;
      seen.add(p.id);
      p.tech.forEach((t) => {
        projectUsage[t] = (projectUsage[t] || 0) + 1;
      });
    });

    // Map from skills.js
    const result = skills.map((s) => ({
      name: s.name,
      proficiency: s.proficiency,
      projectCount: projectUsage[s.name] || 0,
      color: s.color,
      category: s.category,
    }));

    return result.sort((a, b) => b.proficiency - a.proficiency);
  }, []);

  // GitHub language data for the secondary chart
  const githubLangData = useMemo(() => {
    if (!githubLangs.data) return [];
    return githubLangs.data.slice(0, 10);
  }, [githubLangs.data]);

  return (
    <div className="dash-techstack-section">
      {/* Proficiency Bars */}
      <div className="dash-panel">
        <h4 className="dash-panel-title">Skill Proficiency</h4>
        <p className="dash-panel-subtitle">Based on self-assessment and project experience</p>
        <div className="dash-tech-bars">
          {techData.map((tech, i) => (
            <AnimatedBar
              key={tech.name}
              label={tech.name}
              percentage={tech.proficiency}
              color={tech.color === '#FFFFFF' || tech.color === '#ffffff' ? '#888' : tech.color}
              detail={`${tech.proficiency}% · ${tech.projectCount} project${tech.projectCount !== 1 ? 's' : ''}`}
              delay={i * 60}
            />
          ))}
        </div>
      </div>

      {/* GitHub Language Breakdown */}
      <div className="dash-panel">
        <h4 className="dash-panel-title">GitHub Language Usage</h4>
        <p className="dash-panel-subtitle">Calculated from repository source code</p>
        {githubLangs.isLoading ? (
          <SkeletonCard height="40px" count={6} />
        ) : githubLangData.length > 0 ? (
          <div className="dash-tech-bars">
            {githubLangData.map((lang, i) => (
              <AnimatedBar
                key={lang.name}
                label={lang.name}
                percentage={parseFloat(lang.percentage)}
                color={LANGUAGE_COLORS[lang.name] || '#666'}
                detail={`${lang.percentage}%`}
                delay={i * 80}
              />
            ))}
          </div>
        ) : (
          <p className="dash-empty-text">Loading language data from GitHub...</p>
        )}
      </div>
    </div>
  );
}
