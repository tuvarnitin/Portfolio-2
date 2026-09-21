import { useEffect, useRef, useState } from 'react';

/**
 * Glassmorphism stat card with animated counter.
 */
export default function StatCard({ icon, label, value, suffix = '', prefix = '', trend, color, delay = 0 }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || typeof value !== 'number') {
      if (visible) setCount(value);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();

    const timer = setTimeout(() => {
      const animate = () => {
        const elapsed = Date.now() - startTime - delay;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [visible, value, delay]);

  return (
    <div className="dash-stat-card" ref={ref}>
      <div className="dash-stat-icon" style={{ color: color || '#10b981' }}>
        {icon}
      </div>
      <div className="dash-stat-value">
        {prefix}{typeof value === 'number' ? count.toLocaleString() : value}{suffix}
      </div>
      <div className="dash-stat-label">{label}</div>
      {trend !== undefined && (
        <div className={`dash-stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
