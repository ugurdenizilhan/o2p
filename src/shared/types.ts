// Ana proces (Electron main) ile renderer (React) arasında paylaşılan tipler.
// IPC üzerinden geçen tüm veri yapıları burada tanımlanır.

export type VideoId = string

export interface VideoAsset {
  id: VideoId
  filePath: string
  fileName: string
  durationSec: number
  width: number
  height: number
  fps: number
  sizeBytes: number
  // Akıcı önizleme için üretilen düşük çözünürlüklü kopya
  proxyPath?: string
  // Whisper ile çıkarılmış transkript (varsa)
  transcript?: Transcript
  importedAt: number
}

export interface Transcript {
  language: string
  segments: TranscriptSegment[]
}

export interface TranscriptSegment {
  startSec: number
  endSec: number
  text: string
}

// Edit Decision List — timeline'ın serileştirilmiş hali.
// AI doğal dil komutunu bu yapıya çevirir, render motoru bunu okur.
export interface Edl {
  outputWidth: number
  outputHeight: number
  fps: number
  clips: EdlClip[]
}

export interface EdlClip {
  id: string
  sourceVideoId: VideoId
  inSec: number
  outSec: number
  // İleride eklenecek: transition, effects, overlay
  transitionIn?: 'cut' | 'fade'
  transitionOut?: 'cut' | 'fade'
}

export type RenderQuality = '1080p' | '2k'

export interface RenderJob {
  id: string
  edl: Edl
  quality: RenderQuality
  outputPath: string
}

export interface RenderProgress {
  jobId: string
  percent: number
  framesDone: number
  totalFrames: number
  speed: string // örn "2.4x"
  etaSec: number
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  // AI tarafından üretilmiş EDL değişiklik önerisi (varsa)
  proposedEdl?: Edl
  timestamp: number
}

export interface AppSettings {
  anthropicApiKey?: string
  defaultQuality: RenderQuality
  whisperModel: 'tiny' | 'base' | 'small' | 'medium' | 'large-v3'
  whisperLanguage: string // örn 'tr'
}
