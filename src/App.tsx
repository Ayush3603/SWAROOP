// ─── Swaruoop Pay — Root App ──────────────────────────────────────────────────
// Auth gate: not logged in → AuthScreen; logged in → Shell with nav.
import { AppProvider, useApp } from './shared/AppContext'
import AuthScreen from './auth/AuthScreen'
import Dashboard  from './dashboard/Dashboard'
import Enroll     from './face/Enroll'
import Pay        from './pay/Pay'
import Banking    from './banking/Banking'
import Profile    from './profile/Profile'
import TransactionHistory from './history/TransactionHistory'
import { Logo, Spinner } from './shared/ui'
import { formatCurrency } from './shared/payment'
import type { View } from './shared/types'

const NAV: { id: View; label: string; icon: string }[] = [
  { id: 'pay',     label: 'Pay',       icon: '🤳' },
  { id: 'enroll',  label: 'Link face',  icon: '🙂' },
  { id: 'banking', label: 'Banking',    icon: '🏦' },
  { id: 'history', label: 'History',    icon: '🧾' },
]

function Shell() {
  const { view, setView, currentProfile, modelsReady } = useApp()
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <button onClick={() => setView('dashboard')}><Logo compact /></button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1">
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  view === item.id
                    ? 'bg-white text-indigo-600 shadow-card'
                    : 'text-slate-500 hover:text-slate-800'
                }`}>
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!modelsReady && <Spinner className="h-4 w-4 text-slate-400" />}
            {currentProfile && (
              <span className="hidden text-sm font-bold text-emerald-600 sm:block">
                {formatCurrency(currentProfile.wallet)}
              </span>
            )}
            <button onClick={() => setView('profile')}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-md hover:shadow-lift transition-shadow"
              title="Profile">
              {currentProfile?.name.charAt(0).toUpperCase() ?? '?'}
            </button>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="flex sm:hidden border-t border-slate-100 bg-white/95">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-all ${
                view === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 pb-8">
        {view === 'dashboard' && <Dashboard />}
        {view === 'pay'       && <Pay />}
        {view === 'enroll'    && <Enroll />}
        {view === 'banking'   && <Banking />}
        {view === 'profile'   && <Profile />}
        {view === 'history'   && <TransactionHistory />}
      </main>

      {/* ── Footer ── */}
      <footer className="pb-6 text-center text-xs text-slate-400">
        Swaruoop Pay · face recognition runs entirely in your browser · no data leaves your device
      </footer>
    </div>
  )
}

function AppInner() {
  const { currentProfile } = useApp()
  return currentProfile ? <Shell /> : <AuthScreen />
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
