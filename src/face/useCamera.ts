// Webcam lifecycle hook — opens the stream on start(), releases on stop()/unmount.
import { useCallback, useEffect, useRef, useState } from 'react'

export function useCamera() {
  const videoRef  = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const start = useCallback(async () => {
    if (streamRef.current) return
    setError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API not available.')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}) }
      setReady(true)
    } catch (e) {
      const err = e as DOMException
      setError(
        err?.name === 'NotAllowedError' ? 'Camera permission denied. Please allow and retry.' :
        err?.name === 'NotFoundError'   ? 'No camera device found.' :
        (err?.message ?? 'Could not access the camera.')
      )
      setReady(false)
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setReady(false)
  }, [])

  useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); streamRef.current = null }, [])

  return { videoRef, ready, error, start, stop }
}
