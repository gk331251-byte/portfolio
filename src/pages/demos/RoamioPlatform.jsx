import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RoamioPlatform = () => {
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
              background: 'linear-gradient(135deg, #3D5A3C 0%, #9CAF88 100%)',
            }}
          />

          <h1 className="text-5xl font-bold mb-6 text-light-text dark:text-dark-text">
            Roamio Platform Technical Deep Dive
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {['FastAPI', 'React', 'Docker', 'GPT-4', 'Google Maps'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xl text-neutral leading-relaxed">
            A comprehensive full-stack travel planning platform featuring AI-powered itinerary generation,
            real-time collaboration, Google Maps integration, and responsive mobile-first design. This
            demonstration showcases modern application architecture, API design, and user experience
            considerations for consumer-facing products.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-8 shadow-lg border border-neutral/20">
          <h2 className="text-3xl font-bold mb-6 text-primary dark:text-secondary">
            Overview
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-light-text dark:text-dark-text">
            Roamio is a full-stack application that demonstrates end-to-end product development including
            FastAPI backend services, React frontend with modern state management, Docker containerization,
            OpenAI GPT-4 integration for intelligent itinerary suggestions, Google Maps API for location
            services, and real-time collaborative features for group trip planning.
          </p>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-6 text-center">
            <p className="text-xl font-bold text-accent-dark dark:text-accent-light mb-2">
              Detailed Demo Content Coming Soon
            </p>
            <p className="text-neutral">
              Architecture overview, API documentation, frontend component library, deployment
              configuration, and live demo link will be added here.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link
            to="/demos/customer-health-dashboard"
            className="inline-flex items-center space-x-2 text-primary dark:text-secondary hover:opacity-80 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Previous: Customer Health Dashboard</span>
          </Link>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default RoamioPlatform;
