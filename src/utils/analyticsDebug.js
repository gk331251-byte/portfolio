// Analytics Debugging Utilities

export const debugAnalytics = {
  enabled: true, // Set to false in production

  log: (message, data) => {
    if (!debugAnalytics.enabled) return;
    console.log(`[Analytics Debug] ${message}`, data || '');
  },

  error: (message, error) => {
    console.error(`[Analytics Error] ${message}`, error);
  },

  testBackendConnection: async (backendUrl) => {
    try {
      debugAnalytics.log('Testing backend connection...', backendUrl);

      if (!backendUrl) {
        return { success: false, message: 'Backend URL not configured' };
      }

      // Test health endpoint
      const healthResponse = await fetch(backendUrl);
      const healthData = await healthResponse.json();
      debugAnalytics.log('Backend health check:', healthData);

      // Test track endpoint with dummy event
      const trackResponse = await fetch(`${backendUrl}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'test_event',
          timestamp: new Date().toISOString(),
          message: 'Connection test from frontend'
        })
      });

      if (trackResponse.ok) {
        const trackData = await trackResponse.json();
        debugAnalytics.log('Track endpoint working:', trackData);
        return { success: true, message: 'Backend is reachable and accepting events' };
      } else {
        debugAnalytics.error('Track endpoint failed:', await trackResponse.text());
        return { success: false, message: `HTTP ${trackResponse.status}` };
      }

    } catch (error) {
      debugAnalytics.error('Backend connection test failed:', error);
      return { success: false, message: error.message };
    }
  },

  testFirestoreWrite: async (backendUrl) => {
    try {
      debugAnalytics.log('Testing Firestore write via backend...');

      if (!backendUrl) {
        return false;
      }

      const response = await fetch(`${backendUrl}/api/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'firestore_test',
          timestamp: new Date().toISOString(),
          testData: 'Testing Firestore write',
          randomId: Math.random().toString(36).substr(2, 9)
        })
      });

      if (response.ok) {
        debugAnalytics.log('Firestore write test successful');
        return true;
      } else {
        debugAnalytics.error('Firestore write test failed:', await response.text());
        return false;
      }
    } catch (error) {
      debugAnalytics.error('Firestore write test error:', error);
      return false;
    }
  },

  testAnalyticsSummary: async (backendUrl) => {
    try {
      debugAnalytics.log('Fetching analytics summary...');

      if (!backendUrl) {
        return null;
      }

      const response = await fetch(`${backendUrl}/api/analytics/summary`);

      if (response.ok) {
        const data = await response.json();
        debugAnalytics.log('Analytics summary:', data);
        return data;
      } else {
        debugAnalytics.error('Summary fetch failed:', await response.text());
        return null;
      }
    } catch (error) {
      debugAnalytics.error('Summary fetch error:', error);
      return null;
    }
  }
};

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  console.log('📊 Analytics Debug Mode Enabled');
  console.log('Run debugAnalytics.testBackendConnection(YOUR_BACKEND_URL) to test');
}

export default debugAnalytics;
