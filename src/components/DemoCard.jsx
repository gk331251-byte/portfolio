import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { trackDemoCardClick } from '../utils/analytics';

const DemoCard = ({
  title,
  description,
  tags,
  path,
  gradient,
  image,
  badge,
  badges,
  featured,
  interactive,
  flagship,
  stats,
  ctaText = 'View Demo'
}) => {
  // Use badges array if provided, otherwise fall back to single badge
  const displayBadges = badges || (badge ? [badge] : []);

  return (
    <Link
      to={path}
      onClick={() => trackDemoCardClick(title)}
      className={`group block bg-light-bg dark:bg-dark-bg rounded-lg overflow-hidden transition-all duration-300 border relative ${
        flagship
          ? 'shadow-2xl hover:shadow-3xl hover:scale-[1.08] border-2'
          : 'shadow-lg hover:shadow-2xl hover:scale-105'
      } ${
        featured
          ? 'border-green-500 dark:border-green-400 ring-2 ring-green-500/20 dark:ring-green-400/20 hover:ring-4 hover:ring-green-500/30'
          : interactive
          ? 'border-cyan-500 dark:border-cyan-400 ring-2 ring-cyan-500/20 dark:ring-cyan-400/20 hover:ring-4 hover:ring-cyan-500/30 animate-pulse-border'
          : 'border-neutral/20'
      }`}
    >
      {/* Flagship ribbon */}
      {flagship && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
          <Sparkles size={12} />
          <span>FEATURED</span>
        </div>
      )}

      {/* Thumbnail with gradient or image */}
      <div className="h-48 w-full relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${title} - Portfolio Demo Screenshot`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              flagship ? 'group-hover:scale-125' : 'group-hover:scale-110'
            }`}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: gradient || 'linear-gradient(135deg, #3D5A3C 0%, #9CAF88 100%)',
            }}
          />
        )}

        {/* Multiple badges overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {displayBadges.map((badgeText, index) => (
            <span
              key={index}
              className={`text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg ${
                interactive
                  ? 'bg-cyan-500 dark:bg-cyan-400 animate-pulse'
                  : featured
                  ? 'bg-green-500'
                  : 'bg-primary dark:bg-secondary'
              }`}
            >
              {badgeText}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text group-hover:text-primary dark:group-hover:text-secondary transition-colors">
          {title}
        </h3>

        <p className="text-neutral mb-4 leading-relaxed text-sm">
          {description}
        </p>

        {/* Stats (for flagship demos) */}
        {stats && (
          <div className="mb-4 p-3 bg-primary/5 dark:bg-secondary/5 rounded-lg border border-primary/20 dark:border-secondary/20">
            <p className="text-xs font-semibold text-primary dark:text-secondary">
              {stats}
            </p>
          </div>
        )}

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

        {/* CTA Button */}
        <div className={`flex items-center space-x-2 font-medium transition-all ${
          flagship
            ? 'text-accent dark:text-accent-light group-hover:translate-x-3'
            : 'text-primary dark:text-secondary group-hover:translate-x-2'
        }`}>
          <span className="font-bold">{ctaText}</span>
          <ArrowRight size={16} className={flagship ? 'animate-bounce-x' : ''} />
        </div>
      </div>
    </Link>
  );
};

export default DemoCard;
