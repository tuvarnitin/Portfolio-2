import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * Error state with retry button.
 */
export default function ErrorState({ message, onRetry, isRateLimit, resetDate }) {
  return (
    <div className="dash-error-state">
      <FiAlertTriangle className="dash-error-icon" />
      <h4 className="dash-error-title">
        {isRateLimit ? 'API Rate Limit Reached' : 'Something went wrong'}
      </h4>
      <p className="dash-error-message">
        {isRateLimit
          ? `GitHub API rate limit exceeded.${resetDate ? ` Resets at ${resetDate.toLocaleTimeString()}.` : ''} Add a VITE_GITHUB_TOKEN to your .env for higher limits.`
          : message || 'Failed to fetch data. Please try again.'}
      </p>
      {onRetry && (
        <button className="dash-error-retry" onClick={onRetry}>
          <FiRefreshCw /> Retry
        </button>
      )}
    </div>
  );
}
