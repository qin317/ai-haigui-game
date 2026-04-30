# AI海龟汤游戏开发指令

## 项目概述
开发一个 AI 海龟汤游戏网站，用户可以选择故事，与 AI 主持人进行对话，通过持续提问来推理故事真相。

项目目标是先完成一个可运行的 MVP 版本，具备基础选题、提问、AI 回答、查看汤底、重新开始等核心流程。

---

## 开发目标
- 搭建一个可运行的前端项目
- 完成游戏大厅、游戏页面、结果页面三大页面
- 接入 AI API，实现“是 / 否 / 无关”式回答
- 保证页面风格统一、交互清晰、代码结构可维护
- 优先完成核心玩法闭环，不做过度扩展

---

## 技术栈
- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- 路由：React Router
- 状态管理：React Hooks（useState、useContext）
- AI API：DeepSeek / 智谱 AI
- 后端：Node.js + Express（后续可接入，前期可先模拟）

---

## 开发规范
- 使用 TypeScript，确保类型安全
- 使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 组件职责单一，尽量保持可复用
- 页面与组件分层清晰
- 关键逻辑添加必要注释
- 尽量避免冗余状态和重复代码
- 前期先使用本地静态数据完成主流程
- 后续再逐步接入后端和真实 AI 接口

---

## 代码风格
- 组件名使用 PascalCase
- 函数名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE
- 类型定义以 `T` 开头，例如 `TStory`、`TMessage`
- 自定义 Hook 以 `use` 开头，例如 `useGameSession`
- 文件名与组件名保持一致
- 保持命名语义清晰，不使用模糊缩写
- 单个组件文件尽量只做一件事

---

## 项目结构要求
```text
src/
├─ components/          # 通用组件
│  ├─ GameCard.tsx
│  ├─ ChatBox.tsx
│  ├─ Message.tsx
│  └─ StoryReveal.tsx
│
├─ pages/               # 页面
│  ├─ Home.tsx
│  ├─ Game.tsx
│  └─ Result.tsx
│
├─ data/                # 本地数据
│  └─ stories.ts
│
├─ types/               # 类型定义
│  └─ index.ts
│
├─ context/             # 全局状态
│  └─ GameContext.tsx
│
├─ utils/               # 工具函数
│  └─ ai.ts
│
├─ App.tsx
└─ main.tsx