// ─── Pay View ────────────────────────────────────────────────────────────────
// Face scan → identity verified → charge wallet.
import { useRef, useState } from 'react'
import Camera from '../face/Camera'
import type { DetectedFace } from '../face/faceApi'
import { Alert, Avatar, Badge, Button, Card, SectionTitle, Spinner } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, parseAmountToCents, formatDate } from '../shared/payment'
import type { Profile, Transaction } from '../shared/types'

type Status = 'looking' | 'unknown' | 'matched'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000] // cents

export default function Pay() {
  const { identifyFace, chargeProfile, setView, modelsReady, modelError, retryModels } = useApp()
  const [scanning, setScanning] = useState(true)
  const [status, setStatus]     = useState<Status>('looking')
  const [matched, setMatched]   = useState<Profile | null>(null)
  const [amount, setAmount]     = useState('')
  const [result, setResult]     = useState<{ ok: boolean; error?: string; txn?: Transaction } | null>(null)
  const lockedRef     = useRef(false)
  const lastStatusRef = useRef<Status>('looking')

  const handleDetection = (face: DetectedFace | null) => {
    if (lockedRef.current) return
    if (!face) {
      if (lastStatusRef.current !== 'looking') { lastStatusRef.current = 'looking'; setStatus('looking') }
      return
    }
    const { profile } = identifyFace(face.descriptor)
    if (profile) {
      lockedRef.current = true
      lastStatusRef.current = 'matched'
      setStatus('matched'); setMatched(profile); setScanning(false)
    } else if (lastStatusRef.current !== 'unknown') {
      lastStatusRef.current = 'unknown'; setStatus('unknown')
    }
  }

  const reset = () => {
    lockedRef.current = false; lastStatusRef.current = 'looking'
    setMatched(null); setStatus('looking'); setScanning(true); setAmount(''); setResult(null)
  }

  const handlePay = () => {
    if (!matched) return
    const cents = parseAmountToCents(amount)
    if (!cents) { setResult({ ok: false, error: 'Enter a valid amount, e.g. 25.00' }); return }
    const res = chargeProfile(matched.id, cents)
    setResult(res.ok ? { ok: true, txn: res.transaction } : { ok: false, error: res.error })
  }

  // ── Success ──
  if (result?.ok && result.txn) {
    const txn = result.txn
    return (
      <div className="mx-auto max-w-md fade-in">
        <Card className="text-center shadow-lift">
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-4xl shadow-md">
            💸
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Payment done!</h2>
          <p className="mt-2 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{formatCurrency(txn.amount)}</span> charged to{' '}
            <span className="font-semibold text-slate-700">{txn.profileName}</span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl bg-emerald-50 p-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-semibold">New balance</p>
              <p className="text-lg font-extrabold text-emerald-700">{formatCurrency(txn.balanceAfter)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500 font-semibold">Date & time</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatDate(txn.createdAt)}</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500 font-semibold">Reference ID</p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-slate-600 break-all">{txn.id}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setView('dashboard')}>Dashboard</Button>
            <Button className="flex-1" onClick={reset}>Pay again</Button>
          </div>
        </Card>
      </div>
    )
  }

  // ── Model error ──
  if (modelError) return (
    <div className="mx-auto max-w-md fade-in">
      <Card className="text-center shadow-lift">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-rose-100 text-3xl">⚠️</div>
        <p className="text-lg font-bold text-slate-900">Face models failed to load</p>
        <p className="mt-1 text-sm text-slate-500">{modelError}</p>
        <Button className="mt-5" onClick={retryModels}>Retry</Button>
      </Card>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-4 fade-in">
      <SectionTitle title="🤳 Pay with your face" subtitle="Look at the camera — your account is identified automatically." />

      <div className="grid gap-5 md:grid-cols-2">
        {/* ── Camera column ── */}
        <div className="space-y-3">
          {modelsReady
            ? <Camera scanning={scanning} onDetection={handleDetection}
                hint={status === 'unknown' ? 'Face not recognized — link your face first' : 'Look at the camera to identify your account'} />
            : <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-slate-900">
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <Spinner className="h-8 w-8 text-cyan-400" />
                  <p className="text-sm">Loading face models…</p>
                </div>
              </div>}

          {/* Status badge */}
          <div className="flex justify-center">
            {status === 'looking' && (
              <div className="scan-ring inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Scanning for face…
              </div>
            )}
            {status === 'unknown' && (
              <Badge tone="rose" className="px-4 py-2 text-sm">😕 No matching account found</Badge>
            )}
            {status === 'matched' && (
              <Badge tone="emerald" className="px-4 py-2 text-sm">✅ Identity verified!</Badge>
            )}
          </div>

          {status === 'unknown' && (
            <p className="text-center text-sm text-slate-500">
              Haven't linked your face yet?{' '}
              <button onClick={() => setView('enroll')} className="font-semibold text-indigo-600 hover:underline">
                Link face →
              </button>
            </p>
          )}
        </div>

        {/* ── Payment column ── */}
        <div>
          {matched ? (
            <Card className="slide-up shadow-lift space-y-4">
              {/* Matched user */}
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <Avatar name={matched.name} size="md" />
                <div>
                  <p className="font-bold text-slate-900">{matched.name}</p>
                  <p className="text-xs text-slate-500">{matched.phone}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-500">Wallet</p>
                  <p className="text-sm font-bold text-emerald-700">{formatCurrency(matched.wallet)}</p>
                </div>
              </div>

              {/* Amount input */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Amount to charge</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-9 pr-4 text-xl font-bold text-slate-900 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-glow transition-all"
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_AMOUNTS.map((c) => (
                    <button key={c} onClick={() => setAmount((c / 100).toFixed(2))}
                      className={`rounded-2xl py-2 text-xs font-bold transition-all ${
                        amount === (c / 100).toFixed(2)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}>
                      {formatCurrency(c)}
                    </button>
                  ))}
                </div>
              </div>

              {result?.ok === false && result.error && (
                <Alert type="error">{result.error}</Alert>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={reset} className="flex-1">Cancel</Button>
                <Button onClick={handlePay} className="flex-1 py-3">Confirm payment</Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="text-5xl">👤</div>
              <p className="font-bold text-slate-800">Waiting for face scan</p>
              <p className="text-sm text-slate-500 max-w-xs">
                Once the camera identifies your face, the payment form will appear here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
