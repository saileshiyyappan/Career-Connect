import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Circle,
  Code2,
  Cog,
  Cpu,
  Database,
  Gauge,
  Globe2,
  Layers3,
  Network,
  Rocket,
  ShieldCheck,
  Terminal,
  Users,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';

export interface StartupLoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
  isAppReady?: boolean;
}

const bootStages = [
  { label: 'System initializing', icon: Cpu },
  { label: 'Connecting career network', icon: Network },
  { label: 'Loading engineering projects', icon: Layers3 },
  { label: 'Synchronizing job opportunities', icon: BriefcaseBusiness },
  { label: 'Initializing AI services', icon: BrainCircuit },
  { label: 'Connecting companies & candidates', icon: Users },
];

const terminalLines = [
  'cc-core  :: secure boot sequence started',
  'network  :: talent graph handshake accepted',
  'jobs     :: indexing active opportunities',
  'ai       :: matching engine standing by',
  'system   :: workspace telemetry online',
];

const chartPoints = '0,74 18,68 35,72 52,52 68,57 84,39 101,45 118,21 138,29 155,8';

export const StartupLoadingScreen: React.FC<StartupLoadingScreenProps> = ({
  onComplete,
  minDurationMs = 2200,
  isAppReady = true,
}) => {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [progress, setProgress] = useState(12);
  const [isExiting, setIsExiting] = useState(false);
  const [terminalIndex, setTerminalIndex] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, Math.round(12 + (elapsed / minDurationMs) * 88)));
      if (elapsed >= minDurationMs) {
        window.clearInterval(interval);
        setMinTimeElapsed(true);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, [minDurationMs]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTerminalIndex((index) => (index + 1) % terminalLines.length);
    }, 900);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!minTimeElapsed || !isAppReady) return;
    setIsExiting(true);
    const timer = window.setTimeout(() => onComplete?.(), 520);
    return () => window.clearTimeout(timer);
  }, [isAppReady, minTimeElapsed, onComplete]);

  const activeStage = useMemo(() => {
    if (progress >= 92) return 5;
    if (progress >= 76) return 4;
    if (progress >= 58) return 3;
    if (progress >= 40) return 2;
    if (progress >= 24) return 1;
    return 0;
  }, [progress]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="careerconnect-command-center-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-50 overflow-hidden bg-[#05070b] text-white selection:bg-rose-500/30"
          role="status"
          aria-live="polite"
          aria-label="Loading CareerConnect engineering command center"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(236,72,153,0.13),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(14,165,233,0.12),transparent_28%),linear-gradient(125deg,#030507_0%,#0b111a_52%,#05070b_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(56,189,248,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.12)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)]" />
          <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-rose-600/10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[110px]" />

          <div className="relative mx-auto flex h-full w-full max-w-[1800px] flex-col px-4 py-4 sm:px-7 sm:py-6 lg:px-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e]" /><span>CareerConnect // command center</span></div>
              <div className="hidden items-center gap-4 sm:flex"><span className="text-cyan-400/80">secure channel</span><span className="flex items-center gap-1.5"><Wifi className="h-3 w-3" /> live link</span><span>14:32:08 UTC</span></div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 items-center gap-5 py-5 lg:grid-cols-[minmax(190px,0.8fr)_minmax(390px,1.25fr)_minmax(250px,1fr)] lg:gap-8 lg:py-8">
              <section className="relative hidden h-full min-h-[360px] overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#080d14]/70 p-4 shadow-2xl lg:block">
                <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/70"><span>Engineering bay / 01</span><Wrench className="h-4 w-4 text-rose-400" /></div>
                <div className="relative flex h-[52%] items-center justify-center rounded-xl border border-cyan-300/15 bg-[#05090f] shadow-inner">
                  <div className="absolute inset-3 rounded-lg border border-dashed border-cyan-400/15" /><div className="absolute left-5 top-5 font-mono text-[8px] leading-4 text-cyan-300/50">CAD / AXIS-04<br />TOLERANCE ±0.02</div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} className="relative rounded-full border-[12px] border-slate-700 p-5 shadow-[0_0_25px_rgba(236,72,153,0.18)]"><Cog className="h-16 w-16 text-slate-300/80" strokeWidth={1.2} /><div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_14px_#fb7185]" /></motion.div>
                  <div className="absolute bottom-4 left-5 right-5 h-px bg-cyan-400/30" /><span className="absolute bottom-2 right-5 font-mono text-[8px] text-cyan-300/60">SCHEMATIC ACTIVE</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">{[Wrench, Cog, Cpu].map((Icon, index) => <div key={index} className="flex h-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"><Icon className={index === 1 ? 'h-7 w-7 text-rose-400' : 'h-6 w-6 text-slate-400'} strokeWidth={1.4} /></div>)}</div>
                <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 font-mono text-[9px] text-slate-500"><Activity className="h-3 w-3 text-rose-400" /> torque sensors nominal <span className="ml-auto text-emerald-400">ACTIVE</span></div>
              </section>

              <section className="relative z-10 flex min-w-0 flex-col items-center justify-center">
                <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="mb-5 flex flex-col items-center text-center">
                  <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/40 bg-rose-500/10 shadow-[0_0_38px_rgba(244,63,94,0.25)]"><Network className="h-9 w-9 text-rose-400" strokeWidth={1.4} /><span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-ping rounded-full bg-cyan-300" /></div>
                  <h1 className="text-4xl font-black tracking-[-0.06em] text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.12)] sm:text-6xl">Career<span className="text-rose-500">Connect</span></h1>
                  <p className="mt-2 text-xs font-medium tracking-[0.12em] text-slate-400 sm:text-sm">Your Skills. Our Network. Your Success.</p>
                </motion.div>

                <div className="w-full max-w-[520px] rounded-2xl border border-white/15 bg-[#080c14]/85 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5">
                  <div className="mb-2 flex items-end justify-between font-mono"><div><p className="text-[10px] uppercase tracking-[0.22em] text-rose-400">Live boot sequence</p><p className="mt-1 text-xs text-slate-500">Preparing your intelligent workspace</p></div><span className="text-2xl font-bold text-white tabular-nums">{progress}<span className="text-sm text-rose-400">%</span></span></div>
                  <div className="h-2 overflow-hidden rounded-full border border-rose-300/20 bg-slate-950"><motion.div className="h-full rounded-full bg-gradient-to-r from-rose-700 via-rose-400 to-cyan-300 shadow-[0_0_20px_rgba(244,63,94,0.8)]" animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.08 }} /></div>
                  <div className="mt-5 space-y-2.5">{bootStages.map((stage, index) => { const Icon = stage.icon; const complete = index < activeStage || (index === activeStage && progress >= 98); const active = index === activeStage && !complete; return <div key={stage.label} className={`flex items-center gap-3 text-xs ${active ? 'text-white' : complete ? 'text-slate-300' : 'text-slate-600'}`}><span className="flex h-5 w-5 items-center justify-center">{complete ? <CheckCircle2 className="h-4 w-4 text-rose-400" /> : active ? <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.2, repeat: Infinity }} className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_14px_#fb7185]" /> : <Circle className="h-3.5 w-3.5 text-slate-700" />}</span><Icon className={`h-3.5 w-3.5 ${active ? 'text-cyan-300' : complete ? 'text-slate-400' : 'text-slate-700'}`} /><span>{stage.label}</span>{active && <span className="ml-auto font-mono text-[9px] uppercase tracking-widest text-rose-400">processing</span>}</div>; })}</div>
                </div>
                <div className="mt-4 flex w-full max-w-[520px] items-center gap-2 rounded-lg border border-cyan-400/15 bg-black/30 px-3 py-2 font-mono text-[9px] text-cyan-200/70"><Terminal className="h-3.5 w-3.5 shrink-0 text-cyan-300" /><span className="truncate">{terminalLines[terminalIndex]}</span><span className="ml-auto h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" /></div>
              </section>

              <section className="relative hidden h-full min-h-[360px] min-w-0 space-y-3 lg:block">
                <div className="rounded-xl border border-rose-400/20 bg-[#090d15]/85 p-3 shadow-xl"><div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest"><span className="text-rose-300">Market overview</span><span className="text-emerald-400">+12.48% <ArrowUpRight className="inline h-3 w-3" /></span></div><svg viewBox="0 0 160 86" className="h-28 w-full overflow-visible"><path d="M0 72H160M0 45H160M0 18H160" stroke="rgba(148,163,184,.12)" /><polyline points={chartPoints} fill="none" stroke="#fb3f82" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /><polyline points="0,80 40,78 80,82 120,73 160,76" fill="none" stroke="#22d3ee" strokeWidth="1" opacity=".5" /></svg><div className="grid grid-cols-3 gap-2 text-[9px] text-slate-500"><span>JOBS <b className="block text-sm text-white">2,834</b></span><span>COMPANIES <b className="block text-sm text-white">1,205</b></span><span>CANDIDATES <b className="block text-sm text-white">9,482</b></span></div></div>
                <div className="grid grid-cols-[1.15fr_.85fr] gap-3"><div className="rounded-xl border border-cyan-400/15 bg-[#090d15]/85 p-3"><div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cyan-300"><Code2 className="h-3.5 w-3.5" /> build console</div><div className="space-y-1 font-mono text-[9px] text-slate-500"><p><span className="text-rose-400">01</span> const match = await network.sync()</p><p><span className="text-rose-400">02</span> ai.rank(candidates, opportunities)</p><p><span className="text-rose-400">03</span> workspace.connect()</p><p className="text-emerald-400">✓ compilation ready</p></div><div className="mt-3 flex items-center gap-2 text-[9px] text-slate-500"><Database className="h-3 w-3 text-cyan-300" /> 207 news / 100 jobs indexed</div></div><div className="rounded-xl border border-blue-400/15 bg-[#090d15]/85 p-3"><div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blue-300"><BrainCircuit className="h-3.5 w-3.5" /> AI analysis</div>{[['Skills match', '92%', 'bg-cyan-400'], ['Career signal', '84%', 'bg-rose-400'], ['Market fit', '76%', 'bg-amber-300']].map(([label, value, color]) => <div key={label} className="mb-3"><div className="mb-1 flex justify-between text-[9px] text-slate-400"><span>{label}</span><span>{value}</span></div><div className="h-1 rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: value }} /></div></div>)}</div></div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[9px] text-slate-500"><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> encrypted talent graph</span><span className="flex items-center gap-1.5 text-cyan-300"><Gauge className="h-3.5 w-3.5" /> 99.98% uptime</span></div>
              </section>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-3 sm:grid-cols-3 lg:grid-cols-6">{[[Globe2, 'Global talent', 'Network online', 'text-rose-400'], [BriefcaseBusiness, 'Job opportunities', 'Syncing career paths', 'text-cyan-300'], [Building2, 'Companies', 'Building relationships', 'text-blue-300'], [Users, 'Candidates', 'Matching skills', 'text-rose-300'], [Rocket, 'AI services', 'Powering careers', 'text-cyan-300'], [Zap, 'Growth signal', 'Market intelligence', 'text-amber-300']].map(([Icon, title, subtitle, color]) => { const CapabilityIcon = Icon as typeof Globe2; return <div key={String(title)} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.025] px-2 py-2 sm:px-3"><CapabilityIcon className={`h-4 w-4 shrink-0 ${color}`} /><div className="min-w-0"><p className="truncate text-[9px] font-semibold uppercase tracking-wider text-slate-300">{title as string}</p><p className="truncate font-mono text-[8px] text-slate-600">{subtitle as string}</p></div><Activity className={`ml-auto hidden h-3 w-3 shrink-0 sm:block ${color}`} /></div>; })}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
