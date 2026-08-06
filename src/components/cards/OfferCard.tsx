import React from 'react';
import { JobOffer } from '../../services/employerPortalService';
import { Badge } from '../common/Badge';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { DollarSign, Calendar, Award, FileCheck, Send, CheckCircle2, XCircle, Clock, Download } from 'lucide-react';

interface OfferCardProps {
  offer: JobOffer;
  onUpdateStatus: (offerId: string, status: JobOffer['status']) => void;
  onDownloadPdf: (offer: JobOffer) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onUpdateStatus,
  onDownloadPdf,
}) => {
  const getBadgeVariant = (status: JobOffer['status']) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      case 'Expired': return 'secondary';
      default: return 'info';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {offer.candidateName}
            </h4>
            <Badge variant={getBadgeVariant(offer.status)} size="sm">
              {offer.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Role: <strong className="text-slate-700 dark:text-slate-300">{offer.jobTitle}</strong> ({offer.candidateEmail})
          </p>
        </div>

        <button
          onClick={() => onDownloadPdf(offer)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-blue-500" />
          Download PDF
        </button>
      </div>

      {/* Compensation Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-0.5">Base Annual Salary</span>
          <p className="text-base font-black text-slate-900 dark:text-white">
            ${offer.baseSalary.toLocaleString()} USD
          </p>
        </div>

        {offer.signingBonus && (
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-0.5">Signing Bonus</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
              ${offer.signingBonus.toLocaleString()} USD
            </p>
          </div>
        )}

        {offer.equity && (
          <div>
            <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-0.5">Stock Equity</span>
            <p className="text-base font-black text-purple-600 dark:text-purple-400">
              {offer.equity}
            </p>
          </div>
        )}
      </div>

      {/* Dates & Expiration */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium gap-2">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          Target Start Date: <strong className="text-slate-700 dark:text-slate-300">{offer.startDate}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
          <Clock className="w-4 h-4" />
          Offer Expires: {offer.expirationDate}
        </span>
      </div>

      {/* Action Bar */}
      {offer.status === 'Pending' && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <SecondaryButton size="sm" onClick={() => onUpdateStatus(offer.id, 'Rejected')}>
            Mark Declined
          </SecondaryButton>
          <PrimaryButton size="sm" icon={CheckCircle2} onClick={() => onUpdateStatus(offer.id, 'Accepted')}>
            Mark Accepted
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
