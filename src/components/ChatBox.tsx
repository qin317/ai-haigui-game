import { useState } from 'react'
import { useGameContext } from '../context/GameContext'
import { askHost, ApiError } from '../utils/ai'
import type { Story } from '../api'

function ThinkingMessage() {
  return (
    <div className="flex w-full items-end gap-2.5 flex-row">
      <div
        className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold ring-2 ring-offset-2 ring-offset-slate-950 bg-slate-800 text-indigo-100 ring-slate-600/45"
        aria-hidden
        title="主持人"
      >
        <svg
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z" />
        </svg>
      </div>
      <div className="max-w-[min(85%,28rem)] min-w-0 rounded-2xl rounded-bl-md border border-slate-600/60 bg-slate-800/95 text-slate-100 shadow-black/25 px-3.5 py-2.5 text-sm leading-relaxed">
        <div className="flex items-center gap-1">
          <span className="animate-bounce">●</span>
          <span className="animate-bounce delay-75">●</span>
          <span className="animate-bounce delay-150">●</span>
          <span className="ml-1">思考中…</span>
        </div>
      </div>
    </div>
  )
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'MISSING_KEY':
        return '请先配置 API Key 才能使用 AI 功能'
      case 'NETWORK':
        return '网络连接失败，请检查网络'
      case 'HTTP_ERROR':
        return 'AI 服务请求失败，请稍后重试'
      case 'PARSE_ERROR':
        return 'AI 响应解析失败，请重试'
      case 'EMPTY_RESPONSE':
        return 'AI 回复为空，请重试'
      case 'INVALID_RESPONSE':
        return '后端返回格式错误，请重试'
      default:
        return '回答失败，请重试'
    }
  }
  return '回答失败，请重试'
}

export function ChatBox({ story }: { story: Story }) {
  const { messages, appendMessage } = useGameContext()
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isSending) return

    const question = input.trim()
    setInput('')
    setError('')
    setIsSending(true)

    appendMessage({ role: 'player', content: question })

    try {
      // 传递对话历史给 AI
      const answer = await askHost(question, story, messages)
      appendMessage({ role: 'host', content: answer })
    } catch (err) {
      console.error('发送消息失败:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full items-end gap-2.5 ${msg.role === 'player' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold ring-2 ring-offset-2 ring-offset-slate-950 ${msg.role === 'player' ? 'bg-indigo-600 text-indigo-50 ring-indigo-400/50' : 'bg-slate-800 text-indigo-100 ring-slate-600/45'}`}
              aria-hidden
              title={msg.role === 'player' ? '你' : '主持人'}
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {msg.role === 'player' ? (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2v-6zm0 8h2v2h-2v-2z" />
                ) : (
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z" />
                )}
              </svg>
            </div>
            <div
              className={`max-w-[min(85%,28rem)] min-w-0 rounded-2xl ${msg.role === 'player' ? 'rounded-br-md' : 'rounded-bl-md'} border ${msg.role === 'player' ? 'border-indigo-500/40' : 'border-slate-600/60'} bg-${msg.role === 'player' ? 'indigo-500/10' : 'slate-800/95'} text-${msg.role === 'player' ? 'indigo-50' : 'slate-100'} shadow-black/25 px-3.5 py-2.5 text-sm leading-relaxed`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {isSending && <ThinkingMessage />}
        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          placeholder="输入你的问题…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
          className="flex-1 rounded-lg border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="shrink-0 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:border-indigo-400/50 hover:bg-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </form>
    </div>
  )
}