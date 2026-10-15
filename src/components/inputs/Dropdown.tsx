import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative flex flex-col gap-1.5 w-full', className)} ref={dropdownRef}>
      {label && (
        <label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
      >
        <span className={selectedOption ? 'font-medium' : 'text-slate-400 dark:text-slate-500'}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <selectedOption.icon className="w-4 h-4 text-slate-500" />}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isOpen ? 'rotate-180' : '')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors',
                option.value === value ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-200'
              )}
            >
              <span className="flex items-center gap-2">
                {option.icon && <option.icon className="w-4 h-4 text-slate-400" />}
                {option.label}
              </span>
              {option.value === value && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
