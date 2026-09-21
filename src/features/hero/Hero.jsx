import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi';

const roles = [
  'Full Stack Developer',
  'MERN Stack Engineer',
  'React Developer',
  'Node.js Developer',
  'Frontend Engineer',
];

export default function Hero() {
  const sectionRef = useRef(null);
  const overlineRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const [currentRole, setCurrentRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // GSAP entrance timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        [overlineRef, titleRef, subtitleRef, buttonsRef].forEach((ref) => {
          if (ref.current) ref.current.style.opacity = '1';
        });
        return;
      }

      [overlineRef, titleRef, subtitleRef, buttonsRef].forEach((ref) => {
        if (ref.current) {
          gsap.set(ref.current, { y: 30 });
        }
      });

      const tl = gsap.timeline({ delay: 2.2 });

      tl.to(overlineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Typing animation
  useEffect(() => {
    const currentWord = roles[roleIndex];
    let timeout;

    if (!isDeleting && currentRole.length < currentWord.length) {
      timeout = setTimeout(() => {
        setCurrentRole(currentWord.slice(0, currentRole.length + 1));
      }, 80);
    } else if (!isDeleting && currentRole.length === currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentRole.length > 0) {
      timeout = setTimeout(() => {
        setCurrentRole(currentRole.slice(0, -1));
      }, 40);
    } else if (isDeleting && currentRole.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [currentRole, isDeleting, roleIndex]);

  const scrollToProjects = () => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-label="Hero section">
      {/* Content */}
      <div className="hero-content">
        <div ref={overlineRef} className="hero-overline" style={{ opacity: 0 }}>
          <span className="dot" />
          Available for opportunities
        </div>

        <h1 ref={titleRef} className="hero-title" style={{ opacity: 0 }}>
          Hi, I'm <span className="highlight">Nitin Tuvar</span>
          <br />
          <span
            style={{ fontSize: '0.55em', fontWeight: 600, color: 'var(--color-text-secondary)' }}
          >
            {currentRole}
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '0.9em',
                background: 'var(--color-primary)',
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'pulse 1s infinite',
              }}
            />
          </span>
        </h1>

        <p ref={subtitleRef} className="hero-subtitle" style={{ opacity: 0 }}>
          Building scalable web applications with exceptional user experiences. Specializing in
          React, Node.js, and the modern JavaScript ecosystem.
        </p>

        <div className="hero-location" style={{ opacity: 1, paddingBottom: '2rem' }}>
          📍 Panipat, Haryana, India (29.112200° N, 75.699600° E)
        </div>

        <div ref={buttonsRef} className="hero-buttons" style={{ opacity: 0 }}>
          <button className="btn btn-primary" onClick={scrollToProjects}>
            View Projects <FiArrowRight className="btn-icon" />
          </button>
          <a
            href="/resume.pdf"
            className="btn btn-outline"
            target="_blank"
            rel="noopener noreferrer"
            download="Nitin_Tuvar_Resume.pdf"
          >
            <FiDownload /> Resume
          </a>
          <button className="btn btn-ghost" onClick={scrollToContact}>
            <FiMail /> Contact Me
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
}
