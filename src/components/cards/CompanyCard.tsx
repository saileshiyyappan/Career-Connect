import React from 'react';
import { Building2, MapPin, Users, Briefcase } from 'lucide-react';
import { CompanyItem } from '../../types/company';
import { Badge } from '../common/Badge';
import { OutlineButton } from '../common/OutlineButton';
import { cn } from '../../utils/cn';

export interface CompanyCardProps {
  company: CompanyItem;
  onClick?: (id: string) => void;
  className?: string;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={() => onClick && onClick(company.id)}
      className={cn(
        'group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      {company.bannerUrl && (
        <div className="h-16 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
          <img src={company.bannerUrl} alt={company.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className={cn("p-6 flex flex-col justify-between h-full", company.bannerUrl ? "pt-4" : "")}>
        <div>
          <div className="flex items-center gap-3 mb-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xl border border-slate-200 dark:border-slate-700">
              {company.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {company.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {company.industry}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {company.tagline || company.description}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {company.headquarters}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {company.companySize}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">
            <Briefcase className="w-3 h-3 mr-1" />
            {company.openJobsCount} {company.openJobsCount === 1 ? 'Open Job' : 'Open Jobs'}
          </Badge>
          {company.verified ? (
            <Badge variant="warning" size="sm">Verified</Badge>
          ) : company.companyOrigin === 'internal' ? (
            <Badge variant="info" size="sm">Direct Employer</Badge>
          ) : (
            <Badge variant="default" size="sm">{company.sourceName ? `${company.sourceName}` : 'Partner Network'}</Badge>
          )}
        </div>

        <OutlineButton size="sm">
          View Company
        </OutlineButton>
      </div>
      </div>
    </div>
  );
};
