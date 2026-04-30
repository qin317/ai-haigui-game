import { useState, useEffect } from 'react'
import type { TStory } from '../types'

type TStoryRevealProps = {
  story: TStory
}

export function StoryReveal({ story }: TStoryRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true)
    }, 500)
    
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 1000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <section 
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-slate-900/80 p-6 text-left shadow-lg transition-all duration-1000 ${revealed ? 'shadow-amber-900/20' : 'shadow-black/20'}`}
    >
      <div className={`flex flex-col items-center justify-center gap-2 transition-all duration-700 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`w-16 h-1 bg-amber-500 rounded-full transition-all duration-1000 ${revealed ? 'w-32' : 'w-0'}`}></div>
        <p className="text-xs font-medium uppercase tracking-wider text-amber-200/90">
          汤底揭晓
        </p>
        <div className={`w-16 h-1 bg-amber-500 rounded-full transition-all duration-1000 ${revealed ? 'w-32' : 'w-0'}`}></div>
      </div>
      
      <div className={`mt-6 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">{story.title}</h2>
        <div className="mt-4 whitespace-pre-wrap text-slate-200 leading-relaxed space-y-4">
          {story.bottom.split('\n').map((paragraph, index) => (
            <p 
              key={index} 
              className={`transition-all duration-700 delay-${index * 200} ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}