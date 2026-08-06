import React, { useState } from 'react';
import { CandidateResume } from '../../services/candidatePortalService';
import { FileText, Download, Trash2, CheckCircle2, Star, Eye, RefreshCw, X } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface ResumeCardProps {
  resume: CandidateResume;
  onSetPrimary: (id: string) => void;
  onDelete: (id: string) => void;
  onReplace: (id: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onSetPrimary,
  onDelete,
  onReplace,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    const textContent = `RESUME DOCUMENT PREVIEW
File Name: ${resume.fileName}
Size: ${resume.fileSize}
Uploaded Date: ${resume.uploadDate}

EXTRACTED SKILLS & INDEXING:
${resume.parsedSkills.map(s => `• ${s}`).join('\n')}

SUMMARY STATEMENT:
Accomplished Senior Software Engineer with expertise in building scalable web applications, real-time architectures, and high-performance UI systems.
`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
        resume.isPrimary
          ? 'border-blue-500/60 dark:border-blue-500/50 shadow-md ring-1 ring-blue-500/20'
          : 'border-slate-200/80 dark:border-slate-800 shadow-xs'
      }`}>
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-sm shrink-0">
              PDF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {resume.fileName}
                </h4>
                {resume.isPrimary && (
                  <Badge variant="info" size="sm">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Primary Resume
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Uploaded {resume.uploadDate} • {resume.fileSize}
              </p>
            </div>
          </div>
        </div>

        {/* Parsed Skills Chips */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indexed Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {resume.parsedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              Download
            </button>
          </div>

          <div className="flex items-center gap-1">
            {!resume.isPrimary && (
              <button
                onClick={() => onSetPrimary(resume.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Set as Default Primary Resume"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onReplace(resume.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Replace Resume File"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(resume.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {resume.fileName} (Parsed Preview)
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
              <p className="font-bold text-blue-600 dark:text-blue-400">=== CANDIDATE RESUME METADATA ===</p>
              <p>Uploaded: {resume.uploadDate} | File Size: {resume.fileSize}</p>
              <p>Primary Resume: {resume.isPrimary ? 'YES' : 'NO'}</p>
              <p className="pt-2 font-bold text-slate-900 dark:text-white">=== INDEXED SKILLS ===</p>
              <p>{resume.parsedSkills.join(', ')}</p>
              <p className="pt-2 font-bold text-slate-900 dark:text-white">=== WORK EXPERIENCE OVERVIEW ===</p>
              <p>• Senior Frontend Engineer @ TechCorp (2023 - Present)</p>
              <p>• Full Stack Developer @ CloudScale Systems (2021 - 2023)</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
