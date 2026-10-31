// ─── Auth Screen ─────────────────────────────────────────────────────────────
// Phone-number login/signup — no OTP, instant access (demo mode).
import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Field, Logo, TextInput } from '../shared/ui'
import { useApp } from '../shared/AppContext'

type Mode = 'login' | 'signup'

const DEMO_ACCOUNTS = [
  { name: 'Swaruoop',  phone: '9876543210' },
  { name: 'Alex Demo', phone: '9000000001' },
]

export default function AuthScreen() {
  const { signup, login } = useApp()
  const [mode, setMode]   = useState<Mode>('login')
  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy]   = useState(false)

  const switchMode = (m: Mode) => { setMode(m); setError(null); setName(''); setPhone('') }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null); setBusy(true)
    const res = mode === 'login' ? login(phone) : signup(name, phone)
    setBusy(false)
    if (!res.ok) setError(res.error ?? 'Something went wrong.')
  }

  const fillDemo = (d: typeof DEMO_ACCOUNTS[0]) => {
    setPhone(d.phone)
    if (mode === 'signup') setName(d.name)
    setError(null)
  }

  return (
    <div className="grid min-h-full place-items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10">
      <div className="w-full max-w-md fade-in">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pay with your face — just like PhonePe, but smarter.
          </p>
        </div>

        <Card className="shadow-lift">
          {/* Mode toggle */}
          <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 gap-1">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-indigo-600 shadow-card'
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                {m === 'login' ? '👋 Log in' : '✨ Sign up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Field label="Full name">
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Swaruoop"
                  autoComplete="name"
                  autoFocus
                />
              </Field>
            )}
            <Field label="Phone number">
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="e.g. 9876543210"
                autoComplete="tel"
                autoFocus={mode === 'login'}
              />
            </Field>

            {error && <Alert type="error">{error}</Alert>}

            <Button type="submit" className="w-full py-3 text-base" disabled={busy}>
              {busy
                ? <><Spinner /> Please wait…</>
                : mode === 'login' ? 'Log in →' : 'Create account →'}
            </Button>
          </form>

          {/* Demo quick-fill */}
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-600">
              🚀 Quick demo
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((d) => (
                <button key={d.phone} onClick={() => fillDemo(d)}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-card hover:shadow-lift hover:text-indigo-600 transition-all">
                  {d.name} ({d.phone})
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Tap to fill • Sign up first, then log in with same number
            </p>
          </div>
        </Card>

        <p className="mt-5 text-center text-xs text-slate-400">
          Demo only — all data stays in this browser. No real money, no real banks.
        </p>
      </div>
    </div>
  )
}

// Import Spinner locally for the button
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
