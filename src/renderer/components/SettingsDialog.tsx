import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { AppSettings, RenderQuality } from '@shared/types'

interface Props {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: Props) {
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)
  const [draft, setDraft] = useState<AppSettings | null>(settings)

  useEffect(() => setDraft(settings), [settings])

  if (!open || !draft) return null

  const save = async () => {
    const updated = await window.api.settings.set(draft)
    setSettings(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[460px] rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <h3 className="mb-4 text-base font-semibold">Ayarlar</h3>

        <div className="space-y-4">
          <Field label="Claude API anahtarı" hint="console.anthropic.com → API Keys">
            <input
              type="password"
              value={draft.anthropicApiKey ?? ''}
              onChange={(e) => setDraft({ ...draft, anthropicApiKey: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </Field>

          <Field label="Varsayılan render kalitesi">
            <select
              value={draft.defaultQuality}
              onChange={(e) =>
                setDraft({ ...draft, defaultQuality: e.target.value as RenderQuality })
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="1080p">1080p (Full HD)</option>
              <option value="2k">2K</option>
            </select>
          </Field>

          <Field label="Whisper modeli" hint="büyük model = doğru ama yavaş">
            <select
              value={draft.whisperModel}
              onChange={(e) =>
                setDraft({ ...draft, whisperModel: e.target.value as AppSettings['whisperModel'] })
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="tiny">tiny (en hızlı)</option>
              <option value="base">base (önerilen)</option>
              <option value="small">small</option>
              <option value="medium">medium</option>
              <option value="large-v3">large-v3 (en doğru)</option>
            </select>
          </Field>

          <Field label="Transkript dili">
            <input
              type="text"
              value={draft.whisperLanguage}
              onChange={(e) => setDraft({ ...draft, whisperLanguage: e.target.value })}
              placeholder="tr"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800"
          >
            İptal
          </button>
          <button
            onClick={save}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  children
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-300">{label}</label>
      {children}
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  )
}
