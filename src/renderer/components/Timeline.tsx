import { useAppStore } from '../store/useAppStore'
import { formatDuration } from '../lib/format'

export function Timeline() {
  const edl = useAppStore((s) => s.edl)
  const videos = useAppStore((s) => s.videos)
  const removeClip = useAppStore((s) => s.removeClip)

  const totalSec = edl.clips.reduce((acc, c) => acc + (c.outSec - c.inSec), 0)

  return (
    <div className="h-48 shrink-0 border-t border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Timeline
        </h2>
        <div className="text-xs text-zinc-500">
          {edl.clips.length} klip · toplam {formatDuration(totalSec)}
        </div>
      </div>

      <div className="h-[calc(100%-2.5rem)] overflow-x-auto p-3">
        {edl.clips.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Sağ paneldeki sohbete komut yazınca buraya klipler düşer.
          </div>
        ) : (
          <div className="flex h-full items-stretch gap-1">
            {edl.clips.map((c) => {
              const v = videos.find((x) => x.id === c.sourceVideoId)
              const dur = c.outSec - c.inSec
              const width = Math.max(80, dur * 8)
              return (
                <div
                  key={c.id}
                  style={{ width }}
                  className="group relative flex flex-col justify-between rounded-md border border-accent/40 bg-accent/20 px-2 py-1.5"
                >
                  <div className="truncate text-xs font-medium text-zinc-100">
                    {v?.fileName ?? '?'}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {formatDuration(c.inSec)} → {formatDuration(c.outSec)}
                  </div>
                  <button
                    onClick={() => removeClip(c.id)}
                    className="absolute right-1 top-1 hidden h-5 w-5 rounded text-xs text-zinc-300 hover:bg-red-500/30 group-hover:block"
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
