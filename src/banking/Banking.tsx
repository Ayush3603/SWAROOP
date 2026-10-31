// ─── Banking View ────────────────────────────────────────────────────────────
// Linked bank accounts, manual add, and wallet top-up.
import { type FormEvent, useState } from 'react'
import { Alert, Button, Card, EmptyState, Field, SectionTitle, TextInput } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, parseAmountToCents } from '../shared/payment'
import type { AccountType, BankAccount } from '../shared/types'

export default function Banking() {
  const { myBanks, addBankAccount, removeBankAccount, addFunds, currentProfile } = useApp()
  const [bankName, setBankName]           = useState('')
  const [holderName, setHolderName]       = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountType, setAccountType]     = useState<AccountType>('checking')
  const [formMsg, setFormMsg]             = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [fundBank, setFundBank]           = useState<BankAccount | null>(null)
  const [fundAmount, setFundAmount]       = useState('')
  const [fundError, setFundError]         = useState<string | null>(null)

  const handleAdd = (e: FormEvent) => {
    e.preventDefault(); setFormMsg(null)
    const res = addBankAccount({ bankName, holderName, accountNumber, accountType })
    if (!res.ok) { setFormMsg({ type: 'error', text: res.error ?? 'Could not add.' }); return }
    setBankName(''); setHolderName(''); setAccountNumber(''); setAccountType('checking')
    setFormMsg({ type: 'success', text: 'Bank account added successfully!' })
    setTimeout(() => setFormMsg(null), 3000)
  }

  const confirmFund = () => {
    if (!fundBank) return
    const cents = parseAmountToCents(fundAmount)
    if (!cents) { setFundError('Enter a valid amount, e.g. 500'); return }
    const res = addFunds(fundBank.id, cents)
    if (!res.ok) { setFundError(res.error ?? 'Could not add funds.'); return }
    setFundBank(null); setFundAmount(''); setFundError(null)
  }

  const BANK_ICONS: Record<string, string> = {
    'HDFC Bank': '🔵', 'ICICI Bank': '🟠', 'SBI': '🔴',
    'Axis Bank': '🟣', 'Kotak Bank': '🔶', default: '🏦',
  }
  const bankIcon = (name: string) => BANK_ICONS[name] ?? BANK_ICONS.default

  return (
    <div className="mx-auto max-w-3xl space-y-6 fade-in">
      <SectionTitle title="🏦 Banking" subtitle="Linked bank accounts — use them to fund your Swaruoop Pay wallet." />

      {/* ── Linked accounts ── */}
      <section>
        <h3 className="mb-3 font-bold text-slate-900">Linked accounts</h3>
        {myBanks.length === 0 ? (
          <EmptyState icon="🏦" title="No bank accounts linked"
            subtitle="Accounts auto-link on signup. You can also add one manually below." />
        ) : (
          <div className="space-y-3">
            {myBanks.map((b) => (
              <Card key={b.id} className="flex items-center justify-between gap-3 hover:shadow-lift transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-2xl shadow-inner">
                    {bankIcon(b.bankName)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{b.bankName}</p>
                    <p className="text-sm text-slate-500">
                      {b.holderName} · <span className="capitalize">{b.accountType}</span> · ••{b.last4}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button onClick={() => { setFundBank(b); setFundAmount(''); setFundError(null) }}
                    className="px-4 py-2 text-xs">
                    + Add funds
                  </Button>
                  <Button variant="ghost"
                    onClick={() => { if (confirm(`Remove ${b.bankName} ••${b.last4}?`)) removeBankAccount(b.id) }}
                    className="px-2.5 py-2 text-xs text-rose-500 hover:bg-rose-50">
                    ✕
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Add manually ── */}
      <section>
        <Card className="border border-slate-200">
          <h3 className="mb-4 font-bold text-slate-900">Add a bank account manually</h3>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <Field label="Bank name">
              <TextInput value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" />
            </Field>
            <Field label="Account holder">
              <TextInput value={holderName} onChange={(e) => setHolderName(e.target.value)}
                placeholder={currentProfile?.name ?? 'Full name'} />
            </Field>
            <Field label="Account number">
              <TextInput value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
                inputMode="numeric" placeholder="Only last 4 digits saved" />
            </Field>
            <Field label="Account type">
              <select value={accountType} onChange={(e) => setAccountType(e.target.value as AccountType)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all">
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </Field>
            {formMsg && (
              <div className="sm:col-span-2">
                <Alert type={formMsg.type}>{formMsg.text}</Alert>
              </div>
            )}
            <div className="sm:col-span-2">
              <Button type="submit">Add bank account</Button>
            </div>
          </form>
        </Card>
      </section>

      {/* ── Add funds modal ── */}
      {fundBank && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setFundBank(null)}>
          <Card className="w-full max-w-sm slide-up shadow-lift" >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-2xl">
                  {bankIcon(fundBank.bankName)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Add funds to wallet</h3>
                  <p className="text-xs text-slate-500">{fundBank.bankName} ••{fundBank.last4}</p>
                </div>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                <input autoFocus value={fundAmount} onChange={(e) => setFundAmount(e.target.value)}
                  inputMode="decimal" placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-xl font-bold text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-glow transition-all" />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[10000, 50000, 100000].map((c) => (
                  <button key={c} onClick={() => setFundAmount((c / 100).toFixed(2))}
                    className={`rounded-2xl py-2 text-sm font-bold transition-all ${
                      fundAmount === (c / 100).toFixed(2)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}>
                    {formatCurrency(c)}
                  </button>
                ))}
              </div>

              {fundError && <Alert type="error" className="mt-3">{fundError}</Alert>}

              <div className="mt-4 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setFundBank(null)}>Cancel</Button>
                <Button variant="success" className="flex-1" onClick={confirmFund}>Add funds</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
