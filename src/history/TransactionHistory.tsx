// ─── Transaction History ──────────────────────────────────────────────────────
// All payments and top-ups for the logged-in profile, with totals.
import { Button, Card, EmptyState, SectionTitle, StatsCard } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, formatDate } from '../shared/payment'

export default function TransactionHistory() {
  const { myTransactions, setView } = useApp()

  // Empty state
  if (!myTransactions.length) return (
    <div className="mx-auto max-w-2xl space-y-6 fade-in">
      <SectionTitle title="🧾 Transaction history" subtitle="Your payments and top-ups." />
      <EmptyState icon="🧾" title="No transactions yet"
        subtitle="Add funds from a bank account, then pay with your face — they'll show up here." />
      <div className="text-center">
        <Button variant="secondary" onClick={() => setView('dashboard')}>← Back to dashboard</Button>
      </div>
    </div>
  )

  const totals = myTransactions.reduce(
    (a, t) => (t.type === 'payment' ? { ...a, paid: a.paid + t.amount } : { ...a, topped: a.topped + t.amount }),
    { paid: 0, topped: 0 },
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle title="🧾 Transaction history" subtitle="Your payments and top-ups." />
        <Button variant="secondary" onClick={() => setView('dashboard')}>← Dashboard</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard label="Total" value={String(myTransactions.length)} tone="slate" />
        <StatsCard label="Paid out" value={formatCurrency(totals.paid)} tone="rose" />
        <StatsCard label="Topped up" value={formatCurrency(totals.topped)} tone="emerald" />
      </div>

      {/* Transaction list */}
      <Card className="p-0 overflow-hidden">
        <ul className="scroll-thin max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
          {myTransactions.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-sm font-bold ${
                  t.type === 'payment' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  {t.type === 'payment' ? '↓' : '↑'}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {t.type === 'topup' ? `Top-up · ${t.source ?? 'bank'}` : 'Face payment'}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(t.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${t.type === 'payment' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {t.type === 'payment' ? '−' : '+'}{formatCurrency(t.amount)}
                </p>
                <p className="text-xs text-slate-400">bal {formatCurrency(t.balanceAfter)}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
