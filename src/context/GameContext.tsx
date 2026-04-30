import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TMessage } from '../types'

type TGameContextValue = {
  messages: TMessage[]
  appendMessage: (message: Omit<TMessage, 'id' | 'createdAt'>) => void
  clearMessages: () => void
}

const GameContext = createContext<TGameContextValue | null>(null)

function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<TMessage[]>([])

  const appendMessage = useCallback(
    (message: Omit<TMessage, 'id' | 'createdAt'>) => {
      const next: TMessage = {
        ...message,
        id: createId(),
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, next])
    },
    [],
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  const value = useMemo(
    () => ({ messages, appendMessage, clearMessages }),
    [messages, appendMessage, clearMessages],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGameContext(): TGameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return ctx
}
