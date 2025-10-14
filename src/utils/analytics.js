// Portfolio Analytics Tracking

const ANALYTICS_ENDPOINT = 'https://portfolio-analytics-250136281139.us-central1.run.app/api/track';

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
  try {
    // Don't track in development
    if (import.meta.env.DEV) {
      console.log('[Analytics - DEV]', eventData);
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

    // Send to backend (fire and forget)
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true // Send even if user navigates away
    }).catch(() => {
      // Fail silently - analytics shouldn't break UX
    });

  } catch (err) {
    // Fail silently
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
