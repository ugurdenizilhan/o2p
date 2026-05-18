import { create } from 'zustand'
import type {
  AppSettings,
  ChatMessage,
  Edl,
  EdlClip,
  VideoAsset
} from '@shared/types'

interface AppState {
  // Medya kütüphanesi
  videos: VideoAsset[]
  selectedVideoId: string | null

  // Timeline / EDL
  edl: Edl

  // Chat
  messages: ChatMessage[]
  chatBusy: boolean

  // Ayarlar
  settings: AppSettings | null

  // Aksiyonlar
  addVideos: (vs: VideoAsset[]) => void
  selectVideo: (id: string | null) => void
  updateVideo: (id: string, patch: Partial<VideoAsset>) => void
  setEdl: (edl: Edl) => void
  appendClip: (clip: EdlClip) => void
  removeClip: (clipId: string) => void
  addMessage: (msg: ChatMessage) => void
  setChatBusy: (busy: boolean) => void
  setSettings: (s: AppSettings) => void
}

const emptyEdl: Edl = {
  outputWidth: 1920,
  outputHeight: 1080,
  fps: 30,
  clips: []
}

export const useAppStore = create<AppState>((set) => ({
  videos: [],
  selectedVideoId: null,
  edl: emptyEdl,
  messages: [],
  chatBusy: false,
  settings: null,

  addVideos: (vs) =>
    set((s) => ({
      videos: [...s.videos, ...vs],
      selectedVideoId: s.selectedVideoId ?? vs[0]?.id ?? null
    })),

  selectVideo: (id) => set({ selectedVideoId: id }),

  updateVideo: (id, patch) =>
    set((s) => ({
      videos: s.videos.map((v) => (v.id === id ? { ...v, ...patch } : v))
    })),

  setEdl: (edl) => set({ edl }),

  appendClip: (clip) =>
    set((s) => ({ edl: { ...s.edl, clips: [...s.edl.clips, clip] } })),

  removeClip: (clipId) =>
    set((s) => ({
      edl: { ...s.edl, clips: s.edl.clips.filter((c) => c.id !== clipId) }
    })),

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  setChatBusy: (busy) => set({ chatBusy: busy }),

  setSettings: (settings) => set({ settings })
}))
