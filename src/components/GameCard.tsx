import { Link } from 'react-router-dom'
import type { TStory } from '../types'

type TGameCardProps = {
  story: TStory
}

export function GameCard({ story }: TGameCardProps) {
  return (
    <Link
      to={`/game/${story.id}`}
      className="group block rounded-xl border border-slate-800/90 bg-slate-900/55 p-4 text-left shadow-md shadow-black/25 outline-none ring-0 transition duration-200 ease-out hover:-translate-y-1 hover:border-indigo-500/35 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-indigo-950/30 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
        <h2 className="min-w-0 flex-1 text-lg font-semibold tracking-tight text-slate-50 transition-colors group-hover:text-indigo-100">
          {story.title}
        </h2>
        <span className="shrink-0 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-200">
          {story.difficulty}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 transition-colors group-hover:text-slate-400">
        {story.surface}
      </p>
      <p className="mt-3 text-xs text-slate-600 transition-colors group-hover:text-indigo-300/90">
        点击卡片开始游戏 →
      </p>
    </Link>
  )
}
