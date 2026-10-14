import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  Cog,
  Cpu,
  Globe2,
  Network,
  Rocket,
  ShieldCheck,
  Terminal,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { CareerConnectLogo } from '../../components/common/CareerConnectLogo';

const capabilities = [
  { icon: BriefcaseBusiness, label: 'Opportunities', detail: 'Real roles, clear next steps', tone: 'text-rose-400' },
  { icon: Users, label: 'Talent network', detail: 'Skills matched to momentum', tone: 'text-cyan-300' },
  { icon: Building2, label: 'Hiring teams', detail: 'Build with verified people', tone: 'text-blue-300' },
  { icon: BrainCircuit, label: 'AI guidance', detail: 'Signal through the noise', tone: 'text-amber-300' },
];

const terminalLines = [
  'career-network :: handshake accepted',
  'talent-graph   :: matching skills to roles',
  'opportunities  :: live engineering feeds online',
  'workspace      :: ready for your next move',
];

export const PublicLandingPage: React.FC = () => {
  const [terminalIndex, setTerminalIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setTerminalIndex((index) => (index + 1) % terminalLines.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] overflow-hidden bg-[#05070b] text-white">
      <section className="relative isolate min-h-[calc(100vh-8rem)] border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(244,63,94,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.12),transparent_32%),linear-gradient(125deg,#030507,#0b111b_54%,#05070b)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(56,189,248,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.14)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-rose-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:pb-20 lg:pt-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-7 inline-flex items-center gap-2 rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-rose-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400 shadow-[0_0_12px_#fb7185]" /> live career intelligence network</motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}>
              <CareerConnectLogo variant="full" size="md" inverted showTagline className="mb-8 items-start text-left [&>div:last-child]:items-start" />
              <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl xl:text-7xl">Build your next chapter with <span className="text-rose-400 drop-shadow-[0_0_24px_rgba(244,63,94,0.35)]">signal, skill, and momentum.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">CareerConnect connects ambitious candidates, engineering teams, startups, and employers through one intelligent career workspace.</p>
            </motion.div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <RouterLink to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-[0_0_28px_rgba(244,63,94,0.28)] transition hover:bg-rose-400">Register <ArrowRight className="h-4 w-4" /></RouterLink>
              <RouterLink to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/60 hover:bg-cyan-300/10">Sign In</RouterLink>
              <RouterLink to="/jobs" className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:text-white">Explore jobs <ArrowRight className="h-4 w-4" /></RouterLink>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-4 font-mono text-[10px] text-slate-500"><Terminal className="h-4 w-4 text-cyan-300" /><span className="truncate text-cyan-100/70">{terminalLines[terminalIndex]}</span><span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-emerald-400" /></div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.2 }} className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-rose-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#080c14]/90 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" /> engineering command center</span><span className="text-cyan-300">online</span></div>
              <div className="grid grid-cols-[1fr_.82fr] gap-3">
                <div className="relative min-h-[245px] overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#05090f] p-4"><div className="absolute inset-3 rounded-xl border border-dashed border-cyan-300/15" /><div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-cyan-200/70"><span>LAB / TALENT-04</span><Cpu className="h-4 w-4 text-cyan-300" /></div><div className="relative flex h-40 items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="rounded-full border-[10px] border-slate-700 p-5 shadow-[0_0_28px_rgba(244,63,94,0.2)]"><Cog className="h-16 w-16 text-slate-300/80" strokeWidth={1.2} /></motion.div><div className="absolute h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_16px_#fb7185]" /></div><div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[8px] text-slate-500"><span>NETWORK LOAD</span><span className="text-emerald-400">98.4%</span></div></div>
                <div className="space-y-3"><div className="rounded-2xl border border-rose-400/20 bg-[#0c101a] p-3"><div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest"><span className="text-rose-300">Growth signal</span><BarChart3 className="h-4 w-4 text-rose-400" /></div><svg viewBox="0 0 130 66" className="h-20 w-full"><path d="M0 54H130M0 30H130M0 8H130" stroke="rgba(148,163,184,.12)" /><polyline points="0,57 15,49 30,52 43,35 60,40 76,25 90,30 104,12 118,19 130,5" fill="none" stroke="#fb3f82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="font-mono text-xs text-emerald-400">+12.48% network momentum</span></div><div className="rounded-2xl border border-blue-400/15 bg-[#0c101a] p-3"><div className="mb-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-blue-300"><BrainCircuit className="h-4 w-4" /> AI matching</div>{[['Skills', '92%', 'bg-cyan-400'], ['Career fit', '84%', 'bg-rose-400'], ['Market', '76%', 'bg-amber-300']].map(([label, value, color]) => <div key={label} className="mb-2"><div className="mb-1 flex justify-between text-[9px] text-slate-400"><span>{label}</span><span>{value}</span></div><div className="h-1 rounded-full bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: value }} /></div></div>)}</div></div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">{[['JOBS', 'LIVE'], ['TEAMS', 'CONNECTED'], ['SKILLS', 'MATCHED']].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-2"><p className="font-mono text-[8px] text-slate-500">{label}</p><p className="mt-1 text-[10px] font-bold text-white">{value}</p></div>)}</div>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-2 px-5 pb-8 sm:grid-cols-4 sm:px-8 lg:px-10">
          {capabilities.map(({ icon: Icon, label, detail, tone }) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><Icon className={`mb-2 h-4 w-4 ${tone}`} /><p className="text-[10px] font-bold uppercase tracking-wider text-slate-200">{label}</p><p className="mt-1 text-[9px] text-slate-500">{detail}</p></div>)}
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070a10] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-3 lg:px-10">
          {[['01', 'Create your signal', 'Build a profile that makes your engineering strengths, experience, and direction easy to understand.', Code2], ['02', 'Find the right system', 'Discover roles, companies, and teams that align with the way you want to work and grow.', Globe2], ['03', 'Move with confidence', 'Apply, communicate, and track progress through a workspace built around real momentum.', Rocket]].map(([number, title, detail, Icon]) => <div key={String(number)} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><span className="font-mono text-xs text-rose-400">{number}</span><Icon className="mt-6 h-5 w-5 text-cyan-300" /><h2 className="mt-4 text-lg font-bold text-white">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{String(detail)}</p><CheckCircle2 className="mt-5 h-4 w-4 text-emerald-400" /></div>)}
        </div>
      </section>

      <section className="bg-[#05070b] py-10"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 sm:flex-row sm:items-center sm:px-8 lg:px-10"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Ready when you are</p><h2 className="mt-2 text-2xl font-black text-white">Your next opportunity is already moving.</h2></div><RouterLink to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100">Enter the network <ArrowRight className="h-4 w-4" /></RouterLink></div></section>
    </div>
  );
};
