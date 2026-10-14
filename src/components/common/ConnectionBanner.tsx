import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFirestoreConnection, FirestoreConnectionState } from '../../context/FirestoreConnectionContext';

export const ConnectionBanner: React.FC = () => {
  const { status, checkConnection } = useFirestoreConnection();
  const [showRestored, setShowRestored] = useState(false);
  const prevStatusRef = useRef<FirestoreConnectionState>(status);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if ((prev === 'OFFLINE' || prev === 'RECOVERING' || prev === 'ERROR') && status === 'ONLINE') {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = status;
  }, [status]);

  if (status === 'UNCONFIGURED' || (status === 'ONLINE' && !showRestored) || status === 'INITIALIZING') {
    return null;
  }

  let bannerConfig = {
    bg: 'bg-amber-600/90 text-white border-amber-500/40',
    icon: <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />,
    message: "You're offline. Some data may be unavailable.",
    action: (
      <button
        onClick={() => checkConnection()}
        className="ml-3 px-2 py-0.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded transition-colors"
      >
        Retry
      </button>
    ),
  };

  if (status === 'RECOVERING') {
    bannerConfig = {
      bg: 'bg-blue-600/90 text-white border-blue-500/40',
      icon: <RefreshCw className="w-4 h-4 shrink-0 text-blue-200 animate-spin" />,
      message: 'Reconnecting to database services...',
      action: null,
    };
  } else if (showRestored || (prevStatusRef.current !== 'ONLINE' && status === 'ONLINE')) {
    bannerConfig = {
      bg: 'bg-emerald-600/90 text-white border-emerald-500/40',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />,
      message: 'Connection restored.',
      action: null,
    };
  } else if (status === 'ERROR') {
    bannerConfig = {
      bg: 'bg-rose-600/90 text-white border-rose-500/40',
      icon: <AlertCircle className="w-4 h-4 shrink-0 text-rose-200" />,
      message: 'Database connection issue. Live sync may be limited.',
      action: (
        <button
          onClick={() => checkConnection()}
          className="ml-3 px-2 py-0.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded transition-colors"
        >
          Retry
        </button>
      ),
    };
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`w-full border-b backdrop-blur-sm px-4 py-2 text-xs font-medium flex items-center justify-center z-30 relative ${bannerConfig.bg}`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 max-w-7xl">
          {bannerConfig.icon}
          <span>{bannerConfig.message}</span>
          {bannerConfig.action}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
