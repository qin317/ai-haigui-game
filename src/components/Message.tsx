import type { TMessage } from '../types'

type TMessageProps = {
  message: Pick<TMessage, 'role' | 'content'>
}

function IconUser(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

function IconHost(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm0 8h2v2h-2v-2z" />
    </svg>
  )
}

export function Message({ message }: TMessageProps) {
  const isPlayer = message.role === 'player'

  return (
    <div
      className={`flex w-full items-end gap-2.5 ${
        isPlayer ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold ring-2 ring-offset-2 ring-offset-slate-950 ${
          isPlayer
            ? 'bg-indigo-600 text-white ring-indigo-500/35'
            : 'bg-slate-800 text-indigo-100 ring-slate-600/45'
        }`}
        aria-hidden
        title={isPlayer ? '玩家' : '主持人'}
      >
        {isPlayer ? (
          <IconUser className="h-[18px] w-[18px]" />
        ) : (
          <IconHost className="h-[18px] w-[18px]" />
        )}
      </div>

      <div
        className={`max-w-[min(85%,28rem)] min-w-0 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-md ${
          isPlayer
            ? 'rounded-br-md border border-indigo-500/35 bg-indigo-600 text-white shadow-indigo-950/35'
            : 'rounded-bl-md border border-slate-600/60 bg-slate-800/95 text-slate-100 shadow-black/25'
        }`}
      >
        <span className="sr-only">{isPlayer ? '玩家：' : '主持人：'}</span>
        {message.content}
      </div>
    </div>
  )
}
