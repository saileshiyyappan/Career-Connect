import React, { useState } from 'react';
import { UpcomingInterview } from '../../services/candidatePortalService';
import { Calendar, Clock, Video, UserCheck, CheckSquare, Square, CalendarPlus, ExternalLink, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface InterviewCardProps {
  interview: UpcomingInterview;
  onToggleChecklist: (interviewId: string, itemId: string) => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onToggleChecklist,
}) => {
  const [showChecklist, setShowChecklist] = useState(true);

  const completedCount = interview.preparationChecklist.filter(c => c.completed).length;
  const totalCount = interview.preparationChecklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddToCalendar = () => {
    // Generate calendar link simulation
    const title = encodeURIComponent(`Interview: ${interview.jobTitle} @ ${interview.companyName}`);
    const details = encodeURIComponent(`Interviewer: ${interview.interviewerName} (${interview.interviewerRole})\nMeeting Link: ${interview.meetingLink}`);
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-5">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          {interview.companyLogoUrl ? (
            <img
              src={interview.companyLogoUrl}
              alt={interview.companyName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 font-extrabold flex items-center justify-center text-lg shrink-0">
              {interview.companyName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">{interview.companyName}</span>
              <Badge variant="purple" size="sm">{interview.interviewType}</Badge>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
              {interview.jobTitle}
            </h3>
          </div>
        </div>

        {/* Date / Time Badge */}
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 flex items-center gap-3 shrink-0">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="text-xs">
            <p className="font-extrabold text-slate-900 dark:text-white">{interview.interviewDate}</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {interview.interviewTime}
            </p>
          </div>
        </div>
      </div>

      {/* Interviewer Details & Meeting Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400">Interviewer</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{interview.interviewerName}</p>
            <p className="text-[11px] text-slate-500">{interview.interviewerRole}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Video className="w-4 h-4" />
            Join Video Call
          </a>
          <button
            onClick={handleAddToCalendar}
            title="Add to Calendar"
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <CalendarPlus className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Notes */}
      {interview.notes && (
        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
          <span className="font-bold">Interviewer Note: </span>
          {interview.notes}
        </div>
      )}

      {/* Preparation Checklist */}
      <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600"
          >
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>Preparation Checklist</span>
            <span className="text-[11px] font-semibold text-slate-500">
              ({completedCount}/{totalCount} completed • {progressPercent}%)
            </span>
            {showChecklist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Mini progress bar */}
          <div className="w-24 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {showChecklist && (
          <div className="space-y-2">
            {interview.preparationChecklist.map((item) => (
              <label
                key={item.id}
                onClick={() => onToggleChecklist(interview.id, item.id)}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer text-xs ${
                  item.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <span className="leading-snug">{item.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
