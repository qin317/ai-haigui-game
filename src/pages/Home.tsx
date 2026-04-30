import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { STORIES } from '../data/stories'

export function Home() {
  const navigate = useNavigate()

  const randomTarget = useMemo(() => {
    if (STORIES.length === 0) return null
    const i = Math.floor(Math.random() * STORIES.length)
    return STORIES[i]!.id
  }, [])

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(67,56,202,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(30,27,75,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_0%_80%,rgba(15,23,42,0.9),transparent)]"
        aria-hidden
      />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:gap-12 lg:py-16">
        <header className="text-center">
          <p className="text-xs font-medium tracking-[0.35em] text-indigo-400/80">
            悬疑 · 推理
          </p>
          <h1 className="mt-3 bg-gradient-to-b from-slate-100 via-slate-200 to-indigo-300/90 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            AI海龟汤
          </h1>
          <div className="mx-auto mt-6 max-w-2xl border-y border-indigo-500/15 bg-slate-950/40 px-4 py-4 text-left shadow-[inset_0_1px_0_0_rgba(99,102,241,0.08)] backdrop-blur-sm sm:px-6 sm:text-center">
            <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
              汤面只是一句话，真相却藏在无数问题之后。选一则故事，向主持人不断追问——
              <span className="text-slate-300"> 他只回答「是」「否」与「无关」。</span>
              你能拼出完整的谜底吗？
            </p>
          </div>
        </header>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={!randomTarget}
            onClick={() => randomTarget && navigate(`/game/${randomTarget}`)}
            className="w-full rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-5 py-2.5 text-sm font-medium text-indigo-100 shadow-lg shadow-indigo-950/40 transition hover:border-indigo-400/50 hover:bg-indigo-950/70 hover:shadow-indigo-900/50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            随机开始一局
          </button>
          <p className="text-center text-xs text-slate-600 sm:text-left">
            从随机题目直接进入，适合想快速来一局的玩家。
          </p>
        </div>

        <section aria-labelledby="lobby-heading">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-slate-800/80 pb-3">
            <h2
              id="lobby-heading"
              className="text-sm font-medium tracking-wide text-slate-300"
            >
              题目大厅
            </h2>
            <span className="text-xs text-slate-600">
              共 {STORIES.length} 则
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {STORIES.map((story) => (
              <GameCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}