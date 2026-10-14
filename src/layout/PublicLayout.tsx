import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();
  const isSignedOutLanding = pathname === '/' && (isLoading || !user);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {!isSignedOutLanding && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
