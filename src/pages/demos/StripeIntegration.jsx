import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StripeIntegration = () => {
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
              background: 'linear-gradient(135deg, #635BFF 0%, #8B85FF 100%)',
            }}
          />

          <h1 className="text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
            Stripe Payment Integration Guide
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {['FastAPI', 'Stripe API', 'React', 'Webhooks'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xl text-neutral leading-relaxed">
            A comprehensive technical demonstration of integrating Stripe's payment processing API
            into a full-stack application, featuring secure payment handling, webhook implementation,
            subscription management, and error handling strategies for production-ready solutions.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
          <h2 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
            Overview
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
            This demonstration showcases end-to-end Stripe integration including payment intent creation,
            secure checkout flows, webhook event handling, and subscription lifecycle management. Built
            with modern best practices for security, error handling, and customer experience.
          </p>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-accent-dark dark:text-accent-light mb-2">
              Detailed Demo Content Coming Soon
            </p>
            <p className="text-neutral">
              Full technical walkthrough, code samples, architecture diagrams, and implementation
              guide will be added here.
            </p>
          </div>
        </div>

        {/* Navigation to Next Demo */}
        <div className="mt-12 flex justify-between items-center">
          <div></div>
          <Link
            to="/demos/gcp-architecture"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <span>Next: GCP Cloud Architecture</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StripeIntegration;
