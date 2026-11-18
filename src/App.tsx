// ─── Swaruoop Pay — Root App ──────────────────────────────────────────────────
// Auth gate: not logged in → AuthScreen; logged in → Shell.
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

function Shell() {
  const { view, setView, currentProfile, modelsReady } = useApp()
  
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <div className="text-2xl">🏠</div> },
    { id: 'pay', label: 'Pay', icon: <div className="text-2xl">💳</div> },
    { id: 'banking', label: 'Bank', icon: <div className="text-2xl">🏦</div> },
    { id: 'enroll', label: 'Face', icon: <div className="text-2xl">👤</div> },
    { id: 'history', label: 'History', icon: <div className="text-2xl">📋</div> },
    { id: 'profile', label: 'Profile', icon: <div className="text-2xl">⚙️</div> },
  ]

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 pb-20 sm:pb-0">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 bg-white/90 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2">
            <Logo compact />
          </button>
          
          {/* Desktop nav - top */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setView(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  view === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            {!modelsReady && <Spinner className="h-4 w-4 text-slate-400" />}
            {currentProfile && (
              <span className="hidden md:block text-sm font-bold text-emerald-600">
                {formatCurrency(currentProfile.wallet)}
              </span>
            )}
            <button onClick={() => setView('profile')}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-md hover:shadow-lift transition-shadow">
              {currentProfile?.name.charAt(0).toUpperCase() ?? '?'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation - Shows only on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                view === item.id ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className="text-2xl">{item.icon}</div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      {/* ── Main content ── */}
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-8">
        {view === 'dashboard' && <Dashboard />}
        {view === 'pay' && <Pay />}
        {view === 'enroll' && <Enroll />}
        {view === 'banking' && <Banking />}
        {view === 'profile' && <Profile />}
        {view === 'history' && <TransactionHistory />}
      </main>
      
      {/* ── Footer ── */}
      <footer className="hidden md:block pb-6 text-center text-xs text-slate-400">
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
