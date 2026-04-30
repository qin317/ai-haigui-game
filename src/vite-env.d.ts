/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OpenAI 兼容接口的 API Key（如 DeepSeek、智谱等） */
  readonly VITE_AI_API_KEY?: string
  /** 兼容 OpenAI 的 API 根地址，默认 https://api.deepseek.com */
  readonly VITE_AI_BASE_URL?: string
  /** 模型名，默认 deepseek-chat */
  readonly VITE_AI_MODEL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
