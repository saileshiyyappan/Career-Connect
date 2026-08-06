import React from 'react';
import { LucideIcon } from 'lucide-react';
import { UserRole } from './user';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: LucideIcon;
  badge?: string | number;
  badgeColor?: string;
  roles?: UserRole[];
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}
