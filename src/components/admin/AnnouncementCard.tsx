import React from 'react';
import { AnnouncementItem } from '../../services/adminPortalService';
import { Badge } from '../common/Badge';
import { Megaphone, Pin, Trash2, Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: AnnouncementItem;
  onDelete: (id: string) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onDelete,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {announcement.isPinned && (
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Pin className="w-3.5 h-3.5" />
            </span>
          )}
          <h4 className="text-sm font-black text-slate-900 dark:text-white">
            {announcement.title}
          </h4>
          <Badge variant={announcement.status === 'Published' ? 'success' : 'secondary'} size="sm">
            {announcement.status}
          </Badge>
        </div>

        <button
          onClick={() => onDelete(announcement.id)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
        {announcement.content}
      </p>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
        <span>Audience: <strong className="text-slate-700 dark:text-slate-300 uppercase">{announcement.targetAudience}</strong></span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {announcement.createdAt}
        </span>
      </div>
    </div>
  );
};
