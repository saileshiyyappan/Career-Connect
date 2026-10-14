import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Newspaper, 
  Search, 
  X, 
  Filter, 
  RefreshCw, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  SlidersHorizontal,
  Globe2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { NewsCard } from '../../components/cards/NewsCard';
import { NewsCardSkeleton, NewsHeroSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { OutlineButton } from '../../components/common/OutlineButton';
import { NewsPreviewModal } from '../../components/modals/NewsPreviewModal';
import { Badge } from '../../components/common/Badge';
import { careerNewsService, PaginatedNewsResponse } from '../../services/careerNewsService';
import { CareerNewsItem } from '../../types/news';
import { NEWS_CATEGORIES, NewsCategoryConfig, getCategoryConfig } from '../../constants/newsCategories';
import { useTheme } from '../../context/ThemeContext';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

const PAGE_SIZE = 12;

export const NewsPage: React.FC = () => {
  const { accentConfig } = useTheme();

  // State
  const [articles, setArticles] = useState<CareerNewsItem[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<CareerNewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'fetchedAt'>('publishedAt');

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination cursor
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // Preview Modal
  const [previewArticle, setPreviewArticle] = useState<CareerNewsItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load initial news or category filter changes
  const loadNews = useCallback(async (category: string, search: string, source: string) => {
    setLoading(true);
    setError(null);

    try {
      if (search.trim()) {
        // Keyword Search
        const searchResults = await careerNewsService.searchNews(
          search,
          category !== 'all' ? category : undefined,
          40
        );
        
        const filteredBySource = source !== 'all'
          ? searchResults.filter(a => a.sourceName?.toLowerCase().includes(source.toLowerCase()) || a.sourceId === source)
          : searchResults;

        if (filteredBySource.length > 0) {
          setFeaturedArticle(filteredBySource[0]);
          setArticles(filteredBySource.slice(1));
        } else {
          setFeaturedArticle(null);
          setArticles([]);
        }
        setLastDoc(null);
        setHasMore(false);
      } else {
        // Paginated standard query
        const res: PaginatedNewsResponse = await careerNewsService.getPaginatedNews({
          category: category !== 'all' ? category : undefined,
          sourceId: source !== 'all' ? source : undefined,
          limitCount: PAGE_SIZE,
          lastDoc: null,
          sortBy,
          sortOrder: 'desc',
        });

        if (res.items.length > 0) {
          setFeaturedArticle(res.items[0]);
          setArticles(res.items.slice(1));
        } else {
          setFeaturedArticle(null);
          setArticles([]);
        }

        setLastDoc(res.lastDoc);
        setHasMore(res.hasMore);
      }
    } catch (err: any) {
      console.warn('Notice loading career news:', err);
      setError('Career news is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  // Trigger load on filter changes
  useEffect(() => {
    loadNews(selectedCategory, debouncedSearch, selectedSource);
  }, [loadNews, selectedCategory, debouncedSearch, selectedSource]);

  // Load More pagination
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const res = await careerNewsService.getPaginatedNews({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sourceId: selectedSource !== 'all' ? selectedSource : undefined,
        limitCount: PAGE_SIZE,
        lastDoc,
        sortBy,
        sortOrder: 'desc',
      });

      setArticles((prev) => [...prev, ...res.items]);
      setLastDoc(res.lastDoc);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Preview article handler
  const handlePreview = (article: CareerNewsItem) => {
    setPreviewArticle(article);
    setIsPreviewOpen(true);
  };

  // Unique list of sources from articles
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    if (featuredArticle?.sourceName) set.add(featuredArticle.sourceName);
    articles.forEach(a => {
      if (a.sourceName) set.add(a.sourceName);
    });
    return Array.from(set);
  }, [featuredArticle, articles]);

  const activeCategoryConfig = getCategoryConfig(selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <PageContainer className="py-8 space-y-8 max-w-7xl">
        
        {/* Page Hero Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Globe2 className="w-3.5 h-3.5" />
                Verified Career Intelligence
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Career <span style={{ color: accentConfig.primaryHex }}>News</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-1.5 leading-relaxed">
                Latest insights on jobs, hiring, placements, technology careers, and the employment market from top verified publishers.
              </p>
            </div>

            {/* Quick Refresh Action */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadNews(selectedCategory, debouncedSearch, selectedSource)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh News</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs Bar with Horizontal Scroll */}
          <div className="pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
              {NEWS_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'text-white shadow-sm scale-102'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    style={isSelected ? { backgroundColor: cat.color || accentConfig.primaryHex } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Secondary Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search headlines, company news, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Source Filter (if available) */}
            {availableSources.length > 1 && (
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full sm:w-48 appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs cursor-pointer"
                >
                  <option value="all">All Publishers</option>
                  {availableSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            )}

            {/* Active Category Description Tag */}
            {selectedCategory !== 'all' && (
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                <span>Filtering:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{activeCategoryConfig.label}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="p-0.5 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                  title="Clear Category"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          /* Loading Skeletons */
          <div className="space-y-8">
            <NewsHeroSkeleton />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <ErrorState
            title="Career news is temporarily unavailable"
            message={error}
            onRetry={() => loadNews(selectedCategory, debouncedSearch, selectedSource)}
          />
        ) : !featuredArticle && articles.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon={Newspaper}
            title={
              debouncedSearch
                ? `No articles matching "${debouncedSearch}"`
                : 'No career news available right now.'
            }
            description={
              debouncedSearch
                ? 'Try searching with different keywords, exploring other career categories, or clearing your query.'
                : 'Check back soon for the latest employment updates and job market reports.'
            }
            action={
              (debouncedSearch || selectedCategory !== 'all' || selectedSource !== 'all') ? (
                <OutlineButton
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSource('all');
                    setSearchQuery('');
                  }}
                >
                  Reset All Filters
                </OutlineButton>
              ) : undefined
            }
          />
        ) : (
          /* Real Articles Display */
          <div className="space-y-10">
            
            {/* Top / Featured Headline Story */}
            {featuredArticle && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Top Story & Trending Analysis
                  </h2>
                  <span className="text-xs text-slate-400">
                    Publisher: <strong className="text-slate-700 dark:text-slate-300">{featuredArticle.sourceName}</strong>
                  </span>
                </div>

                <NewsCard
                  article={featuredArticle}
                  layoutVariant="featured"
                  onPreview={handlePreview}
                />
              </section>
            )}

            {/* Grid of Latest Career News */}
            {articles.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Latest Career News
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Showing {articles.length + (featuredArticle ? 1 : 0)} real articles from verified media feeds
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>

                {/* Pagination / Load More Button */}
                {hasMore && (
                  <div className="pt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-98 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Loading More Articles...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Career News</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </section>
            )}

          </div>
        )}

      </PageContainer>

      {/* Article Detail / Preview Modal */}
      <NewsPreviewModal
        article={previewArticle}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewArticle(null);
        }}
      />
    </div>
  );
};
