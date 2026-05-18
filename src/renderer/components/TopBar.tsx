interface Props {
  onOpenSettings: () => void
}

export function TopBar({ onOpenSettings }: Props) {
  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 pl-16">
        <div className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="text-sm font-semibold tracking-wide">o2p</span>
        <span className="text-xs text-zinc-500">· AI video editor</span>
      </div>

      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={onOpenSettings}
          className="rounded-md px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
        >
          Ayarlar
        </button>
      </div>
    </header>
  )
}
