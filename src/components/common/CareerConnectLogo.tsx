import React from 'react';
import { cn } from '../../utils/cn';

export interface CareerConnectLogoProps {
  variant?: 'mark' | 'horizontal' | 'vertical' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  inverted?: boolean;
  asLink?: boolean;
}

export const CareerConnectLogo: React.FC<CareerConnectLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  className = '',
  inverted = false,
}) => {
  // Dimensions map
  const markSizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  const textTitleSizeMap = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const taglineSizeMap = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  const MarkSVG = (
    <svg
      viewBox="0 0 512 512"
      className={cn(markSizeMap[size], 'shrink-0 transition-transform duration-200 group-hover:scale-105')}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="markGlobe" cx="30%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </radialGradient>
        <linearGradient id="markCap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="markGold" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="markBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="markMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="40%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <linearGradient id="markArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>

      {/* Background Globe Network */}
      <circle cx="120" cy="260" r="70" fill="url(#markGlobe)" opacity="0.8" />
      <ellipse cx="120" cy="260" rx="70" ry="25" fill="none" stroke="#BAE6FD" strokeWidth="3" opacity="0.6" />

      {/* Upward Growth Arrow */}
      <path
        d="M 330 420 C 400 400, 470 330, 480 200 L 510 215 L 500 130 L 420 150 L 450 165 C 440 270, 380 340, 310 370 Z"
        fill="url(#markArrow)"
      />

      {/* Left Blue Monogram C */}
      <path
        d="M 230 190 C 170 190, 120 235, 120 300 C 120 365, 170 410, 230 410 C 260 410, 285 395, 300 375 L 265 345 C 255 355, 245 365, 230 365 C 195 365, 168 335, 168 300 C 168 265, 195 235, 230 235 C 245 235, 260 242, 270 252 L 302 222 C 285 202, 260 190, 230 190 Z"
        fill="url(#markBlue)"
      />
      {/* Candidate silhouette inside Blue C */}
      <circle cx="205" cy="285" r="14" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M 185 330 C 185 305, 225 305, 225 330 Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />

      {/* Right Magenta Monogram C */}
      <path
        d="M 340 190 C 280 190, 230 235, 230 300 C 230 365, 280 410, 340 410 C 370 410, 395 395, 410 375 L 375 345 C 365 355, 355 365, 340 365 C 305 365, 278 335, 278 300 C 278 265, 305 235, 340 235 C 355 235, 370 242, 380 252 L 412 222 C 395 202, 370 190, 340 190 Z"
        fill="url(#markMagenta)"
      />
      {/* City Skyline inside Magenta C */}
      <rect x="330" y="275" width="8" height="28" rx="1.5" fill="#0284C7" />
      <rect x="342" y="260" width="9" height="43" rx="1.5" fill="#0369A1" />
      <rect x="355" y="250" width="10" height="53" rx="1.5" fill="#38BDF8" />

      {/* Graduation Mortarboard Cap */}
      <ellipse cx="256" cy="125" rx="110" ry="28" fill="#0F172A" />
      <ellipse cx="256" cy="125" rx="110" ry="12" fill="none" stroke="url(#markGold)" strokeWidth="6" />
      <polygon points="256,25 395,85 256,145 115,85" fill="url(#markCap)" stroke="#334155" strokeWidth="3" />
      <ellipse cx="256" cy="85" rx="9" ry="6" fill="url(#markGold)" />
      {/* Golden Tassel */}
      <path
        d="M 256 85 C 220 90, 180 120, 170 170"
        fill="none"
        stroke="url(#markGold)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <rect x="162" y="170" width="16" height="32" rx="4" fill="url(#markGold)" />
    </svg>
  );

  if (variant === 'mark') {
    return <div className={cn('inline-flex items-center justify-center', className)}>{MarkSVG}</div>;
  }

  if (variant === 'full' || variant === 'vertical') {
    return (
      <div className={cn('flex flex-col items-center text-center gap-3', className)}>
        {MarkSVG}
        <div className="flex flex-col items-center">
          <span
            className={cn(
              'font-black tracking-tight leading-none',
              textTitleSizeMap[size],
              inverted ? 'text-white' : 'text-slate-900 dark:text-white'
            )}
          >
            Career<span className="text-rose-600 dark:text-rose-500">Connect</span>
          </span>
          {(showTagline || variant === 'full') && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className="w-6 h-0.5 rounded-full bg-blue-500" />
              <span
                className={cn(
                  'font-bold tracking-wide uppercase',
                  taglineSizeMap[size],
                  inverted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                )}
              >
                Your Skills. Our Network. Your Success.
              </span>
              <span className="w-6 h-0.5 rounded-full bg-rose-500" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div className={cn('inline-flex items-center gap-3 group', className)}>
      {MarkSVG}
      <div className="flex flex-col">
        <span
          className={cn(
            'font-black tracking-tight leading-tight',
            textTitleSizeMap[size],
            inverted ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          Career<span className="text-rose-600 dark:text-rose-500">Connect</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'font-semibold tracking-tight text-slate-500 dark:text-slate-400 -mt-0.5',
              taglineSizeMap[size]
            )}
          >
            Your Skills. Our Network. Your Success.
          </span>
        )}
      </div>
    </div>
  );
};
