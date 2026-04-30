/** 主持人标准回答标签（与 PRD 一致） */
export type THostAnswerLabel = '是' | '否' | '无关'

/** 本地题库用：关键词全部命中则采用对应回答，按数组顺序优先匹配 */
export type THostRule = {
  keywords: string[]
  answer: THostAnswerLabel
}

/** 难度分级（与 PRD「难度筛选」扩展一致，MVP 先用于展示与选题） */
export type TStoryDifficulty = '简单' | '中等' | '困难'

/**
 * 海龟汤题目（汤面 surface / 汤底 bottom）
 * `hostRules` 为当前本地主持人逻辑所需，接入后端 AI 后可弱化或移除。
 */
export type TStory = {
  id: string
  title: string
  difficulty: TStoryDifficulty
  surface: string
  bottom: string
  hostRules?: THostRule[]
}

export type TChatRole = 'player' | 'host'

export type TMessage = {
  id: string
  role: TChatRole
  content: string
  createdAt: number
}