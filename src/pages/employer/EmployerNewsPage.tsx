import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NewsCard } from '../../components/cards/NewsCard';
import { NewsPreviewModal } from '../../components/modals/NewsPreviewModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { careerNewsService } from '../../services/careerNewsService';
import { CareerNewsItem } from '../../types/news';
import {
  Newspaper,
  TrendingUp,
  Search,
  Briefcase,
  Users,
  Building2,
  Sparkles,
  BarChart2
} from 'lucide-react';

const EMPLOYER_NEWS_PILLS = [
  { id: 'all', label: 'All Hiring Intelligence' },
  { id: 'hiring-trends', label: 'Hiring Trends' },
  { id: 'recruitment', label: 'Recruitment & ATS' },
  { id: 'talent-market', label: 'Labor & Talent Market' },
  { id: 'skills-demand', label: 'Skills & Tech Stack Demand' },
  { id: 'workforce', label: 'Workforce Strategy & Remote' },
];

export const EmployerNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<CareerNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPill, setSelectedPill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewArticle, setPreviewArticle] = useState<CareerNewsItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    careerNewsService
      .getLatestNews(30)
      .then((items) => {
        setArticles(items);
      })
      .catch((err) => {
        console.warn('Failed to load employer news:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredArticles = articles.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)));
      if (!match) return false;
    }
    if (selectedPill !== 'all') {
      const pillLower = selectedPill.toLowerCase();
      const catMatch = item.category.toLowerCase().includes(pillLower);
      const tagMatch = item.tags && item.tags.some((t) => t.toLowerCase().includes(pillLower));
      const contentMatch =
        item.title.toLowerCase().includes(pillLower.replace('-', ' ')) ||
        item.summary.toLowerCase().includes(pillLower.replace('-', ' '));
      return catMatch || tagMatch || contentMatch;
    }
    return true;
  });

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header */}
      <SectionHeader
        title="Recruitment & Talent Market Intelligence"
        subtitle="Stay updated with macroeconomic hiring trends, tech salary benchmarks, recruitment best practices, and labor dynamics."
        badge="Workforce Intelligence"
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {EMPLOYER_NEWS_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedPill(pill.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedPill === pill.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hiring news or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading talent market reports...</p>
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onPreview={(item) => {
                setPreviewArticle(item);
                setIsPreviewOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Newspaper}
          title="No Articles Found"
          description="Try selecting a different recruitment category or clearing your search filter."
          action={
            <button
              onClick={() => {
                setSelectedPill('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          }
        />
      )}

      {/* Preview Modal */}
      <NewsPreviewModal
        article={previewArticle}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewArticle(null);
        }}
      />
    </PageContainer>
  );
};
