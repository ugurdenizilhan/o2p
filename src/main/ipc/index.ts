import { ipcMain, dialog, BrowserWindow } from 'electron'
import { nanoid } from 'nanoid'
import { probe } from '../services/ffmpeg'
import { transcribeFile } from '../services/whisper'
import { chat } from '../services/claude'
import { settingsStore } from '../store'
import type {
  AppSettings,
  ChatMessage,
  VideoAsset
} from '@shared/types'

export function registerIpcHandlers() {
  // --- Ayarlar ---
  ipcMain.handle('settings:get', () => settingsStore.store)
  ipcMain.handle('settings:set', (_e, patch: Partial<AppSettings>) => {
    for (const [k, v] of Object.entries(patch)) {
      settingsStore.set(k as keyof AppSettings, v as never)
    }
    return settingsStore.store
  })

  // --- Video içe aktarma ---
  ipcMain.handle('videos:pickAndImport', async () => {
    const win = BrowserWindow.getFocusedWindow() ?? undefined
    const result = await dialog.showOpenDialog(win!, {
      title: 'Video dosyalarını seç',
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Video', extensions: ['mp4', 'mov', 'mkv', 'webm', 'avi'] }]
    })
    if (result.canceled) return []
    return Promise.all(result.filePaths.map(importPath))
  })

  ipcMain.handle('videos:importPaths', async (_e, paths: string[]) => {
    return Promise.all(paths.map(importPath))
  })

  // --- Transkripsiyon ---
  ipcMain.handle('videos:transcribe', async (_e, filePath: string) => {
    const lang = settingsStore.get('whisperLanguage')
    const model = settingsStore.get('whisperModel')
    return transcribeFile(filePath, { language: lang, model })
  })

  // --- AI sohbet ---
  ipcMain.handle('ai:chat', async (_e, payload: { history: ChatMessage[]; videos: VideoAsset[] }) => {
    return chat(payload.history, payload.videos)
  })
}

async function importPath(filePath: string): Promise<VideoAsset> {
  const meta = await probe(filePath)
  const fileName = filePath.split(/[\\/]/).pop() ?? filePath
  return {
    id: nanoid(),
    filePath,
    fileName,
    durationSec: meta.durationSec,
    width: meta.width,
    height: meta.height,
    fps: meta.fps,
    sizeBytes: meta.sizeBytes,
    importedAt: Date.now()
  }
}
