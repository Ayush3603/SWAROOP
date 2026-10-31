// Face detection and recognition using @vladmandic/face-api.
// Models are served from /public/models at runtime.
import * as faceapi from '@vladmandic/face-api'

let loaded = false

export async function loadModels(): Promise<void> {
  if (loaded) return
  // tfjs auto-selects WebGL backend in the browser; no manual setBackend needed.
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  ])
  loaded = true
}

export function modelsLoaded(): boolean { return loaded }

export interface DetectedFace {
  score: number
  box: { x: number; y: number; width: number; height: number }
  descriptor: Float32Array
}

const OPTS = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })

export async function detectFace(video: HTMLVideoElement): Promise<DetectedFace | null> {
  if (!loaded) return null
  const r = await faceapi.detectSingleFace(video, OPTS).withFaceLandmarks().withFaceDescriptor()
  if (!r) return null
  const { x, y, width, height } = r.detection.box
  return { score: r.detection.score, box: { x, y, width, height }, descriptor: r.descriptor }
}

export interface EnrolledFace { id: string; descriptor: number[] }

export function matchFace(descriptor: Float32Array, enrolled: EnrolledFace[], threshold = 0.55) {
  if (!enrolled.length) return { id: null, distance: 1 }
  const labeled = enrolled.map((e) => new faceapi.LabeledFaceDescriptors(e.id, [new Float32Array(e.descriptor)]))
  const best = new faceapi.FaceMatcher(labeled, threshold).findBestMatch(descriptor)
  return best.label === 'unknown' ? { id: null, distance: best.distance } : { id: best.label, distance: best.distance }
}
