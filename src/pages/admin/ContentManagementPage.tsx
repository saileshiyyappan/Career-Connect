import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { InputField } from '../../components/inputs/InputField';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { CheckCircle2, Layout, HelpCircle, MessageSquare, BookOpen, Layers } from 'lucide-react';

export const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'testimonials' | 'faq' | 'blog'>('hero');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [heroTitle, setHeroTitle] = useState('Land Your Next Dream Career in Tech');
  const [heroSubtitle, setHeroSubtitle] = useState('Connect with verified global tech employers and top AI-driven startup opportunities.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Public Website Content Management (CMS)"
        subtitle="Manage landing page content, featured job categories, user testimonials, FAQs, and blog posts."
        badge="CMS Operations"
      />

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Content section updated successfully!
        </div>
      )}

      {/* Content Navigation Tabs */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'hero', label: 'Home Hero Section' },
          { id: 'categories', label: 'Featured Categories' },
          { id: 'testimonials', label: 'Candidate Testimonials' },
          { id: 'faq', label: 'Platform FAQs' },
          { id: 'blog', label: 'Career Tips & Blog (Placeholder)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section Content Form */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Layout className="w-4 h-4 text-purple-500" />
            Landing Page Hero Banner & Copy
          </h3>

          <InputField label="Hero Title Headline" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          <TextareaInput label="Hero Subtitle & Description" rows={3} value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />

          <div className="flex justify-end">
            <PrimaryButton type="submit" icon={CheckCircle2}>
              Save Hero Banner Changes
            </PrimaryButton>
          </div>
        </form>
      )}

      {/* Categories Content */}
      {activeTab === 'categories' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Homepage Featured Industry Categories
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {['Software Engineering & AI', 'UI/UX Design & Product', 'Data Science & Machine Learning', 'DevOps & Cloud Infrastructure'].map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">{cat}</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">Enabled</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Content */}
      {activeTab === 'faq' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Public Frequently Asked Questions (FAQ)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <p className="font-extrabold text-slate-900 dark:text-white">Q: Is CareerConnect free for job seekers?</p>
              <p className="text-slate-600 dark:text-slate-300">A: Yes! Creating a candidate profile and applying to verified jobs is 100% free.</p>
            </div>
          </div>
        </div>
      )}

      {/* Blog & Career Tips Placeholder */}
      {activeTab === 'blog' && (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-purple-500 mx-auto" />
          <h3 className="text-base font-black text-slate-900 dark:text-white">Blog & Career Advice CMS Module</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            This module provides content editing, publishing, and SEO metadata tools for CareerConnect articles.
          </p>
        </div>
      )}
    </PageContainer>
  );
};
