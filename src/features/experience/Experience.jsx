import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { timeline } from '@/data/experience';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Experience() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const arrowRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // SVG path drawing
      const pathLength = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.journey-container',
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1.2,
        },
      });

      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
      });

      // Animate arrow along path
      tl.to(
        arrowRef.current,
        {
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: 'none',
          duration: tl.duration(),
        },
        0
      );

      // Card glowing
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const triggerPos = index / (cardsRef.current.length - 1);

        tl.to(
          card,
          {
            onStart: () => card.classList.add('glowing'),
            onReverseComplete: () => card.classList.remove('glowing'),
            duration: 0.01,
          },
          triggerPos * tl.duration() * 0.7
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="section"
      id="experience"
      ref={sectionRef}
      aria-label="Experience and learning journey"
    >
      <div className="container">
        <div className="section-header experience-header">
          <span className="section-number">04</span>
          <h2 className="section-title">Learning Journey</h2>
          <p className="section-desc">
            My path through web development — continuous learning, building, and growing.
          </p>
          <div className="section-divider" />
        </div>

        <div className="journey-container relative pb-32">
          {/* SVG Canvas for drawing the curved path */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-full pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 1200"
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <mask id="path-mask">
                  <path
                    ref={pathRef}
                    d="M 100 0 C 400 200, 700 400, 400 600 C -100 900, 700 1000, 400 1200"
                    fill="none"
                    stroke="white"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </mask>
              </defs>

              {/* Background faint dashed path */}
              <path
                d="M 100 0 C 400 200, 700 400, 400 600 C -100 900, 700 1000, 400 1200"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="4"
                strokeDasharray="10 15"
              />

              {/* Foreground highlighted dashed path */}
              <path
                d="M 100 0 C 400 200, 700 400, 400 600 C -100 900, 700 1000, 400 1200"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeDasharray="10 15"
                mask="url(#path-mask)"
              />

              {/* Moving Arrow */}
              <polygon
                ref={arrowRef}
                points="-1,-4 10,3 -8,10"
                fill="#fff"
                style={{ transformOrigin: 'center' }}
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col pt-12">
            {timeline.slice(3).reverse().map((item, i) => (
              <div
                className={`journey-card ${i % 2 === 0 ? 'tilt-left mr-auto ml-[5%]' : 'tilt-right ml-auto mr-[5%]'}`}
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                style={{ marginTop: i === 0 ? 0 : '150px' }}
              >
                <div className="journey-card-date">{item.date}</div>
                <h3 className="journey-card-title">{item.title}</h3>
                <div className="journey-card-subtitle">{item.subtitle}</div>
                <p className="journey-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
