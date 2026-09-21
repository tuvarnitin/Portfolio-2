import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '@/data/skills';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const tl1Ref = useRef(null);
  const tl2Ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.skills-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-header',
          start: 'top 80%',
        },
      });

      // Continuous loop animations
      tl1Ref.current = gsap.timeline({ repeat: -1 })
        .to(track1Ref.current, {
          xPercent: -50,
          ease: 'none',
          duration: 150, // Slower normal speed
        });

      tl2Ref.current = gsap.timeline({ repeat: -1 })
        .fromTo(track2Ref.current, 
          { xPercent: -50 },
          { xPercent: 0, ease: 'none', duration: 150 }
        );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleHoverStart = () => {
    if (tl1Ref.current && tl2Ref.current) {
      gsap.to([tl1Ref.current, tl2Ref.current], { timeScale: 0.2, duration: 0.5 });
    }
  };

  const handleHoverEnd = () => {
    if (tl1Ref.current && tl2Ref.current) {
      gsap.to([tl1Ref.current, tl2Ref.current], { timeScale: 1, duration: 0.5 });
    }
  };

  // Split skills into two lists for the two rows
  const row1 = skills.slice(0, Math.ceil(skills.length / 2));
  const row2 = skills.slice(Math.ceil(skills.length / 2));

  return (
    <section className="section" id="skills" ref={sectionRef} aria-label="Skills">
      <div className="container">
        <div className="section-header skills-header">
          <span className="section-number">02</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-desc">
            The tools and technologies I use to bring ideas to life.
          </p>
          <div className="section-divider" />
        </div>
      </div>

      <div 
        className="skills-marquee-wrapper relative overflow-hidden flex flex-col gap-8 pb-12" 
        aria-hidden="true"
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <div className="skills-marquee-track" ref={track1Ref}>
          {[...row1, ...row1, ...row1, ...row1, ...row1, ...row1].map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                className="skill-icon-item group"
                key={`row1-${index}`}
                style={{ color: skill.color }}
              >
                <Icon/>
              </div>
            );
          })}
        </div>

        <div className="skills-marquee-track" ref={track2Ref}>
          {[...row2, ...row2, ...row2, ...row2, ...row2, ...row2].map((skill, index) => {
            const Icon = skill.icon;
            return (
              <div
                className="skill-icon-item group"
                key={`row2-${index}`}
                style={{ color: skill.color }}
              >
                <Icon />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
