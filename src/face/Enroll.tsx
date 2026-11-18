// ─── Face Enrollment ─────────────────────────────────────────────────────────
// Register or replace the face descriptor linked to the current account.
import { useRef, useState } from 'react'
import Camera from './Camera'
import type { DetectedFace } from './faceApi'
import { Alert, Avatar, Badge, Button, Card, SectionTitle, Spinner } from '../shared/ui'
import { useApp } from '../shared/AppContext'

export default function Enroll() {
  const { currentProfile, hasLinkedFace, linkFace, setView, modelsReady, modelError, retryModels } = useApp()
  const [face, setFace]         = useState<DetectedFace | null>(null)
  const [linked, setLinked]     = useState(false)
  const [scanning, setScanning] = useState(true)
  const faceRef = useRef<DetectedFace | null>(null)

  const handleDetection = (f: DetectedFace | null) => {
    faceRef.current = f
    setFace(f)
  }

  const handleLink = () => {
    const f = faceRef.current
    if (!f) return
    linkFace(f.descriptor)
    setScanning(false)
    setLinked(true)
  }

  // ── Success ──
  if (linked) return (
    <div className="mx-auto max-w-md fade-in">
      <Card className="text-center shadow-lift">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-4xl shadow-md">
          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Face linked successfully</h2>
        <p className="mt-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{currentProfile?.name}</span> can now pay
          by looking at the camera. No PIN, no card needed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => setView('dashboard')}>Dashboard</Button>
          <Button onClick={() => setView('pay')}>Try Face Payment</Button>
        </div>
      </Card>
    </div>
  )

  // ── Model error ──
  if (modelError) return (
    <div className="mx-auto max-w-md fade-in">
      <Card className="text-center shadow-lift">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-rose-100 text-3xl">
          <svg className="h-8 w-8 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-900">Face models failed to load</p>
        <p className="mt-1 text-sm text-slate-500">{modelError}</p>
        <Button className="mt-5" onClick={retryModels}>Retry loading models</Button>
      </Card>
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-4 fade-in">
      <SectionTitle
        title={hasLinkedFace ? 'Re-link your face' : 'Link your face'}
        subtitle="Register your face once — then pay just by looking at the camera."
      />
      {hasLinkedFace && (
        <Alert type="info">
          A face is already linked to this account. Registering a new one will replace it.
        </Alert>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {/* ── Camera ── */}
        <div>
          {modelsReady ? (
            <Camera scanning={scanning} onDetection={handleDetection}
              hint="Look directly at the camera and stay still" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-slate-900">
              <div className="flex flex-col items-center gap-3 text-slate-300">
                <Spinner className="h-8 w-8 text-cyan-400" />
                <p className="text-sm">Loading face recognition models…</p>
                <p className="text-xs text-slate-500">~7 MB — cached after first load</p>
              </div>
            </div>
          )}
        </div>
        {/* ── Instructions + link button ── */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              {currentProfile && <Avatar name={currentProfile.name} size="md" />}
              <div>
                <p className="font-bold text-slate-900">{currentProfile?.name}</p>
                <p className="text-xs text-slate-500">{currentProfile?.phone}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-700">Face detection</span>
              {face
                ? <Badge tone="emerald">Detected — {(face.score * 100).toFixed(0)}% confidence</Badge>
                : <Badge tone="amber">Scanning…</Badge>}
            </div>
            <Button
              className="w-full py-3 text-base"
              variant={face ? 'success' : 'primary'}
              disabled={!face}
              onClick={handleLink}
            >
              {face ? 'Link this face' : 'Waiting for face…'}
            </Button>
          </Card>
          {/* Tips */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-indigo-600">Tips for best results</p>
            <ul className="space-y-1 text-xs text-slate-600">
              <li className="flex gap-2">
                <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
                <span>Good lighting — face the light source</span>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Look directly at the camera</span>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                  <line x1="12" y1="2" x2="12" y2="12" />
                </svg>
                <span>Remove glasses/hat if possible</span>
              </li>
              <li className="flex gap-2">
                <svg className="h-4 w-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Stored locally — never uploaded</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
