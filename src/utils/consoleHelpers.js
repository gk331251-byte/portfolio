// Console Helpers for Debugging
import { debugAnalytics } from './analyticsDebug';
import { API_CONFIG } from '../config/api';

// Make debug tools available globally in development
if (import.meta.env.DEV) {
  window.portfolioDebug = {
    // Test backend connection
    testBackend: async () => {
      console.log('Testing analytics backend...');
      const result = await debugAnalytics.testBackendConnection(API_CONFIG.analyticsBackend);
      console.log('Result:', result);
      return result;
    },

    // Test Firestore write
    testFirestore: async () => {
      console.log('Testing Firestore write...');
      const result = await debugAnalytics.testFirestoreWrite(API_CONFIG.analyticsBackend);
      console.log('Result:', result ? 'SUCCESS' : 'FAILED');
      return result;
    },

    // Get analytics summary
    getSummary: async () => {
      console.log('Fetching analytics summary...');
      const result = await debugAnalytics.testAnalyticsSummary(API_CONFIG.analyticsBackend);
      console.log('Summary:', result);
      return result;
    },

    // Check configuration
    checkConfig: () => {
      console.log('Analytics Configuration:');
      console.log('Backend URL:', API_CONFIG.analyticsBackend || 'NOT CONFIGURED');
      console.log('Is Configured:', !!API_CONFIG.analyticsBackend);
      console.log('Environment:', import.meta.env.MODE);
      console.log('DEV Mode:', import.meta.env.DEV);
      return {
        backendUrl: API_CONFIG.analyticsBackend,
        isConfigured: !!API_CONFIG.analyticsBackend,
        environment: import.meta.env.MODE,
        devMode: import.meta.env.DEV
      };
    },

    // Manual event tracking test
    testEvent: async () => {
      const { trackEvent } = await import('./analytics');
      console.log('Sending test event...');
      await trackEvent({
        event_type: 'manual_test',
        message: 'Testing from console',
        timestamp: new Date().toISOString()
      });
      console.log('Event sent (check network tab and console logs)');
    },

    // Run all diagnostics
    runAll: async () => {
      console.log('\n=== Running Full Diagnostics ===\n');

      console.log('1. Configuration Check:');
      window.portfolioDebug.checkConfig();

      console.log('\n2. Backend Connection Test:');
      await window.portfolioDebug.testBackend();

      console.log('\n3. Firestore Write Test:');
      await window.portfolioDebug.testFirestore();

      console.log('\n4. Analytics Summary:');
      await window.portfolioDebug.getSummary();

      console.log('\n=== Diagnostics Complete ===\n');
    }
  };

  console.log('\n%c📊 Portfolio Debug Tools Loaded!', 'color: #3B82F6; font-size: 14px; font-weight: bold;');
  console.log('%cAvailable commands:', 'color: #10B981; font-weight: bold;');
  console.log('  %cportfolioDebug.testBackend()%c    - Test backend connection', 'color: #3B82F6', 'color: inherit');
  console.log('  %cportfolioDebug.testFirestore()%c  - Test Firestore writes', 'color: #3B82F6', 'color: inherit');
  console.log('  %cportfolioDebug.getSummary()%c     - Get analytics data', 'color: #3B82F6', 'color: inherit');
  console.log('  %cportfolioDebug.checkConfig()%c    - Check configuration', 'color: #3B82F6', 'color: inherit');
  console.log('  %cportfolioDebug.testEvent()%c      - Send test tracking event', 'color: #3B82F6', 'color: inherit');
  console.log('  %cportfolioDebug.runAll()%c         - Run all diagnostics', 'color: #3B82F6', 'color: inherit');
  console.log('\n');
}
