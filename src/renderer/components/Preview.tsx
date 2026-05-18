import { useAppStore } from '../store/useAppStore'

export function Preview() {
  const videos = useAppStore((s) => s.videos)
  const selectedVideoId = useAppStore((s) => s.selectedVideoId)
  const selected = videos.find((v) => v.id === selectedVideoId)

  return (
    <div className="flex flex-1 items-center justify-center border-b border-zinc-800 bg-black p-4">
      {selected ? (
        <video
          key={selected.id}
          src={`file://${selected.filePath}`}
          controls
          className="max-h-full max-w-full"
        />
      ) : (
        <div className="text-center text-sm text-zinc-500">
          <div className="mb-2 text-4xl">▶</div>
          <div>Sol panelden bir video seç</div>
        </div>
      )}
    </div>
  )
}
