import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChatBox } from '../components/ChatBox'
import { getStoryById } from '../data/stories'
import { useGameContext } from '../context/GameContext'

export function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { clearMessages } = useGameContext()
  const story = id ? getStoryById(id) : undefined
  const [gameStatus, setGameStatus] = useState<'playing' | 'ended'>('playing')

  useEffect(() => {
    clearMessages()
    setGameStatus('playing')
  }, [id, clearMessages])

  if (!story) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-400">未找到该题目，请从大厅重新选择。</p>
        <Link
          to="/"
          className="mt-6 inline-flex text-sm font-medium text-indigo-400 transition hover:text-indigo-300"
        >
          ← 返回大厅
        </Link>
      </main>
    )
  }

  const resolvedId = story.id

  function goResult() {
    setGameStatus('ended')
    navigate(`/result/${resolvedId}`)
  }

  function confirmReveal() {
    goResult()
  }

  function confirmEnd() {
    setGameStatus('ended')
    navigate('/')
  }

  function confirmGiveUp() {
    setGameStatus('ended')
    navigate('/')
  }

  return (
    <div className="relative min-h-svh">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,rgba(67,56,202,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_60%,rgba(30,27,75,0.2),transparent)]"
        aria-hidden
      />

      <main className="relative mx-auto flex min-h-svh max-w-3xl flex-col px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        <Link
          to="/"
          className="shrink-0 text-sm text-indigo-400/90 transition hover:text-indigo-300"
          onClick={confirmGiveUp}
        >
          ← 返回大厅
        </Link>

        <header className="mt-6 shrink-0 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              {story.title}
            </h1>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-indigo-400/70">
              {story.difficulty}
            </p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-600">
              游戏状态：{gameStatus === 'playing' ? '进行中' : '已结束'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/90 bg-slate-900/50 p-4 shadow-inner shadow-black/20 backdrop-blur-sm sm:p-5">
            <p className="text-xs font-medium text-indigo-200/85">汤面</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              {story.surface}
            </p>
          </div>
        </header>

        <section
          className="mt-8 min-h-0 flex-1"
          aria-label="与主持人对话"
        >
          <ChatBox story={story} />
        </section>

        <footer className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs text-slate-600 sm:max-w-[14rem]">
            推理告一段落时，可揭晓汤底或结束本局。
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={confirmReveal}
              disabled={gameStatus === 'ended'}
              className="rounded-lg border border-amber-500/45 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:border-amber-400/55 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              查看汤底
            </button>
            <button
              type="button"
              onClick={confirmEnd}
              disabled={gameStatus === 'ended'}
              className="rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              结束游戏
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}