// Portfolio Analytics Tracking
import { API_CONFIG, isAnalyticsConfigured } from '../config/api';
import { debugAnalytics } from './analyticsDebug';

const ANALYTICS_ENDPOINT = `${API_CONFIG.analyticsBackend}/api/track`;

// Generate anonymous session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('portfolio_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('portfolio_session_id', sessionId);
  }
  return sessionId;
};

// Track event
export const trackEvent = async (eventData) => {
  debugAnalytics.log('Tracking event:', eventData);

  try {
    // Don't track if analytics not configured or in development
    if (!isAnalyticsConfigured()) {
      debugAnalytics.log('Analytics not configured, skipping');
      return;
    }

    if (import.meta.env.DEV) {
      debugAnalytics.log('Skipping track in DEV mode');
      return;
    }

    const payload = {
      ...eventData,
      session_id: getSessionId(),
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight
    };

    debugAnalytics.log('Sending to backend:', ANALYTICS_ENDPOINT);
    debugAnalytics.log('Payload:', payload);

    // Send to backend
    const response = await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true // Send even if user navigates away
    });

    if (response.ok) {
      debugAnalytics.log('Event tracked successfully');
    } else {
      const errorText = await response.text();
      debugAnalytics.error('Track failed:', errorText);
    }

  } catch (err) {
    debugAnalytics.error('Track error:', err);
  }
};

// Track page view
export const trackPageView = (pageName) => {
  trackEvent({
    event_type: 'page_view',
    page_name: pageName
  });
};

// Track time on page
export const trackPageExit = (pageName, timeSpent) => {
  trackEvent({
    event_type: 'page_exit',
    page_name: pageName,
    time_spent_seconds: Math.round(timeSpent / 1000)
  });
};

// API Explorer specific events
export const trackAPIRequest = (method, url, statusCode, responseTime, success) => {
  trackEvent({
    event_type: 'api_call',
    demo_name: 'API Explorer',
    api_method: method,
    api_endpoint: url,
    status_code: statusCode,
    response_time_ms: responseTime,
    success: success
  });
};

export const trackCodeCopied = (language) => {
  trackEvent({
    event_type: 'code_copied',
    demo_name: 'API Explorer',
    language: language
  });
};

export const trackExampleClicked = (exampleName) => {
  trackEvent({
    event_type: 'example_clicked',
    demo_name: 'API Explorer',
    example_name: exampleName
  });
};

// General interaction tracking
export const trackClick = (element, label) => {
  trackEvent({
    event_type: 'click',
    element: element,
    label: label
  });
};

export const trackDemoCardClick = (demoName) => {
  trackEvent({
    event_type: 'demo_clicked',
    demo_name: demoName
  });
};

// Track demo page views (when user actually views a demo)
export const trackDemoViewed = (demoName) => {
  trackEvent({
    event_type: 'demo_viewed',
    demo_name: demoName
  });
};
