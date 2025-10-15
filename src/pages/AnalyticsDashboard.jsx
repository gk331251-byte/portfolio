import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, CheckCircle, Users, Activity } from 'lucide-react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { API_CONFIG } from '../config/api';
import { debugAnalytics } from '../utils/analyticsDebug';

const ANALYTICS_API = `${API_CONFIG.analyticsBackend}/api/analytics`;

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState(null);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${ANALYTICS_API}/summary`);
        const data = await response.json();
        setSummary(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setLoading(false);
      }
    };

    fetchSummary();

    // Refresh every 30 seconds
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch realtime activity
  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const response = await fetch(`${ANALYTICS_API}/realtime`);
        const data = await response.json();
        setRealtimeEvents(data.events || []);
      } catch (err) {
        console.error('Failed to fetch realtime data', err);
      }
    };

    fetchRealtime();

    // Refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchRealtime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Run diagnostics function
  const runDiagnostics = async () => {
    setTestingConnection(true);
    const backendUrl = API_CONFIG.analyticsBackend;

    const results = {
      backendConfigured: !!backendUrl,
      backendUrl: backendUrl,
      connectionTest: await debugAnalytics.testBackendConnection(backendUrl),
      firestoreTest: await debugAnalytics.testFirestoreWrite(backendUrl),
      summaryTest: await debugAnalytics.testAnalyticsSummary(backendUrl)
    };

    setDebugInfo(results);
    setTestingConnection(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-secondary mx-auto"></div>
          <p className="mt-4 text-neutral">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const demoData = (summary?.popular_demos || []).map(demo => ({
    name: demo.name,
    interactions: demo.interactions
  }));

  const COLORS = ['#3D5A3C', '#9CAF88', '#B8C9A8', '#C8D5C0', '#D8E1D8'];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Debug Panel - Only in Development */}
        {import.meta.env.DEV && (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                🔧 Analytics Diagnostics (Dev Only)
              </h3>
              <button
                onClick={runDiagnostics}
                disabled={testingConnection}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {testingConnection ? 'Testing...' : 'Run Diagnostics'}
              </button>
            </div>

            {debugInfo && (
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.backendConfigured ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {debugInfo.backendConfigured ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Backend URL: {debugInfo.backendUrl || 'NOT CONFIGURED'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={debugInfo.connectionTest?.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {debugInfo.connectionTest?.success ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Connection: {debugInfo.connectionTest?.message}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={debugInfo.firestoreTest ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {debugInfo.firestoreTest ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Firestore Write: {debugInfo.firestoreTest ? 'Working' : 'Failed'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={debugInfo.summaryTest ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {debugInfo.summaryTest ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    Summary Endpoint: {debugInfo.summaryTest ? 'Working' : 'Failed'}
                  </span>
                </div>

                {debugInfo.summaryTest && (
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-96">
                    <strong className="text-gray-900 dark:text-gray-100">Current Data:</strong>
                    <pre className="text-xs mt-2 text-gray-800 dark:text-gray-200">{JSON.stringify(debugInfo.summaryTest, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-neutral">Live Tracking</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-light-text dark:text-dark-text mb-2">
            Portfolio Analytics Dashboard
          </h1>
          <p className="text-neutral text-lg">
            Real-time anonymous tracking of portfolio interactions. Privacy-first, no personal data collected.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={summary?.total_events || 0}
            icon={<BarChart3 size={32} />}
            description="All tracked interactions"
            color="primary"
          />
          <StatCard
            title="API Calls"
            value={summary?.api_calls || 0}
            icon={<TrendingUp size={32} />}
            description="Sent via API Explorer"
            color="secondary"
          />
          <StatCard
            title="Success Rate"
            value={`${summary?.api_success_rate || 0}%`}
            icon={<CheckCircle size={32} />}
            description="API request success"
            color="accent"
          />
          <StatCard
            title="Unique Visitors"
            value={summary?.unique_visitors || 0}
            icon={<Users size={32} />}
            description="Unique sessions tracked"
            color="primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Popular Demos */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
              Popular Demos
            </h2>
            {demoData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="interactions" fill="#3D5A3C" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-neutral py-12 text-center">No demo data yet</p>
            )}
          </div>

          {/* Event Types Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-neutral/20">
            <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
              Event Distribution
            </h2>
            <div className="space-y-4">
              <EventBar
                label="Page Views"
                value={summary?.page_views || 0}
                max={summary?.total_events || 1}
                color="bg-primary dark:bg-secondary"
              />
              <EventBar
                label="API Calls"
                value={summary?.api_calls || 0}
                max={summary?.total_events || 1}
                color="bg-accent dark:bg-accent-light"
              />
              <EventBar
                label="Demo Interactions"
                value={summary?.popular_demos?.reduce((sum, demo) => sum + demo.interactions, 0) || 0}
                max={summary?.total_events || 1}
                color="bg-green-500 dark:bg-green-400"
              />
            </div>
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-neutral/20">
          <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text flex items-center gap-2">
            <Activity size={24} className="text-accent dark:text-accent-light" />
            Recent Activity
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></span>
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {realtimeEvents.length > 0 ? (
              realtimeEvents.map((event, idx) => (
                <ActivityItem key={idx} event={event} />
              ))
            ) : (
              <p className="text-neutral py-8 text-center">No recent activity</p>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-8 bg-primary/5 dark:bg-secondary/5 p-6 rounded-lg border border-primary/20 dark:border-secondary/20">
          <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
            💡 Key Insights
          </h2>
          <ul className="space-y-2 text-light-text dark:text-dark-text">
            <li>
              • <strong>Total Events:</strong> {summary?.total_events || 0} interactions tracked
            </li>
            <li>
              • <strong>API Success Rate:</strong> {summary?.api_success_rate || 0}% of API requests succeeded
            </li>
            <li>
              • <strong>Unique Visitors:</strong> {summary?.unique_visitors || 0} anonymous sessions
            </li>
            <li>
              • <strong>Page Views:</strong> {summary?.page_views || 0} pages viewed across the portfolio
            </li>
            {summary?.popular_demos && summary.popular_demos.length > 0 && (
              <li>
                • <strong>Most Popular Demo:</strong> {summary.popular_demos[0].name} ({summary.popular_demos[0].interactions} interactions)
              </li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, description, color }) {
  const colorClasses = {
    primary: 'text-primary dark:text-secondary',
    secondary: 'text-secondary dark:text-primary',
    accent: 'text-accent dark:text-accent-light'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-neutral/20 hover:shadow-xl transition-shadow">
      <div className={`${colorClasses[color]} mb-3`}>{icon}</div>
      <div className="text-3xl font-bold text-light-text dark:text-dark-text mb-1">{value}</div>
      <div className="text-sm font-medium text-light-text dark:text-dark-text mb-1">{title}</div>
      <div className="text-xs text-neutral">{description}</div>
    </div>
  );
}

// Event Bar Component
function EventBar({ label, value, max, color }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-light-text dark:text-dark-text">{label}</span>
        <span className="text-light-text dark:text-dark-text font-semibold">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ event }) {
  const getEventDescription = () => {
    switch (event.event_type) {
      case 'api_call':
        return `🚀 API call: ${event.api_method} to ${event.api_endpoint?.substring(0, 50)}...`;
      case 'code_copied':
        return `📋 Code copied: ${event.language}`;
      case 'page_view':
        return `👁️ Viewed: ${event.page || event.demo_name || 'Unknown page'}`;
      case 'example_clicked':
        return `🎯 Tried example: ${event.demo_name}`;
      case 'demo_clicked':
        return `🎪 Clicked demo: ${event.demo_name}`;
      case 'demo_viewed':
        return `👀 Viewing demo: ${event.demo_name}`;
      case 'click':
        return `👆 Clicked: ${event.label || event.element}`;
      default:
        return `📊 ${event.event_type}`;
    }
  };

  const getSuccessIndicator = () => {
    if (event.event_type === 'api_call') {
      return event.success ? (
        <span className="text-green-500 text-xs">✓</span>
      ) : (
        <span className="text-red-500 text-xs">✗</span>
      );
    }
    return null;
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-sm text-light-text dark:text-dark-text">{getEventDescription()}</span>
        {getSuccessIndicator()}
      </div>
      <span className="text-xs text-neutral whitespace-nowrap ml-4">{timeAgo(event.timestamp)}</span>
    </div>
  );
}
