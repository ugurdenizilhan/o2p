import type { AppSettings, ChatMessage, Transcript, VideoAsset } from '@shared/types'

interface ClaudeResponse {
  text: string
  proposedEdl?: import('@shared/types').Edl
}

interface PreloadApi {
  settings: {
    get: () => Promise<AppSettings>
    set: (patch: Partial<AppSettings>) => Promise<AppSettings>
  }
  videos: {
    pickAndImport: () => Promise<VideoAsset[]>
    importPaths: (paths: string[]) => Promise<VideoAsset[]>
    transcribe: (filePath: string) => Promise<Transcript>
  }
  ai: {
    chat: (history: ChatMessage[], videos: VideoAsset[]) => Promise<ClaudeResponse>
  }
}

declare global {
  interface Window {
    api: PreloadApi
  }
}

export {}
