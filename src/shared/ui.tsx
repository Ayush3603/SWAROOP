// ─── Swaruoop Pay — Shared UI Components ─────────────────────────────────────
// Every visual element used across the app lives here.
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

// ─── Professional Icons (BHIM UPI style) ─────────────────────────────────────
export function IconPay({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  )
}

export function IconBank({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4 8 4v14" />
      <path d="M10 21v-6" />
      <path d="M14 21v-6" />
    </svg>
  )
}

export function IconFace({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
      <path d="M8 15h8" />
    </svg>
  )
}

export function IconHistory({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function IconWarning({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function IconLight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2" />
      <path d="M12 21v2" />
      <path d="M4.22 4.22l1.42 1.42" />
      <path d="M18.36 18.36l1.42 1.42" />
      <path d="M1 12h2" />
      <path d="M21 12h2" />
      <path d="M4.22 19.78l1.42-1.42" />
      <path d="M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export function IconEye({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconGlasses({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12h6" />
      <path d="M17 12h6" />
      <circle cx="5" cy="12" r="3" />
      <circle cx="19" cy="12" r="3" />
    </svg>
  )
}

export function IconLock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function IconTrendingUp({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

export function IconTrendingDown({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
const V: Record<Variant, string> = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-md hover:shadow-lg disabled:bg-indigo-300',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 active:bg-slate-100 disabled:opacity-50 shadow-card',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40',
  danger:    'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 shadow-md disabled:bg-rose-300',
  success:   'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-md disabled:bg-emerald-300',
}
export function Button({
  variant = 'primary', className = '', children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed select-none ${V[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-3xl bg-white p-5 shadow-card ring-1 ring-slate-200/80 ${className}`}>
      {children}
    </div>
  )
}

// ─── GlassCard ───────────────────────────────────────────────────────────────
export function GlassCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-3xl glass ring-1 ring-white/60 shadow-lift p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const TONES: Record<string, string> = {
  slate:   'bg-slate-100 text-slate-600',
  indigo:  'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose:    'bg-rose-100 text-rose-700',
  amber:   'bg-amber-100 text-amber-700',
  cyan:    'bg-cyan-100 text-cyan-700',
}
export function Badge({ tone = 'slate', children, className = '' }: { tone?: string; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone] ?? TONES.slate} ${className}`}>
      {children}
    </span>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ─── SectionTitle ────────────────────────────────────────────────────────────
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="fade-in">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  )
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-8 py-12 text-center fade-in">
      <div className="mb-3 text-5xl">{icon}</div>
      <p className="font-semibold text-slate-700">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-sm text-slate-500">{subtitle}</p>}
    </div>
  )
}

// ─── Field ───────────────────────────────────────────────────────────────────
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

// ─── TextInput ───────────────────────────────────────────────────────────────
export function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-indigo-400 focus:bg-white focus:shadow-glow focus:ring-0 ${className}`}
      {...rest}
    />
  )
}

// ─── Logo ────────────────────────────────────────────────────────────────────
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md`}>
          <svg viewBox="0 0 32 32" className={compact ? 'h-5 w-5' : 'h-6 w-6'} fill="none">
            <circle cx="16" cy="13" r="5" fill="none" stroke="white" strokeWidth="2" />
            <path d="M8 25c1-4 4-6 8-6s7 2 8 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22" cy="10" r="3" fill="#22d3ee" />
          </svg>
        </div>
        <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
      </div>
      <div>
        <p className={`font-extrabold leading-none tracking-tight text-slate-900 ${compact ? 'text-base' : 'text-lg'}`}>
          Swaruoop<span className="text-indigo-600"> Pay</span>
        </p>
        {!compact && <p className="text-[10px] font-medium text-slate-400 tracking-wide">FACIAL PAYMENT</p>}
      </div>
    </div>
  )
}

// ─── StatsCard ───────────────────────────────────────────────────────────────
export function StatsCard({ label, value, sub, tone = 'slate' }: { label: string; value: string; sub?: string; tone?: 'slate' | 'indigo' | 'emerald' | 'rose' }) {
  const colors = { slate: 'text-slate-900', indigo: 'text-indigo-600', emerald: 'text-emerald-600', rose: 'text-rose-600' }
  return (
    <Card className="flex flex-col gap-0.5">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-extrabold ${colors[tone]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </Card>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-8 w-8 text-xs', md: 'h-11 w-11 text-sm', lg: 'h-16 w-16 text-xl' }
  return (
    <div className={`${s[size]} grid place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 font-bold text-white shadow-md`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type, children, className = '' }: { type: 'error' | 'success' | 'info'; children: ReactNode; className?: string }) {
  const s = {
    error:   'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    info:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  }
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${s[type]} ${className}`}>
      {children}
    </div>
  )
}
