import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@/hooks/useAnimation';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 3, suffix: '+', label: 'Years Coding' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 500, suffix: '+', label: 'GitHub Commits' },
];

const codeLines = [
  { num: 1, content: [
    { text: 'const ', cls: 'code-keyword' },
    { text: 'developer', cls: 'code-variable' },
    { text: ' = ', cls: 'code-operator' },
    { text: '{', cls: 'code-bracket' },
  ]},
  { num: 2, content: [
    { text: '  name', cls: 'code-property' },
    { text: ': ', cls: 'code-operator' },
    { text: '"Nitin Tuvar"', cls: 'code-string' },
    { text: ',', cls: '' },
  ]},
  { num: 3, content: [
    { text: '  role', cls: 'code-property' },
    { text: ': ', cls: 'code-operator' },
    { text: '"Full Stack Developer"', cls: 'code-string' },
    { text: ',', cls: '' },
  ]},
  { num: 4, content: [
    { text: '  stack', cls: 'code-property' },
    { text: ': ', cls: 'code-operator' },
    { text: '[', cls: 'code-bracket' },
    { text: '"MERN"', cls: 'code-string' },
    { text: ']', cls: 'code-bracket' },
    { text: ',', cls: '' },
  ]},
  { num: 5, content: [
    { text: '  passion', cls: 'code-property' },
    { text: ': ', cls: 'code-operator' },
    { text: '"Building products"', cls: 'code-string' },
    { text: ',', cls: '' },
  ]},
  { num: 6, content: [
    { text: '  learning', cls: 'code-property' },
    { text: ': ', cls: 'code-operator' },
    { text: 'true', cls: 'code-keyword' },
    { text: ',', cls: '' },
  ]},
  { num: 7, content: [
    { text: '  ', cls: '' },
    { text: 'buildSomething', cls: 'code-function' },
    { text: '() ', cls: '' },
    { text: '{', cls: 'code-bracket' },
  ]},
  { num: 8, content: [
    { text: '    ', cls: '' },
    { text: 'return ', cls: 'code-keyword' },
    { text: '"scalable apps"', cls: 'code-string' },
    { text: ';', cls: '' },
  ]},
  { num: 9, content: [
    { text: '  ', cls: '' },
    { text: '}', cls: 'code-bracket' },
  ]},
  { num: 10, content: [
    { text: '}', cls: 'code-bracket' },
    { text: ';', cls: '' },
  ]},
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="stat-number">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.container',
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1.2,
      },
    });

      // Animate section header
      gsap.from('.about-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-header',
          start: 'top 80%',
        },
      });

      // Animate about text paragraphs
      gsap.from('.about-text p', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-text',
          start: 'top 75%',
        },
      });

      // Animate code block
      gsap.from('.about-code-block', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-code-block',
          start: 'top 80%',
        },
      });

      // Animate individual code lines
      gsap.from('.code-line', {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.code-body',
          start: 'top 80%',
        },
      });

  }, [], sectionRef);

  return (
    <section className="section" id="about" ref={sectionRef} aria-label="About me">
      <div className="container">
        <div className="section-header about-header">
          <span className="section-number">01</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-desc">
            A passionate developer who turns ideas into elegant, scalable web applications.
          </p>
          <div className="section-divider" />
        </div>

        <div className="about-grid">
          <div>
            <div className="about-text">
              <p>
                I'm <strong>Nitin Tuvar</strong>, a Full Stack MERN Developer focused on building clean, scalable applications. My expertise spans from robust Node.js backend systems to responsive, interactive React frontends.
              </p>
              <p>
                I thrive on solving complex problems and turning ideas into production-ready software. Whether it's designing microservices architecture or crafting pixel-perfect UIs, I'm driven by a passion for continuous learning.
              </p>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div className="stats-card" key={stat.label}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  <div className="stats-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual">
            <div className="about-code-block">
              <div className="code-header">
                <div className="code-dot red" />
                <div className="code-dot yellow" />
                <div className="code-dot green_" />
                <span className="code-filename">developer.js</span>
              </div>
              <div className="code-body">
                {codeLines.map((line) => (
                  <div className="code-line" key={line.num}>
                    <span className="line-number">{line.num}</span>
                    <span>
                      {line.content.map((token, i) => (
                        <span key={i} className={token.cls}>{token.text}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
