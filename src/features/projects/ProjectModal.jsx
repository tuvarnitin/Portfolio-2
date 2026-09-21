import { useEffect, useRef, useCallback } from 'react';
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi';

export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // Trap focus and handle escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Show modal with animation
    requestAnimationFrame(() => {
      overlayRef.current?.classList.add('active');
    });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} project details`}
    >
      <div className="modal-content" ref={contentRef} data-lenis-prevent>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              {project.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {project.tagline}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="modal-section-title">About</h3>
            <p>{project.description}</p>
          </div>

          {project.features && (
            <div className="modal-section">
              <h3 className="modal-section-title">Key Features</h3>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {project.features.map((feature, i) => (
                  <li key={i} style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    paddingLeft: '1.25rem',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                    }}>→</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.challenges && (
            <div className="modal-section">
              <h3 className="modal-section-title">Challenges & Learning</h3>
              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {project.challenges.map((challenge, i) => (
                  <li key={i} style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    paddingLeft: '1.25rem',
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--color-primary)',
                    }}>•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="modal-section">
            <h3 className="modal-section-title">Tech Stack</h3>
            <div className="project-tech" style={{ gap: '0.5rem' }}>
              {project.tech.map((t) => (
                <span className="tech-badge" key={t} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <a
            href={project.github}
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <FiGithub /> View Code
          </a>
          {project.demo && (
            <a
              href={project.demo}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <FiExternalLink /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
