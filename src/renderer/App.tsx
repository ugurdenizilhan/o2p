import { useEffect, useState } from 'react'
import { MediaLibrary } from './components/MediaLibrary'
import { Preview } from './components/Preview'
import { Timeline } from './components/Timeline'
import { ChatPanel } from './components/ChatPanel'
import { SettingsDialog } from './components/SettingsDialog'
import { TopBar } from './components/TopBar'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const setSettings = useAppStore((s) => s.setSettings)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    window.api.settings.get().then(setSettings)
  }, [setSettings])

  return (
    <div className="flex h-full flex-col">
      <TopBar onOpenSettings={() => setSettingsOpen(true)} />

      <div className="flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 border-r border-zinc-800 bg-zinc-900/40">
          <MediaLibrary />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col">
            <Preview />
            <Timeline />
          </div>
        </main>

        <aside className="w-96 shrink-0 border-l border-zinc-800 bg-zinc-900/40">
          <ChatPanel />
        </aside>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
