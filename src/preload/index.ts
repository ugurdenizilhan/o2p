import { contextBridge, ipcRenderer } from 'electron'
import type {
  AppSettings,
  ChatMessage,
  Transcript,
  VideoAsset
} from '../shared/types'
import type { ClaudeResponse } from '../main/services/claude'

const api = {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
    set: (patch: Partial<AppSettings>): Promise<AppSettings> =>
      ipcRenderer.invoke('settings:set', patch)
  },
  videos: {
    pickAndImport: (): Promise<VideoAsset[]> => ipcRenderer.invoke('videos:pickAndImport'),
    importPaths: (paths: string[]): Promise<VideoAsset[]> =>
      ipcRenderer.invoke('videos:importPaths', paths),
    transcribe: (filePath: string): Promise<Transcript> =>
      ipcRenderer.invoke('videos:transcribe', filePath)
  },
  ai: {
    chat: (history: ChatMessage[], videos: VideoAsset[]): Promise<ClaudeResponse> =>
      ipcRenderer.invoke('ai:chat', { history, videos })
  }
}

contextBridge.exposeInMainWorld('api', api)

export type Api = typeof api
declare global {
  interface Window {
    api: Api
  }
}
