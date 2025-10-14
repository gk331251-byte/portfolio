import { Link } from 'react-router-dom';
import { ArrowRight, Download, Linkedin, Github, Mail } from 'lucide-react';
import DemoCard from '../components/DemoCard';

const Home = () => {
  const demos = [
    {
      title: 'Stripe Payment Integration',
      description: 'Comprehensive guide to integrating Stripe API for payment processing, including webhooks, subscription management, and error handling for seamless customer transactions.',
      tags: ['FastAPI', 'Stripe API', 'React', 'Webhooks'],
      path: '/demos/stripe-integration',
      gradient: 'linear-gradient(135deg, #635BFF 0%, #8B85FF 100%)',
    },
    {
      title: 'GCP Cloud Architecture',
      description: 'End-to-end cloud-native architecture design on Google Cloud Platform, featuring Cloud Run, Firestore, and automated CI/CD for scalable, cost-optimized applications.',
      tags: ['GCP', 'Cloud Run', 'Firestore', 'Docker'],
      path: '/demos/gcp-architecture',
      gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
    },
    {
      title: 'Customer Onboarding Automation',
      description: 'Automated workflow system for streamlining customer onboarding processes, integrating CRM systems, email campaigns, and task management for improved customer success.',
      tags: ['Automation', 'n8n', 'CRM', 'APIs'],
      path: '/demos/onboarding-automation',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)',
    },
    {
      title: 'Customer Health Score Dashboard',
      description: 'Real-time analytics dashboard visualizing customer engagement metrics, usage patterns, and health scores to proactively identify at-risk accounts and expansion opportunities.',
      tags: ['React', 'Recharts', 'Analytics', 'Dashboard'],
      path: '/demos/customer-health-dashboard',
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    },
    {
      title: 'Roamio Platform Technical Deep Dive',
      description: 'Full-stack travel planning platform featuring AI-powered itinerary generation, real-time collaboration, Google Maps integration, and responsive mobile-first design.',
      tags: ['FastAPI', 'React', 'Docker', 'GPT-4', 'Google Maps'],
      path: '/demos/roamio-platform',
      gradient: 'linear-gradient(135deg, #3D5A3C 0%, #9CAF88 100%)',
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
              href="/resume.pdf"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-primary dark:border-secondary text-primary dark:text-secondary rounded-full font-bold hover:bg-primary/10 dark:hover:bg-secondary/10 transition-colors"
            >
              <Download size={20} />
              <span>Download Resume</span>
            </a>
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
              href="https://linkedin.com/in/gavin-kelly"
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
              href="https://github.com/gavinkelly"
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
              href="mailto:gavin@example.com"
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
