import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DemoCard = ({ title, description, tags, path, gradient }) => {
  return (
    <Link
      to={path}
      className="group block bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-neutral/20"
    >
      {/* Thumbnail with gradient */}
      <div
        className="h-48 w-full"
        style={{
          background: gradient || 'linear-gradient(135deg, #3D5A3C 0%, #9CAF88 100%)',
        }}
      />

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text group-hover:text-primary dark:group-hover:text-secondary">
          {title}
        </h3>

        <p className="text-neutral mb-4 leading-relaxed">
          {description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Demo Button */}
        <div className="flex items-center space-x-2 text-primary dark:text-secondary font-medium group-hover:translate-x-2 transition-transform">
          <span>View Demo</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
};

export default DemoCard;
