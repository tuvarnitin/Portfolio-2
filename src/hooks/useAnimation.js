import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP animations with automatic cleanup.
 * @param {Function} animationFn - Function receiving (element, gsap, ScrollTrigger) and returning a timeline or tween
 * @param {Array} deps - Dependency array
 */
export const useGSAP = (animationFn, deps = [], externalRef = null) => {
  const internalRef = useRef(null);
  const ref = externalRef || internalRef;

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      animationFn(ref.current, gsap, ScrollTrigger);
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};

/**
 * Custom hook for scroll progress tracking.
 */
export const useScrollProgress = () => {
  const ref = useRef(null);
  const progress = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
  }, []);

  return { ref, progress };
};

/**
 * Custom hook for mouse position tracking.
 */
export const useMousePosition = () => {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      position.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return position;
};

/**
 * Custom hook for intersection observer.
 */
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const inView = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
      if (entry.isIntersecting && options.onEnter) {
        options.onEnter(entry);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
};
