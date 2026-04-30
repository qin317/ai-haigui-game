import { askAI, type Message, type Story } from '../api'

export async function askHost(
  question: string,
  story: Story,
  messages: Message[] = []
): Promise<string> {
  try {
    const answer = await askAI(question, story, messages)
    return answer
  } catch (error) {
    console.error('AI 请求失败:', error)
    throw error
  }
}

export { ApiError } from '../api'