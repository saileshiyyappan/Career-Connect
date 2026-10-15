import React, { useState } from 'react';
import { 
  ExternalLink, 
  Clock, 
  User, 
  Calendar, 
  Eye, 
  Share2, 
  Bookmark,
  Check
} from 'lucide-react';
import { CareerNewsItem } from '../../types/news';
import { formatRelativeTime, formatDate } from '../../utils/formatters';
import { getCategoryConfig } from '../../constants/newsCategories';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

export interface NewsCardProps {
  article: CareerNewsItem;
  onPreview?: (article: CareerNewsItem) => void;
  layoutVariant?: 'standard' | 'featured' | 'compact';
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onPreview,
  layoutVariant = 'standard',
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryCfg = getCategoryConfig(article.category);
  const CategoryIcon = categoryCfg.icon;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.sourceUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCardClick = () => {
    if (onPreview) {
      onPreview(article);
    } else if (article.sourceUrl) {
      window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Featured Layout Variant
  if (layoutVariant === 'featured') {
    return (
      <article
        onClick={handleCardClick}
        className={cn(
          'group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer flex flex-col lg:flex-row',
          className
        )}
      >
        {/* Featured Image or Fallback */}
        <div className="lg:w-1/2 relative min-h-[240px] sm:min-h-[300px] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {article.thumbnailUrl && !imageError ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
                style={{ backgroundColor: categoryCfg.color }}
              >
                <CategoryIcon className="w-8 h-8" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {categoryCfg.label}
              </span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                {article.sourceName}
              </p>
            </div>
          )}

          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant={categoryCfg.badgeVariant} size="md" className="shadow-sm backdrop-blur-md">
              <CategoryIcon className="w-3.5 h-3.5 mr-1" />
              {categoryCfg.shortLabel}
            </Badge>
          </div>
        </div>

        {/* Featured Content Details */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            {/* Meta info header */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                  {article.sourceName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatRelativeTime(article.publishedAt)}
                </span>
                {article.readingTimeMinutes && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTimeMinutes} min read
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={copied ? 'Link Copied!' : 'Share Article URL'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 sm:line-clamp-4 leading-relaxed">
              {article.summary}
            </p>

            {/* Author if available */}
            {article.author && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Reported by <span className="font-medium text-slate-700 dark:text-slate-300">{article.author}</span>
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {article.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {onPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(article);
                }}
                className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Quick Preview
              </button>
            )}

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm shadow-blue-500/20"
            >
              <span>Read on {article.sourceName}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  // Standard Grid Card Variant
  return (
    <article
      onClick={handleCardClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between',
        className
      )}
    >
      <div>
        {/* Card Thumbnail or Clean Fallback */}
        <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {article.thumbnailUrl && !imageError ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/30 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 text-center">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs"
                style={{ backgroundColor: categoryCfg.color }}
              >
                <CategoryIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {article.sourceName}
              </span>
            </div>
          )}

          {/* Category Tag on Thumbnail */}
          <div className="absolute top-3 left-3">
            <Badge variant={categoryCfg.badgeVariant} size="sm" className="shadow-xs backdrop-blur-md">
              <CategoryIcon className="w-3 h-3 mr-1" />
              {categoryCfg.shortLabel}
            </Badge>
          </div>

          {/* Share Action */}
          <button
            type="button"
            onClick={handleShare}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs transition-colors"
            title={copied ? 'Link Copied!' : 'Share Article URL'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          {/* Source Attribution & Date */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
              {article.sourceName}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3 h-3" />
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>

          {/* Reading Time or Author */}
          {(article.readingTimeMinutes || article.author) && (
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              {article.author && (
                <span className="truncate max-w-[130px]" title={article.author}>
                  By {article.author}
                </span>
              )}
              {article.author && article.readingTimeMinutes && <span>•</span>}
              {article.readingTimeMinutes && (
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes} min read
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 flex items-center justify-between mt-auto">
        {onPreview ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(article);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        ) : <div />}

        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read Article</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
};
