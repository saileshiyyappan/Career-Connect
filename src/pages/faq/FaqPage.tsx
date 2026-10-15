import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { Search, ChevronDown, ChevronUp, HelpCircle, Briefcase, Building2, User, ShieldCheck } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Job Seekers' | 'Employers' | 'Applications' | 'Privacy & Security';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Job Seekers',
    question: 'How do I apply for jobs on CareerConnect?',
    answer: 'Simply browse our job directory, select any role that fits your qualifications, click "Apply Now", and attach your resume or write a cover letter. You can track all submitted applications in real-time from your Candidate Workspace.',
  },
  {
    category: 'Job Seekers',
    question: 'Is creating a candidate profile free?',
    answer: 'Yes! Creating a candidate account, building your professional profile, bookmarking roles, and submitting job applications is 100% free for job seekers.',
  },
  {
    category: 'Job Seekers',
    question: 'Can I set up job alerts for specific technologies or locations?',
    answer: 'Yes. You can filter roles by your desired skills (e.g., React, Python, Remote) and save your search filters to receive notification updates when matching positions are published.',
  },
  {
    category: 'Employers',
    question: 'How do I post a open job listing?',
    answer: 'Sign in to your Employer Control Center and click "Post New Job Listing". Enter the position details, compensation range, required skills, and location requirements to publish it instantly to our candidate community.',
  },
  {
    category: 'Employers',
    question: 'How do recruiters review incoming candidate applications?',
    answer: 'All incoming job applications appear in your recruiter dashboard. You can view candidate profiles, read cover letters, inspect resumes, and update application status (e.g., Under Review, Interviewing, Offered) with a single click.',
  },
  {
    category: 'Applications',
    question: 'What happens after I submit an application?',
    answer: 'Your application is delivered directly to the employer\'s recruitment pipeline. The hiring team will review your credentials and update your application status. You will receive notifications inside CareerConnect as your application progresses.',
  },
  {
    category: 'Privacy & Security',
    question: 'Is my personal data and resume secure on CareerConnect?',
    answer: 'We prioritize candidate data privacy. Your contact information and resume file are only shared with verified employers for roles you explicitly apply to. We never sell candidate data to third-party data brokers.',
  },
  {
    category: 'Privacy & Security',
    question: 'How are hiring organizations verified on the platform?',
    answer: 'Every corporate account undergoes automated domain verification and manual recruiter background checks before job listings are published to ensure candidate safety.',
  },
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Job Seekers', 'Employers', 'Applications', 'Privacy & Security'];

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <PageContainer className="py-10 space-y-10 max-w-4xl">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about job searching, candidate profiles, recruiter tools, and application privacy."
        badge="Help Center"
      />

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search questions (e.g., apply, resume, post job, privacy)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search term or exploring a different category.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="info" size="sm">{faq.category}</Badge>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">Have a specific question not listed here?</h3>
          <p className="text-xs text-slate-400 mt-1">Our candidate and employer support team is available 24/7 to assist you.</p>
        </div>
        <RouterLink to="/contact">
          <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer shrink-0">
            Contact Support Team
          </button>
        </RouterLink>
      </div>

    </PageContainer>
  );
};
