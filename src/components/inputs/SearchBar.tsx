import React, { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { cn } from '../../utils/cn';

export interface SearchBarProps {
  initialTitle?: string;
  initialLocation?: string;
  onSearch?: (title: string, location: string) => void;
  placeholderTitle?: string;
  placeholderLocation?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialTitle = '',
  initialLocation = '',
  onSearch,
  placeholderTitle = 'Job title, keywords, or company...',
  placeholderLocation = 'City, state, or Remote',
  className,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(title.trim(), location.trim());
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className={cn(
        'flex flex-col md:flex-row items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-slate-950/50 w-full',
        className
      )}
    >
      <div className="relative flex-1 flex items-center w-full px-3 py-1">
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mr-3" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholderTitle}
          className="w-full text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />
        {title && (
          <button
            type="button"
            onClick={() => setTitle('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-800" />

      <div className="relative flex-1 flex items-center w-full px-3 py-1 border-t md:border-t-0 border-slate-100 dark:border-slate-800 md:pt-0 pt-2">
        <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mr-3" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={placeholderLocation}
          className="w-full text-sm font-medium bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
        />
        {location && (
          <button
            type="button"
            onClick={() => setLocation('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <PrimaryButton type="submit" size="md" className="w-full md:w-auto px-6 flex-shrink-0">
        Search Jobs
      </PrimaryButton>
    </form>
  );
};
