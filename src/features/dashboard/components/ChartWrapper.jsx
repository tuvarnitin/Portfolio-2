import { ResponsiveContainer } from 'recharts';

/**
 * Reusable wrapper for Recharts with consistent dark theme styling.
 */
export default function ChartWrapper({ children, height = 300, title, subtitle }) {
  return (
    <div className="dash-chart-wrapper">
      {(title || subtitle) && (
        <div className="dash-chart-header">
          {title && <h4 className="dash-chart-title">{title}</h4>}
          {subtitle && <p className="dash-chart-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="dash-chart-body">
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Custom tooltip for dark theme charts.
 */
export function DarkTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="dash-chart-tooltip">
      {label && <p className="dash-chart-tooltip-label">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="dash-chart-tooltip-value" style={{ color: entry.color || '#10b981' }}>
          {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}
