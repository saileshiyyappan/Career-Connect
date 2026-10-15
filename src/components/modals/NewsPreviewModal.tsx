import React, { useState } from 'react';
import { 
  ExternalLink, 
  Clock, 
  Calendar, 
  User, 
  Globe, 
  Share2, 
  Check, 
  Info,
  X
} from 'lucide-react';
import { CareerNewsItem } from '../../types/news';
import { formatRelativeTime, formatDate } from '../../utils/formatters';
import { getCategoryConfig } from '../../constants/newsCategories';
import { Modal } from './Modal';
import { Badge } from '../common/Badge';
import { PrimaryButton } from '../common/PrimaryButton';

export interface NewsPreviewModalProps {
  article: CareerNewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const categoryCfg = getCategoryConfig(article.category);
  const CategoryIcon = categoryCfg.icon;

  const handleShare = () => {
    if (navigator.clipboard && article.sourceUrl) {
      navigator.clipboard.writeText(article.sourceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={categoryCfg.badgeVariant} size="sm">
              <CategoryIcon className="w-3.5 h-3.5 mr-1" />
              {categoryCfg.label}
            </Badge>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Source: <strong className="text-slate-900 dark:text-white">{article.sourceName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={copied ? 'Link Copied!' : 'Copy Article Link'}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Image or Fallback Card */}
        {article.thumbnailUrl && !imageError ? (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full p-8 rounded-2xl bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md"
              style={{ backgroundColor: categoryCfg.color }}
            >
              <CategoryIcon className="w-7 h-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {categoryCfg.label}
            </p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
              Published by {article.sourceName}
            </p>
          </div>
        )}

        {/* Title and Metadata */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(article.publishedAt)} ({formatRelativeTime(article.publishedAt)})
            </span>
            {article.readingTimeMinutes && (
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readingTimeMinutes} min read
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                By {article.author}
              </span>
            )}
          </div>
        </div>

        {/* Summary Content */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Article Summary
          </h4>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
            {article.summary}
          </p>
        </div>

        {/* Tags if available */}
        {article.tags && article.tags.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500">Topics & Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer note */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs text-slate-600 dark:text-slate-300">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p>
            CareerConnect is a career intelligence aggregator. To read the full report, analyses, and comments, visit the official publisher website.
          </p>
        </div>

        {/* Modal Action CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Preview
          </button>

          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-md shadow-blue-500/20"
          >
            <span>Read Full Article on {article.sourceName}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </Modal>
  );
};
