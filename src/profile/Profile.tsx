// ─── Profile View ───────────────────────────────────────────────────────────
// Account details, face status, quick links, danger zone.
import { Alert, Avatar, Badge, Button, Card, SectionTitle } from '../shared/ui'
import { useApp } from '../shared/AppContext'
import { formatCurrency, formatDate } from '../shared/payment'

export default function Profile() {
  const { currentProfile, hasLinkedFace, myBanks, setView, logout, deleteAccount } = useApp()
  if (!currentProfile) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6 fade-in">
      <SectionTitle title="👤 Profile" subtitle="Your account details and settings." />

      {/* Profile header card */}
      <Card className="shadow-lift">
        <div className="flex items-center gap-4">
          <Avatar name={currentProfile.name} size="lg" />
          <div>
            <p className="text-xl font-extrabold text-slate-900">{currentProfile.name}</p>
            <p className="text-sm text-slate-500">{currentProfile.phone}</p>
            <p className="mt-0.5 text-xs text-slate-400">Member since {formatDate(currentProfile.createdAt)}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100">
            <dt className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Wallet</dt>
            <dd className="mt-1 text-xl font-extrabold text-emerald-700">{formatCurrency(currentProfile.wallet)}</dd>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Banks</dt>
            <dd className="mt-1 text-xl font-extrabold text-slate-900">{myBanks.length}</dd>
          </div>
        </dl>
      </Card>

      {/* Face status */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-100 text-xl">
            {hasLinkedFace ? '✅' : '🙂'}
          </div>
          <div>
            <p className="font-semibold text-slate-900">Face login</p>
            <p className="text-xs text-slate-500">
              {hasLinkedFace ? 'Your face is linked for Swaruoop Pay.' : 'Link your face to pay by looking at the camera.'}
            </p>
          </div>
        </div>
        {hasLinkedFace
          ? <Badge tone="emerald">Linked ✓</Badge>
          : <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => setView('enroll')}>Link face</Button>}
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setView('banking')}>🏦 Manage banking</Button>
        <Button variant="secondary" onClick={() => setView('dashboard')}>🏠 Dashboard</Button>
        <Button variant="ghost" onClick={logout}>🚪 Sign out</Button>
      </div>

      {/* Danger zone */}
      <Card className="border-2 border-rose-100 bg-rose-50/30">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-500">⚠️ Danger zone</p>
        <p className="mb-3 text-sm text-slate-500">
          Deleting your account permanently removes your profile, linked banks, and all transaction history.
          This cannot be undone.
        </p>
        <Button variant="danger"
          onClick={() => { if (confirm('Permanently delete your account, banks, and all history?')) deleteAccount() }}>
          Delete my account
        </Button>
      </Card>

      <p className="text-center text-xs text-slate-400 pb-2">
        Demo only — your data is stored locally in this browser and never sent anywhere.
      </p>
    </div>
  )
}
