export interface Story {
  id: string
  title: string
  difficulty: string
  surface: string
  bottom: string
}

export interface Message {
  role: 'player' | 'host'
  content: string
}

export class ApiError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export async function askAI(
  question: string,
  story: Story,
  messages: Message[] = []
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story,
        messages
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new ApiError(
        `后端接口错误 ${response.status}：${errorData?.error || response.statusText}`,
        'HTTP_ERROR'
      )
    }

    const data = await response.json()

    if (!data.answer) {
      throw new ApiError('后端返回内容为空', 'EMPTY_RESPONSE')
    }

    return data.answer

  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiError('网络连接失败，请检查后端服务器是否启动', 'NETWORK')
    }
    throw new ApiError(`请求失败：${error instanceof Error ? error.message : String(error)}`, 'HTTP_ERROR')
  }
}