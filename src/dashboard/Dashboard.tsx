// ─── Dashboard ───────────────────────────────────────────────────────────────
// Main home screen: wallet, banking, face enrollment, transactions.
import { useState } from 'react'
import { Avatar, IconPay, IconBank, IconFace, IconHistory, IconTrendingDown, IconTrendingUp, StatsCard, Button, Card, SectionTitle } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, formatDate } from '../shared/payment'
import type { BankAccount } from '../shared/types'

export default function Dashboard() {
  const { currentProfile, myBanks, myTransactions, hasLinkedFace, setView, logout } = useApp()
  const [showBanking, setShowBanking] = useState(false)
  const [showFace, setShowFace] = useState(false)
  if (!currentProfile) return null
  const recent = myTransactions.slice(0, 5)
  const setupDone = hasLinkedFace && myBanks.length > 0 && currentProfile.wallet > 0

  return (
    <div className="space-y-6 fade-in">
      {/* ── Wallet Card ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-6 text-white shadow-lg">
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200">Welcome back,</p>
            <h2 className="mt-1 text-2xl font-bold">{currentProfile.name}</h2>
            <p className="mt-1 text-xs text-indigo-300">{currentProfile.phone}</p>
          </div>
          <Avatar name={currentProfile.name} size="lg" />
        </div>
        <div className="mt-8">
          <p className="text-xs font-medium text-indigo-200 uppercase tracking-widest">Wallet Balance</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            {formatCurrency(currentProfile.wallet)}
          </p>
          {currentProfile.wallet === 0 && !setupDone && (
            <button onClick={() => setShowBanking(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/30 transition-all">
              <span>+</span> Add funds to get started
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={() => setShowFace(true)}
          className="flex flex-col items-center gap-2 rounded-2xl bg-indigo-600 p-4 text-center transition-all hover:bg-indigo-500 active:scale-95 shadow-lg"
        >
          <IconPay className="h-8 w-8 text-white" />
          <span className="text-sm font-semibold text-white">Pay with Face</span>
        </button>
        <button 
          onClick={() => setShowBanking(true)}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition-all hover:bg-slate-50 active:scale-95 shadow-md ring-1 ring-slate-200"
        >
          <IconBank className="h-8 w-8 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">Banking</span>
        </button>
        <button 
          onClick={() => setShowFace(true)}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition-all hover:bg-slate-50 active:scale-95 shadow-md ring-1 ring-slate-200"
        >
          <IconFace className="h-8 w-8 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">
            {hasLinkedFace ? 'Manage Face' : 'Link Face'}
          </span>
        </button>
        <button 
          onClick={() => setView('history')}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 text-center transition-all hover:bg-slate-50 active:scale-95 shadow-md ring-1 ring-slate-200"
        >
          <IconHistory className="h-8 w-8 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">History</span>
        </button>
      </div>

      {/* ── Banking Section ── */}
      {showBanking && (
        <div className="animate-fade-in">
          <SectionTitle title="🏦 Banking" subtitle="Link your bank account to fund your wallet" />
          <Card>
            {myBanks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No bank accounts linked</p>
                <p className="text-sm text-slate-400 mt-1">Accounts will auto-link when you sign up</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBanks.map((bank) => (
                  <div key={bank.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {bank.bankName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{bank.bankName}</p>
                        <p className="text-xs text-slate-500">••••{bank.last4} - {bank.accountType}</p>
                      </div>
                    </div>
                    <Button onClick={() => alert(`Add funds to ${bank.bankName}`)} variant="secondary" className="py-2 px-4 text-xs">
                      Add Funds
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => alert('Add new bank account')} className="w-full mt-4" variant="secondary">
              + Add New Bank
            </Button>
          </Card>
        </div>
      )}

      {/* ── Face Enrollment Section ── */}
      {showFace && (
        <div className="animate-fade-in">
          <SectionTitle 
            title={hasLinkedFace ? 'Manage Face' : 'Link Face for Payments'} 
            subtitle="Register your face to make payments just by looking at the camera" 
          />
          <Card className="text-center py-8">
            {hasLinkedFace ? (
              <div>
                <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <IconFace className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Face is Linked</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {currentProfile.name} can now pay by looking at the camera.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button onClick={() => setShowFace(false)} variant="secondary">Back to Dashboard</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto mb-4 h-16 w-16 rounded-3xl bg-indigo-100 flex items-center justify-center">
                  <IconFace className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Link Your Face</h3>
                <p className="mt-2 text-sm text-slate-500 mb-4">
                  Enable face recognition to pay with just a look.
                </p>
                <Button onClick={() => setView('enroll')} variant="primary">Link Face Now</Button>
                <Button onClick={() => setShowFace(false)} variant="secondary" className="mt-2">Back to Dashboard</Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Stats ── */}
      {!setupDone && !showBanking && !showFace && (
        <div className="grid grid-cols-3 gap-3">
          <StatsCard label="Transactions" value={String(myTransactions.length)} tone="slate" />
          <StatsCard label="Banks" value={String(myBanks.length)} tone="indigo" />
          <StatsCard label="Face" value={hasLinkedFace ? 'Linked' : 'Not Set'} tone={hasLinkedFace ? 'emerald' : 'slate'} />
        </div>
      )}

      {/* ── Recent Activity ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Activity</h3>
          {myTransactions.length > 0 && (
            <button onClick={() => setView('history')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View All
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <p className="text-slate-500">No transactions yet</p>
            <p className="text-sm text-slate-400 mt-1">Add funds and make your first payment</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white shadow-md ring-1 ring-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                      t.type === 'payment' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {t.type === 'payment' ? <IconTrendingDown className="h-5 w-5" /> : <IconTrendingUp className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {t.type === 'topup' ? `Top-up` : 'Face Payment'}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === 'payment' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {t.type === 'payment' ? '-' : '+'}{formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-slate-400">bal {formatCurrency(t.balanceAfter)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-center">
        <button 
          onClick={logout} 
          className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
