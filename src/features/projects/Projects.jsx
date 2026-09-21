import { useState } from 'react';
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import { projects } from '@/data/projects';
import ProjectModal from './ProjectModal';

const Projects = () => {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="container">
        <div className="section-header projects-header">
          <span className="section-number">05</span>
          <h2 className="section-title">Selected Projects</h2>
          <p className="section-desc">
            A snapshot of the apps and systems I’ve built, from product experiences to backend
            infrastructure.
          </p>
          <div className="section-divider" />
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article
              onClick={() => setActiveProject(project)}
              className="project-card cursor-pointer"
              key={project.id}
              style={{ '--project-color': project.color }}
            >
              <div className="project-card-image-wrap">
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  className="project-card-image"
                />
                <div className="project-card-overlay" />
                <div className="project-card-badges">
                  <span className="project-card-status" style={{ color: project.color }}>
                    {project.demo ? 'Live' : 'In Progress'}
                  </span>
                </div>
              </div>

              <div className="project-card-body">
                <h3 className="project-card-name">{project.name}</h3>
                <div className="project-card-header-row">
                  <div>
                    <p className="project-card-tagline">{project.tagline}</p>
                  </div>
                </div>

                <div className="project-card-actions">
                  {project.github && (
                    <a
                      href={project.github}
                      className="btn btn-ghost project-link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <FiGithub /> Source
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="btn btn-primary project-link"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <FiExternalLink /> Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </section>
  );
};

export default Projects;
