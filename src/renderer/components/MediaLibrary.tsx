import { useCallback, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatBytes, formatDuration } from '../lib/format'

export function MediaLibrary() {
  const videos = useAppStore((s) => s.videos)
  const selectedVideoId = useAppStore((s) => s.selectedVideoId)
  const selectVideo = useAppStore((s) => s.selectVideo)
  const addVideos = useAppStore((s) => s.addVideos)
  const [dragging, setDragging] = useState(false)

  const pickFiles = useCallback(async () => {
    const imported = await window.api.videos.pickAndImport()
    if (imported.length > 0) addVideos(imported)
  }, [addVideos])

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const paths = Array.from(e.dataTransfer.files)
        .map((f) => (f as File & { path?: string }).path)
        .filter((p): p is string => Boolean(p))
      if (paths.length === 0) return
      const imported = await window.api.videos.importPaths(paths)
      if (imported.length > 0) addVideos(imported)
    },
    [addVideos]
  )

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Medya
        </h2>
        <button
          onClick={pickFiles}
          className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-white hover:opacity-90"
        >
          + Ekle
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {videos.length === 0 ? (
          <div
            className={`m-4 flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-xs ${
              dragging
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-zinc-700 text-zinc-500'
            }`}
            onClick={pickFiles}
          >
            <span className="text-3xl">+</span>
            <span className="mt-2">Sürükle veya tıkla</span>
            <span className="mt-1 text-zinc-600">mp4, mov, mkv, webm</span>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {videos.map((v) => (
              <li
                key={v.id}
                onClick={() => selectVideo(v.id)}
                className={`cursor-pointer px-4 py-3 hover:bg-zinc-800/60 ${
                  selectedVideoId === v.id ? 'bg-zinc-800/80' : ''
                }`}
              >
                <div className="truncate text-sm">{v.fileName}</div>
                <div className="mt-1 flex justify-between text-xs text-zinc-500">
                  <span>{formatDuration(v.durationSec)}</span>
                  <span>
                    {v.width}×{v.height} · {formatBytes(v.sizeBytes)}
                  </span>
                </div>
                {!v.transcript && (
                  <div className="mt-1 text-xs text-amber-500/80">
                    transkript henüz yok
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
