import React from 'react';
import { EmployerTeamMember } from '../../services/employerPortalService';
import { Badge } from '../common/Badge';
import { Shield, Mail, Trash2, Edit3, CheckCircle, Clock } from 'lucide-react';

interface TeamMemberCardProps {
  member: EmployerTeamMember;
  onRemove: (id: string) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onRemove,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {member.name}
              </h4>
              <Badge variant={member.status === 'Active' ? 'success' : 'warning'} size="sm">
                {member.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">{member.email}</p>
          </div>
        </div>

        {member.role !== 'Owner' && (
          <button
            onClick={() => onRemove(member.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            title="Remove Team Member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <span className="font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <Shield className="w-3.5 h-3.5" />
          Role: {member.role}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">Joined {member.joinedDate}</span>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Assigned Permissions</span>
        <div className="flex flex-wrap gap-1.5">
          {member.permissions.map((p) => (
            <span
              key={p}
              className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
