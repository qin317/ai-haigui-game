import { Link, useParams } from 'react-router-dom'
import { StoryReveal } from '../components/StoryReveal'
import { Message } from '../components/Message'
import { getStoryById, STORIES } from '../data/stories'
import { useGameContext } from '../context/GameContext'
import { useState, useEffect } from 'react'

export function Result() {
  const { storyId } = useParams()
  const { messages } = useGameContext()
  const story = storyId ? getStoryById(storyId) : undefined
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  const nextId = 
    STORIES.length > 0
      ? STORIES[Math.floor(Math.random() * STORIES.length)]!.id
      : null

  if (!story) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-400">未找到该题目。</p>
        <Link to="/" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
          返回大厅
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <div className={`transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300">
          ← 返回大厅
        </Link>
      </div>

      <div className={`transition-all duration-1000 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <StoryReveal story={story} />
      </div>

      <section className={`text-left transition-all duration-1000 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-lg font-medium text-slate-200">本局对话回顾</h2>
        <div className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/40 p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">暂无对话记录。</p>
          ) : (
            messages.map((m, index) => (
              <div 
                key={m.id} 
                className={`transition-all duration-500 delay-${index * 100} ${pageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              >
                <Message message={m} />
              </div>
            ))
          )}
        </div>
      </section>

      <div className={`flex flex-wrap gap-3 transition-all duration-1000 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {nextId && (
          <Link
            to={`/game/${nextId}`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/30"
          >
            再来一局
          </Link>
        )}
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/30"
        >
          选题大厅
        </Link>
      </div>
    </main>
  )
}