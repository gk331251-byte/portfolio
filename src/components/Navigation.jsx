import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { trackClick } from '../utils/analytics';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDemosOpen, setIsDemosOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const demos = [
    { name: 'Stripe Integration', path: '/demos/stripe-integration' },
    { name: 'GCP Architecture', path: '/demos/gcp-architecture' },
    { name: 'Onboarding Automation', path: '/demos/onboarding-automation' },
    { name: 'Customer Health Dashboard', path: '/demos/customer-health-dashboard' },
    { name: 'Roamio Platform', path: '/demos/roamio-platform' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neutral/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <Link
            to="/"
            onClick={() => trackClick('navigation', 'logo')}
            className="text-xl font-bold text-primary dark:text-secondary hover:opacity-80"
          >
            Gavin Kelly
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => trackClick('navigation', 'home_link')}
              className={`font-medium hover:text-primary dark:hover:text-secondary ${
                isActive('/') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              Home
            </Link>

            {/* Demos Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDemosOpen(true)}
              onMouseLeave={() => setIsDemosOpen(false)}
            >
              <button className="flex items-center space-x-1 font-medium hover:text-primary dark:hover:text-secondary">
                <span>Demos</span>
                <ChevronDown size={16} className={`transform transition-transform ${isDemosOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDemosOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glass-effect rounded-lg shadow-lg border border-neutral/20 py-2">
                  {demos.map((demo) => (
                    <Link
                      key={demo.path}
                      to={demo.path}
                      className="block px-4 py-2 hover:bg-primary/10 dark:hover:bg-secondary/10"
                    >
                      {demo.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={() => trackClick('navigation', 'about_link')}
              className={`font-medium hover:text-primary dark:hover:text-secondary ${
                isActive('/about') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/analytics"
              onClick={() => trackClick('navigation', 'analytics_link')}
              className={`font-medium hover:text-primary dark:hover:text-secondary ${
                isActive('/analytics') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              Analytics
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-secondary/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-primary/10 dark:hover:bg-secondary/10"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral/20 glass-effect">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block py-2 font-medium ${
                isActive('/') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              Home
            </Link>

            {/* Mobile Demos Section */}
            <div>
              <div className="py-2 font-medium text-neutral">Demos</div>
              <div className="pl-4 space-y-2">
                {demos.map((demo) => (
                  <Link
                    key={demo.path}
                    to={demo.path}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-sm hover:text-primary dark:hover:text-secondary"
                  >
                    {demo.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block py-2 font-medium ${
                isActive('/about') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/analytics"
              onClick={() => setIsOpen(false)}
              className={`block py-2 font-medium ${
                isActive('/analytics') ? 'text-primary dark:text-secondary' : ''
              }`}
            >
              Analytics
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
