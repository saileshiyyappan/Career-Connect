import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { ResumeCard } from '../../components/cards/ResumeCard';
import { EmptyState } from '../../components/common/EmptyState';
import { candidatePortalService, CandidateResume } from '../../services/candidatePortalService';
<<<<<<< HEAD
import { FileText, UploadCloud, CheckCircle2, Star, Sparkles, FileCheck } from 'lucide-react';
=======
import { FileText, UploadCloud, CheckCircle2, Star, Sparkles, FileCheck, RefreshCw } from 'lucide-react';
>>>>>>> origin/main

export const ResumePage: React.FC = () => {
  const [resumes, setResumes] = useState<CandidateResume[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [uploadMessage, setUploadMessage] = useState('');
=======
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
>>>>>>> origin/main

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    const data = await candidatePortalService.getResumes();
    setResumes(data);
    setLoading(false);
  };

<<<<<<< HEAD
  const handleUploadUnavailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadMessage('Resume uploads are not available until Firebase Storage is configured. No file was uploaded.');
    e.target.value = '';
=======
  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    setTimeout(async () => {
      const newRes = await candidatePortalService.uploadResume(
        file.name,
        `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      );
      setIsUploading(false);
      setUploadSuccessMsg(`Successfully uploaded and parsed "${file.name}"!`);
      loadResumes();
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    }, 1200);
>>>>>>> origin/main
  };

  const handleSetPrimary = async (id: string) => {
    await candidatePortalService.setPrimaryResume(id);
    setResumes(prev => prev.map(r => ({ ...r, isPrimary: r.id === id })));
  };

  const handleDelete = async (id: string) => {
    await candidatePortalService.deleteResume(id);
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const handleReplace = (id: string) => {
    const input = document.getElementById('resume-file-input');
    if (input) input.click();
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Resume & Document Management"
          subtitle="Manage primary and role-specific resumes for automated ATS parsing and instant recruiter applications."
          badge="Candidate Workspace"
        />
      </div>

      {/* Upload Drag & Drop Box */}
      <div className="p-8 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-3 transition-colors hover:border-blue-500">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center mx-auto">
<<<<<<< HEAD
            <UploadCloud className="w-7 h-7" />
=======
          {isUploading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
>>>>>>> origin/main
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
<<<<<<< HEAD
            Upload New Resume Version
=======
            {isUploading ? 'Parsing Resume & Extracting Skills...' : 'Upload New Resume Version'}
>>>>>>> origin/main
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            Drag and drop your PDF or DOCX file here, or click to browse. Supported formats: .pdf, .docx (Max 10MB).
          </p>
        </div>

        <div className="pt-2">
          <input
            id="resume-file-input"
            type="file"
            accept=".pdf,.docx,.doc"
<<<<<<< HEAD
            onChange={handleUploadUnavailable}
=======
            onChange={handleSimulatedUpload}
>>>>>>> origin/main
            className="hidden"
          />
          <label
            htmlFor="resume-file-input"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
          >
            <FileCheck className="w-4 h-4" />
            <span>Select Resume File</span>
          </label>
        </div>

<<<<<<< HEAD
        {uploadMessage && (
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5 pt-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {uploadMessage}
=======
        {uploadSuccessMsg && (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 pt-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            {uploadSuccessMsg}
>>>>>>> origin/main
          </p>
        )}
      </div>

      {/* Resumes Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Active Resumes ({resumes.length})
        </h3>

        {resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No resumes uploaded"
            description="Upload a PDF resume to enable quick-apply across all job postings."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSetPrimary={handleSetPrimary}
                onDelete={handleDelete}
                onReplace={handleReplace}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload History Table */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Upload & Indexing Audit Log
        </h4>

        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">ATS Parsing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {resumes.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    {r.fileName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{r.uploadDate}</td>
                  <td className="py-3 px-4 text-slate-500">{r.fileSize}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Indexed ({r.parsedSkills.length} skills extracted)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </PageContainer>
  );
};
