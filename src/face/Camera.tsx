// Live camera feed with face-detection overlay (cyan bounding box + corner accents).
import { useEffect, useRef } from 'react'
import { useCamera } from './useCamera'
import { detectFace, type DetectedFace } from './faceApi'

interface Props { scanning: boolean; onDetection: (f: DetectedFace | null) => void; hint?: string; className?: string }

export default function Camera({ scanning, onDetection, hint, className }: Props) {
  const { videoRef, ready, error, start, stop } = useCamera()
  const canvasRef     = useRef<HTMLCanvasElement | null>(null)
  const rafRef        = useRef<number | null>(null)
  const processingRef = useRef(false)
  const scanningRef   = useRef(scanning)
  const cbRef         = useRef(onDetection)
  useEffect(() => { scanningRef.current = scanning; if (!scanning) draw(null) }, [scanning])
  useEffect(() => { cbRef.current = onDetection }, [onDetection])
  useEffect(() => { start(); return () => stop() }, [start, stop])

  function draw(face: DetectedFace | null) {
    const c = canvasRef.current, v = videoRef.current
    if (!c || !v) return
    const w = v.videoWidth || 640, h = v.videoHeight || 480
    if (c.width !== w) c.width = w; if (c.height !== h) c.height = h
    const ctx = c.getContext('2d'); if (!ctx) return
    ctx.clearRect(0, 0, w, h)
    if (!face) return
    const { x, y, width: fw, height: fh } = face.box
    const cl = Math.min(fw, fh) * 0.22
    ctx.lineWidth = Math.max(2, w / 240); ctx.strokeStyle = '#22d3ee'
    ctx.strokeRect(x, y, fw, fh)
    ctx.beginPath()
    ctx.moveTo(x, y + cl); ctx.lineTo(x, y); ctx.lineTo(x + cl, y)
    ctx.moveTo(x + fw - cl, y); ctx.lineTo(x + fw, y); ctx.lineTo(x + fw, y + cl)
    ctx.moveTo(x, y + fh - cl); ctx.lineTo(x, y + fh); ctx.lineTo(x + cl, y + fh)
    ctx.moveTo(x + fw - cl, y + fh); ctx.lineTo(x + fw, y + fh); ctx.lineTo(x + fw, y + fh - cl)
    ctx.stroke()
  }

  useEffect(() => {
    let cancelled = false
    const loop = async () => {
      if (cancelled) return
      const v = videoRef.current
      if (scanningRef.current && ready && v && v.readyState >= 2 && !processingRef.current) {
        processingRef.current = true
        try { const f = await detectFace(v); if (!cancelled) { draw(f); cbRef.current(f) } }
        catch { /* non-fatal */ } finally { processingRef.current = false }
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelled = true; if (rafRef.current != null) cancelAnimationFrame(rafRef.current) }
  }, [ready, videoRef])

  return (
    <div className={className}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
        <video ref={videoRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full -scale-x-100 object-cover" />
        {!ready && !error && <div className="absolute inset-0 grid place-items-center text-slate-300"><div className="flex items-center gap-2 text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />Starting camera…</div></div>}
        {ready && !scanning && hint && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-center text-sm text-white">{hint}</div>}
        {error && <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-rose-300">{error}</div>}
      </div>
    </div>
  )
}
