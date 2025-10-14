import { Link } from 'react-router-dom';
import { Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-bg text-dark-text border-t border-neutral/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">About</h3>
            <p className="text-sm text-dark-text/80 leading-relaxed">
              Solutions Engineer specializing in API integrations, cloud architecture,
              and customer-facing technical solutions. GCP Professional Cloud Architect
              certified with a passion for transforming technical complexity into customer success.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-dark-text/80 hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/demos/stripe-integration" className="text-sm text-dark-text/80 hover:text-secondary">
                  Demos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-dark-text/80 hover:text-secondary">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-secondary">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/gavin-kelly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary/10 rounded-full hover:bg-secondary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/gavinkelly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-secondary/10 rounded-full hover:bg-secondary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:gavin@example.com"
                className="p-2 bg-secondary/10 rounded-full hover:bg-secondary/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral/20 text-center">
          <p className="text-sm text-dark-text/60">
            © {new Date().getFullYear()} Gavin Kelly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
