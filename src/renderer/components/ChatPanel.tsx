import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export function ChatPanel() {
  const messages = useAppStore((s) => s.messages)
  const chatBusy = useAppStore((s) => s.chatBusy)
  const videos = useAppStore((s) => s.videos)
  const addMessage = useAppStore((s) => s.addMessage)
  const setChatBusy = useAppStore((s) => s.setChatBusy)
  const setEdl = useAppStore((s) => s.setEdl)
  const [input, setInput] = useState('')

  const send = async () => {
    const text = input.trim()
    if (!text || chatBusy) return
    setInput('')

    const userMsg = { role: 'user' as const, content: text, timestamp: Date.now() }
    addMessage(userMsg)
    setChatBusy(true)

    try {
      const history = [...messages, userMsg]
      const res = await window.api.ai.chat(history, videos)
      addMessage({
        role: 'assistant',
        content: res.text,
        proposedEdl: res.proposedEdl,
        timestamp: Date.now()
      })
      if (res.proposedEdl) setEdl(res.proposedEdl)
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: `Hata: ${(err as Error).message}`,
        timestamp: Date.now()
      })
    } finally {
      setChatBusy(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Sohbet ile Düzenle
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="space-y-3 text-xs text-zinc-500">
            <p>Doğal dilde komut ver:</p>
            <ul className="ml-4 list-disc space-y-1 text-zinc-400">
              <li>"motor1'den 'arkadaşlar bugün' ile 'gaza basıyorum' arasını al"</li>
              <li>"reklam2'yi 5. saniyeden başlayarak araya koy"</li>
              <li>"motor3'ün 02:15-04:30 arasını sona ekle"</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-3 py-2 ${
                  m.role === 'user'
                    ? 'ml-6 bg-accent/20 text-zinc-100'
                    : 'mr-6 bg-zinc-800/60 text-zinc-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.proposedEdl && (
                  <div className="mt-2 text-xs text-emerald-400">
                    ✓ Timeline güncellendi · {m.proposedEdl.clips.length} klip
                  </div>
                )}
              </div>
            ))}
            {chatBusy && (
              <div className="mr-6 rounded-lg bg-zinc-800/60 px-3 py-2 text-xs text-zinc-400">
                Düşünüyor…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 p-3">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                send()
              }
            }}
            placeholder={
              videos.length === 0
                ? 'Önce video ekle…'
                : 'Komut yaz (⌘+Enter ile gönder)'
            }
            rows={3}
            disabled={videos.length === 0 || chatBusy}
            className="flex-1 resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-accent focus:outline-none disabled:opacity-50"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-zinc-500">
          <span>{videos.length} video kütüphanede</span>
          <button
            onClick={send}
            disabled={!input.trim() || chatBusy || videos.length === 0}
            className="rounded-md bg-accent px-3 py-1 font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  )
}
