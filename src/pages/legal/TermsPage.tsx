import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { FileText, CheckCircle2, ShieldAlert, Scale } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <PageContainer className="py-10 space-y-8 max-w-4xl">
      <SectionHeader
        title="Terms & Conditions"
        subtitle="Last Updated: August 2026 • Platform Terms of Service & User Guidelines"
        badge="Terms of Service"
      />

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed shadow-xs">
        
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <Scale className="w-5 h-5 text-blue-500" />
            <h2>1. Acceptance of Terms</h2>
          </div>
          <p>
            By accessing or using CareerConnect, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the platform or use our recruitment features.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2>2. Candidate Responsibilities</h2>
          </div>
          <p>
            Job seekers agree to provide accurate, truthful, and up-to-date information regarding work experience, education, skills, and eligibility. Misrepresentation of qualifications may lead to account suspension.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2>3. Employer Guidelines & Job Posting Standards</h2>
          </div>
          <p>
            Employers and recruiters posting vacancies must comply with equal opportunity hiring practices. Posted jobs must contain clear salary estimates, truthful job duties, and genuine employment opportunities. Fraudulent, predatory, or deceptive listings are strictly prohibited.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-lg">
            <FileText className="w-5 h-5 text-purple-500" />
            <h2>4. Intellectual Property & Service Limits</h2>
          </div>
          <p>
            All branding, user interface designs, logos, and code structures on CareerConnect are protected intellectual property. CareerConnect reserves the right to modify or discontinue any part of the service with or without prior notice.
          </p>
        </section>

      </div>
    </PageContainer>
  );
};
