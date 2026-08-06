export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColor = 
  | 'blue' 
  | 'cyan' 
  | 'emerald' 
  | 'violet' 
  | 'amber' 
  | 'rose' 
  | 'indigo';

export interface AccentThemeConfig {
  id: AccentColor;
  name: string;
  primaryHex: string;
  hoverHex: string;
  ringClass: string;
  bgLightClass: string;
  badgeClass: string;
  textClass: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  accent: AccentColor;
  accentConfig: AccentThemeConfig;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}
