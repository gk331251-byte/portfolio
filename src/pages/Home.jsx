import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Github, Mail, BarChart3, CheckCircle, Users, TrendingUp } from 'lucide-react';
import DemoCard from '../components/DemoCard';
import { trackPageView, trackDemoCardClick } from '../utils/analytics';
import { API_CONFIG } from '../config/api';

const ANALYTICS_API = `${API_CONFIG.analyticsBackend}/api/analytics`;

const Home = () => {
  const [analytics, setAnalytics] = useState(null);

  const demos = [
    {
      title: 'Interactive API Explorer',
      description: 'Live, fully-functional API testing tool built into the portfolio. Test any REST API, see real-time responses, and generate production-ready code in 5 languages. Try it yourself - no setup required, works entirely in your browser.',
      tags: ['React', 'Axios', 'REST APIs', 'Code Generation', 'Developer Tools'],
      path: '/demos/api-explorer',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      badges: ['⚡ Interactive Tool', '🔨 Try It Live'],
      interactive: true,
      flagship: true,
      stats: 'Supports 5 Languages • Test Any API • Instant Results',
      ctaText: 'Try It Now',
    },
    {
      title: 'GCP Cloud Architecture Guide',
      description: 'Production-backed cloud architecture guide with real Cloud Run deployment. Complete reference architecture, service selection strategies, scaling patterns, and cost optimization. Includes live GCP console screenshots and working demo infrastructure.',
      tags: ['Cloud Run', 'GCP', 'Firestore', 'Docker', 'Kubernetes', 'CI/CD', 'PostgreSQL'],
      path: '/demos/gcp-architecture',
      image: '/images/demos/gcp/gcp-cloud-run-dashboard.png',
      gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
      badges: ['🚀 Live Deployment', '📸 Real Screenshots'],
      featured: true,
      flagship: true,
      stats: '4 Mermaid Diagrams • 4 GCP Screenshots • Live Deployment',
      ctaText: 'Explore Architecture',
    },
    {
      title: 'Stripe Payment Integration',
      description: 'Production-ready payment processing with FastAPI backend and React frontend. Features secure webhook handling, real-time event processing, and comprehensive error recovery. Includes working demo, full source code, and complete documentation.',
      tags: ['FastAPI', 'Stripe API', 'React', 'Webhooks', 'Python', 'Docker'],
      path: '/demos/stripe-integration',
      image: '/images/demos/stripe/checkout-empty.png',
      badges: ['✓ Live Demo'],
      ctaText: 'View Demo',
    },
  ];

  const skills = {
    'Cloud & Infrastructure': ['GCP Cloud Run', 'Docker', 'Kubernetes', 'AWS'],
    'Development': ['FastAPI', 'React', 'Python', 'JavaScript', 'Git'],
    'Integrations': ['REST APIs', 'Webhooks', 'OAuth', 'Stripe', 'Google Maps'],
    'Solutions Engineering': ['Technical Demos', 'Architecture Design', 'Customer Onboarding', 'Documentation'],
  };

  const certifications = [
    'GCP Professional Cloud Architect',
    'CompTIA A+',
  ];

  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${ANALYTICS_API}/summary`);
        const data = await response.json();
        setAnalytics(data.data);
      } catch (err) {
        console.error('Failed to fetch analytics preview', err);
      }
    };

    fetchAnalytics();

    // Refresh every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-light-text dark:text-dark-text">
            Solutions Engineer Portfolio
          </h1>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-primary dark:text-secondary">
            Gavin Kelly
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-neutral">
            Transforming Technical Complexity into Customer Success
          </p>
          <p className="text-lg mb-12 leading-relaxed max-w-2xl mx-auto text-light-text/80 dark:text-dark-text/80">
            Engineering Physics graduate with GCP Professional Cloud Architect certification,
            specializing in API integrations, cloud architecture, and customer-facing technical solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demos"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-primary dark:bg-secondary text-white dark:text-dark-bg rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <span>View Demos</span>
              <ArrowRight size={20} />
            </a>
            <a
              href="/images/demos/resume/Resume-GavinKelly.pdf"
              download="Gavin_Kelly_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-primary dark:border-secondary text-primary dark:text-secondary rounded-full font-bold hover:bg-primary/10 dark:hover:bg-secondary/10 transition-colors"
            >
              <Download size={20} />
              <span>Download Resume</span>
            </a>
          </div>

          {/* Privacy Banner */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📊 This portfolio tracks anonymous usage data to demonstrate analytics capabilities. No personal information is collected.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Grid Section */}
      <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8 bg-light-bg dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
              Technical Demonstrations
            </h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">
              Real-world solutions showcasing integration design, cloud architecture, and customer success engineering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demos.map((demo, index) => (
              <DemoCard key={index} {...demo} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Portfolio Analytics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/5 via-primary/5 to-secondary/5 dark:from-accent/10 dark:via-primary/10 dark:to-secondary/10 border-y border-neutral/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Real-time badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 dark:bg-green-400/10 border border-green-500/30 dark:border-green-400/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300 font-semibold text-sm">Tracking in Real-Time</span>
            </div>

            {/* Icon and Title */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BarChart3 size={40} className="text-accent dark:text-accent-light" />
              <h2 className="text-4xl sm:text-5xl font-bold text-light-text dark:text-dark-text">
                Live Portfolio Analytics
              </h2>
            </div>

            <h3 className="text-2xl font-bold text-primary dark:text-secondary mb-4">
              This Portfolio Tracks Itself
            </h3>

            <p className="text-lg text-neutral max-w-3xl mx-auto leading-relaxed">
              Every interaction with this portfolio is measured. See how visitors engage with demos, test APIs,
              and explore projects - all in real-time with anonymous, privacy-first tracking.
            </p>
          </div>

          {/* Metrics Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* API Calls Card */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-xl p-8 shadow-lg border-2 border-primary/20 dark:border-secondary/20 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="text-center">
                <TrendingUp size={40} className="text-primary dark:text-secondary mx-auto mb-4" />
                <div className="text-5xl font-bold text-light-text dark:text-dark-text mb-2">
                  {analytics?.api_calls || 0}
                </div>
                <div className="text-sm font-semibold text-neutral uppercase tracking-wide">
                  API Calls
                </div>
              </div>
            </div>

            {/* Success Rate Card */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-xl p-8 shadow-lg border-2 border-green-500/20 dark:border-green-400/20 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="text-center">
                <CheckCircle size={40} className="text-green-600 dark:text-green-400 mx-auto mb-4" />
                <div className="text-5xl font-bold text-light-text dark:text-dark-text mb-2">
                  {analytics?.api_success_rate || 0}%
                </div>
                <div className="text-sm font-semibold text-neutral uppercase tracking-wide">
                  Success Rate
                </div>
              </div>
            </div>

            {/* Visitors Card */}
            <div className="bg-light-bg dark:bg-dark-bg rounded-xl p-8 shadow-lg border-2 border-accent/20 dark:border-accent-light/20 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="text-center">
                <Users size={40} className="text-accent dark:text-accent-light mx-auto mb-4" />
                <div className="text-5xl font-bold text-light-text dark:text-dark-text mb-2">
                  {analytics?.unique_visitors || 0}
                </div>
                <div className="text-sm font-semibold text-neutral uppercase tracking-wide">
                  Unique Visitors
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/analytics"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white dark:text-dark-bg rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <BarChart3 size={24} />
              <span>View Full Dashboard</span>
              <ArrowRight size={24} />
            </Link>
            <p className="text-sm text-neutral mt-4">
              See detailed metrics, charts, and insights about portfolio engagement
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
              Technical Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-light-bg dark:bg-dark-bg p-6 rounded-lg shadow-lg border border-neutral/20">
                <h3 className="text-xl font-bold mb-4 text-primary dark:text-secondary">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
              Certifications
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-6 py-3 rounded-full bg-accent/20 text-accent-dark dark:text-accent-light font-bold text-lg border-2 border-accent"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
            Let's Connect
          </h2>
          <p className="text-xl text-neutral mb-12">
            Interested in discussing Solutions Engineering or technical integrations? Reach out!
          </p>

          <div className="flex justify-center space-x-6">
            <a
              href="https://www.linkedin.com/in/gavin-kelly1/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center space-y-2"
            >
              <div className="p-6 bg-primary/10 dark:bg-secondary/10 rounded-full group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                <Linkedin size={32} className="text-primary dark:text-secondary" />
              </div>
              <span className="font-medium text-neutral group-hover:text-primary dark:group-hover:text-secondary">
                LinkedIn
              </span>
            </a>

            <a
              href="https://github.com/gk331251-byte"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center space-y-2"
            >
              <div className="p-6 bg-primary/10 dark:bg-secondary/10 rounded-full group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                <Github size={32} className="text-primary dark:text-secondary" />
              </div>
              <span className="font-medium text-neutral group-hover:text-primary dark:group-hover:text-secondary">
                GitHub
              </span>
            </a>

            <a
              href="mailto:gavinkelly0113@gmail.com"
              className="group flex flex-col items-center space-y-2"
            >
              <div className="p-6 bg-primary/10 dark:bg-secondary/10 rounded-full group-hover:bg-primary/20 dark:group-hover:bg-secondary/20 transition-colors">
                <Mail size={32} className="text-primary dark:text-secondary" />
              </div>
              <span className="font-medium text-neutral group-hover:text-primary dark:group-hover:text-secondary">
                Email
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
