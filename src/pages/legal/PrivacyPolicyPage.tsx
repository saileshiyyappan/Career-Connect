import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageContainer className="py-10 space-y-8 max-w-4xl">
      <SectionHeader
        title="Privacy Policy"
        subtitle="Last Updated: August 2026 • CareerConnect Data Protection & Transparency Standards"
        badge="Legal & Transparency"
      />

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-xs">
        
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h2>1. Information We Collect</h2>
          </div>
          <p>
            CareerConnect respects your privacy and is committed to protecting candidate and recruiter personal data. We collect information that you directly provide when registering an account, creating a profile, submitting a job application, or posting a job vacancy.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li><strong>Candidate Credentials:</strong> Full name, email address, contact information, work history, and uploaded resume files.</li>
            <li><strong>Employer & Corporate Data:</strong> Company name, official business email, company website, headquarters location, and hiring budget preferences.</li>
            <li><strong>Usage & Analytics:</strong> Device IP address, browser type, job bookmark activity, and platform navigation metrics.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <Lock className="w-5 h-5 text-emerald-500" />
            <h2>2. How We Use Your Data</h2>
          </div>
          <p>
            We utilize collected personal information exclusively to operate and deliver modern job matching and recruitment services:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <li>Connecting job candidates with verified hiring managers and recruitment teams.</li>
            <li>Delivering application progress status updates and job recommendation notifications.</li>
            <li>Detecting fraudulent job listings, spam applications, and unauthorized platform access.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <Eye className="w-5 h-5 text-purple-500" />
            <h2>3. Information Sharing & Third-Party Access</h2>
          </div>
          <p>
            We do <strong>NOT</strong> sell, rent, or trade candidate personal data to third-party marketing companies. Candidate resumes and contact details are disclosed only to employers associated with specific job applications submitted by the candidate.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-amber-500" />
            <h2>4. Your Rights & Data Retention</h2>
          </div>
          <p>
            You retain full ownership of your candidate profile. You may edit, update, or permanently delete your account, saved jobs, and submitted application history at any time through your Profile & Account Settings.
          </p>
        </section>

      </div>
    </PageContainer>
  );
};
