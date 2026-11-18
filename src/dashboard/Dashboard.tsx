// ─── Dashboard ───────────────────────────────────────────────────────────────
// Main home screen: wallet, quick actions, setup checklist, recent activity.
import { Avatar, Badge, Button, Card, EmptyState, IconBank, IconFace, IconHistory, IconPay, IconCheck, IconWarning, IconTrendingDown, IconTrendingUp, StatsCard } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, formatDate } from '../shared/payment'

export default function Dashboard() {
  const { currentProfile, myBanks, myTransactions, hasLinkedFace, setView, logout } = useApp()
  if (!currentProfile) return null
  const recent = myTransactions.slice(0, 5)
  const setupDone = hasLinkedFace && myBanks.length > 0 && currentProfile.wallet > 0
  const setupSteps = [
    { done: true, label: 'Phone verified', value: currentProfile.phone, action: null },
    { done: hasLinkedFace, label: 'Face linked for pay', value: hasLinkedFace ? 'Active' : null, action: 'enroll' as const },
    { done: myBanks.length > 0, label: 'Bank account linked', value: myBanks.length > 0 ? `${myBanks.length} account(s)` : null, action: 'banking' as const },
    { done: currentProfile.wallet > 0, label: 'Wallet funded', value: currentProfile.wallet > 0 ? formatCurrency(currentProfile.wallet) : null, action: 'banking' as const },
  ]
  return (
    <div className="space-y-6 fade-in">
      {/* ── Hero: greeting + wallet ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-white shadow-lift">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-200">Welcome back,</p>
            <h2 className="mt-0.5 text-2xl font-extrabold">{currentProfile.name}</h2>
            <p className="mt-0.5 text-xs text-indigo-300">{currentProfile.phone}</p>
          </div>
          <Avatar name={currentProfile.name} size="lg" />
        </div>
        <div className="relative mt-6">
          <p className="text-xs font-medium text-indigo-200 uppercase tracking-widest">Wallet Balance</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight">
            {formatCurrency(currentProfile.wallet)}
          </p>
          {currentProfile.wallet === 0 && (
            <button onClick={() => setView('banking')}
              className="mt-2 inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/30 transition-all">
              + Add funds to get started
            </button>
          )}
        </div>
      </div>
      {/* ── Quick actions ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: <IconPay className="h-6 w-6" />, label: 'Pay', view: 'pay' as const, primary: true },
          { icon: <IconBank className="h-6 w-6" />, label: 'Banking', view: 'banking' as const, primary: false },
          { icon: <IconFace className="h-6 w-6" />, label: hasLinkedFace ? 'Re-link Face' : 'Link Face', view: 'enroll' as const, primary: false },
          { icon: <IconHistory className="h-6 w-6" />, label: 'History', view: 'history' as const, primary: false },
        ].map((a) => (
          <button key={a.view} onClick={() => setView(a.view)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl py-3.5 text-center transition-all duration-150 active:scale-95 ${
              a.primary
                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500'
                : 'bg-white text-slate-700 shadow-card hover:shadow-lift ring-1 ring-slate-200/80'
            }`}>
            <span>{a.icon}</span>
            <span className="text-[11px] font-semibold leading-none">{a.label}</span>
          </button>
        ))}
      </div>
      {/* ── Setup checklist (hide when fully done) ── */}
      {!setupDone && (
        <Card className="border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
          <div className="mb-3 flex items-center gap-2">
            <IconCheck className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Get started</h3>
            <span className="ml-auto text-xs font-semibold text-slate-400">
              {setupSteps.filter((s) => s.done).length}/{setupSteps.length} done
            </span>
          </div>
          <ul className="space-y-2">
            {setupSteps.map((step) => (
              <li key={step.label}
                className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-all ${
                  step.done ? 'bg-emerald-50' : 'bg-slate-50'
                }`}>
                <div className="flex items-center gap-2.5">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {step.done ? <IconCheck className="h-3 w-3" /> : <span className="text-[10px]">·</span>}
                  </span>
                  <span className={step.done ? 'text-slate-600' : 'font-semibold text-slate-800'}>{step.label}</span>
                </div>
                {step.done && step.value
                  ? <Badge tone="emerald">{step.value}</Badge>
                  : step.action && (
                    <button onClick={() => setView(step.action!)}
                      className="text-xs font-bold text-indigo-600 hover:underline">
                      Setup
                    </button>
                  )}
              </li>
            ))}
          </ul>
        </Card>
      )}
      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard label="Transactions" value={String(myTransactions.length)} tone="slate" />
        <StatsCard label="Banks" value={String(myBanks.length)} tone="indigo" />
        <StatsCard label="Face" value={hasLinkedFace ? 'Linked' : 'None'} tone={hasLinkedFace ? 'emerald' : 'rose'} />
      </div>
      {/* ── Recent activity ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent activity</h3>
          {myTransactions.length > 0 && (
            <button onClick={() => setView('history')} className="text-xs font-semibold text-indigo-600 hover:underline">
              View all
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={<IconHistory className="h-12 w-12 text-slate-300" />} title="No transactions yet"
            subtitle="Link a bank, add funds, then pay with your face." />
        ) : (
          <Card className="p-0 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-2xl grid place-items-center text-sm font-bold ${
                      t.type === 'payment' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {t.type === 'payment' ? <IconTrendingDown className="h-5 w-5" /> : <IconTrendingUp className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t.type === 'topup' ? `Top-up · ${t.source ?? 'bank'}` : 'Face payment'}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${t.type === 'payment' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === 'payment' ? '-' : '+'}{formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-slate-400">{formatCurrency(t.balanceAfter)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      <div className="pb-2 text-center">
        <button onClick={logout} className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors">
          Sign out
        </button>
      </div>
    </div>
  )
}
