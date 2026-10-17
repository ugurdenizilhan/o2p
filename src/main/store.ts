import Store from 'electron-store'
import type { AppSettings } from '@shared/types'

const defaults: AppSettings = {
  defaultQuality: '1080p',
  whisperModel: 'base',
  whisperLanguage: 'tr'
}

export const settingsStore = new Store<AppSettings>({
  name: 'settings',
  defaults
})
