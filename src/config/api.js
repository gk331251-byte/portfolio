/**
 * API Configuration
 *
 * DEPLOYMENT CHECKLIST:
 * 1. Deploy analytics backend to Cloud Run
 * 2. Add VITE_ANALYTICS_URL to .env.local (local dev)
 * 3. Add VITE_ANALYTICS_URL to Vercel environment variables (production)
 * 4. Update CORS in backend to allow Vercel domain
 *
 * To use: Set VITE_ANALYTICS_URL in .env.local or Vercel environment variables
 * Example: VITE_ANALYTICS_URL=https://your-analytics-backend.run.app
 */

export const API_CONFIG = {
  analyticsBackend: import.meta.env.VITE_ANALYTICS_URL || '',
};

// Helper to check if analytics is configured
export const isAnalyticsConfigured = () => {
  return API_CONFIG.analyticsBackend && API_CONFIG.analyticsBackend !== '';
};
