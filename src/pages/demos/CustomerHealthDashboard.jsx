import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const CustomerHealthDashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 mb-8"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <div
            className="h-64 w-full rounded-lg mb-8"
            style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            }}
          />

          <h1 className="text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
            Customer Health Score Dashboard
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {['React', 'Recharts', 'Analytics', 'Dashboard'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xl text-neutral leading-relaxed">
            A real-time analytics dashboard for visualizing customer engagement metrics, usage patterns,
            and health scores. This demonstration shows how to aggregate customer data, calculate health
            indicators, and present actionable insights to proactively identify at-risk accounts and
            expansion opportunities.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
          <h2 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
            Overview
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
            This interactive dashboard demonstrates modern data visualization techniques for customer success
            teams. Features include trend analysis, cohort comparisons, predictive health scoring algorithms,
            and automated alert systems for customer activity changes that require attention.
          </p>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-accent-dark dark:text-accent-light mb-2">
              Detailed Demo Content Coming Soon
            </p>
            <p className="text-neutral">
              Interactive dashboard screenshots, data model documentation, health score algorithms,
              and implementation guide will be added here.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link
            to="/demos/onboarding-automation"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Previous: Onboarding Automation</span>
          </Link>
          <Link
            to="/demos/roamio-platform"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <span>Next: Roamio Platform</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerHealthDashboard;
