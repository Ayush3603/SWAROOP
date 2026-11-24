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

export interface FaceDetectionResult {
  faces: DetectedFace[]
  isCrowd: boolean
  singleFace: DetectedFace | null
}

const OPTS = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
const CROWD_THRESHOLD = 2 // More than 2 people = crowd

export async function detectFace(video: HTMLVideoElement): Promise<FaceDetectionResult> {
  if (!loaded) return { faces: [], isCrowd: false, singleFace: null }
  
  // Detect all faces in the frame
  const detections = await faceapi.detectAllFaces(video, OPTS).withFaceLandmarks().withFaceDescriptors()
  
  const faces: DetectedFace[] = detections.map(d => {
    const { x, y, width, height } = d.detection.box
    return { score: d.detection.score, box: { x, y, width, height }, descriptor: d.descriptor }
  })
  
  const isCrowd = faces.length > CROWD_THRESHOLD
  
  // Only return single face if exactly one person detected
  const singleFace = faces.length === 1 ? faces[0] : null
  
  return { faces, isCrowd, singleFace }
}

export interface EnrolledFace { id: string; descriptor: number[] }

export function matchFace(descriptor: Float32Array, enrolled: EnrolledFace[], threshold = 0.55) {
  if (!enrolled.length) return { id: null, distance: 1 }
  const labeled = enrolled.map((e) => new faceapi.LabeledFaceDescriptors(e.id, [new Float32Array(e.descriptor)]))
  const best = new faceapi.FaceMatcher(labeled, threshold).findBestMatch(descriptor)
  return best.label === 'unknown' ? { id: null, distance: best.distance } : { id: best.label, distance: best.distance }
}

// Enhanced face matching with multiple samples
export async function enrollFace(video: HTMLVideoElement, iterations = 5): Promise<Float32Array | null> {
  if (!loaded) return null
  
  const descriptors: Float32Array[] = []
  
  for (let i = 0; i < iterations; i++) {
    await new Promise(resolve => setTimeout(resolve, 200)) // Wait between samples
    
    const detections = await faceapi.detectAllFaces(video, OPTS).withFaceLandmarks().withFaceDescriptors()
    if (detections.length > 0) {
      descriptors.push(detections[0].descriptor)
    }
  }
  
  if (descriptors.length === 0) return null
  
  // Average all descriptors for better accuracy
  const averaged = new Float32Array(128)
  descriptors.forEach(desc => {
    for (let i = 0; i < 128; i++) {
      averaged[i] += desc[i]
    }
  })
  for (let i = 0; i < 128; i++) {
    averaged[i] /= descriptors.length
  }
  
  return averaged
}
