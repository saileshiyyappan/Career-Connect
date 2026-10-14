import React, { useState } from 'react';
import { Bookmark, MapPin, Briefcase, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { JobItem } from '../../types/job';
import { formatSalaryRange, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { PrimaryButton } from '../common/PrimaryButton';
import { cn } from '../../utils/cn';

export interface JobCardProps {
  job: JobItem;
  onApply?: (jobId: string) => void;
  onBookmark?: (jobId: string) => void;
  onClick?: (jobId: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onBookmark,
  onClick,
  isBookmarked: initialBookmarked = false,
  className,
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark(job.id);
  };

  const handleCardClick = () => {
    if (onClick) onClick(job.id);
  };

  const formattedLocation = typeof job.location === 'string'
    ? job.location
    : `${job.location.city}${job.location.state ? `, ${job.location.state}` : ''}`;

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4',
        job.featured ? 'ring-1 ring-blue-500/30 bg-gradient-to-br from-blue-50/20 via-white to-white dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900' : '',
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-lg border border-slate-200 dark:border-slate-700">
                {job.companyName.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">{job.companyName}</h4>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                {job.title}
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400" />
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={cn(
              'p-2 rounded-xl border transition-all cursor-pointer',
              bookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:bg-amber-950/50'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            )}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            <Bookmark className={cn('w-4 h-4', bookmarked ? 'fill-current' : '')} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" size="sm">
            <Briefcase className="w-3 h-3 mr-1" />
            {job.employmentType}
          </Badge>
          <Badge variant="default" size="sm">
            <MapPin className="w-3 h-3 mr-1" />
            {formattedLocation}
          </Badge>
          <Badge variant="accent" size="sm">
            <DollarSign className="w-3 h-3 mr-1" />
            {formatSalaryRange(job.salary)}
          </Badge>
          {job.jobOrigin === 'external' ? (
            <Badge variant="default" size="sm">
              {job.sourceName ? `Via ${job.sourceName}` : 'Partner Network'}
            </Badge>
          ) : (
            <Badge variant="success" size="sm">
              Direct Employer
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(job.postedAt)}
        </span>

        {job.jobOrigin === 'external' && job.sourceUrl ? (
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <span>Apply {job.sourceName ? `on ${job.sourceName}` : 'Externally'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        ) : onApply ? (
          <PrimaryButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onApply(job.id);
            }}
          >
            Apply Now
          </PrimaryButton>
        ) : null}
      </div>
    </div>
  );
};
