// 导入 express 框架
const express = require('express');
// 导入 cors 中间件，用于处理跨域请求
const cors = require('cors');
// 导入 dotenv 用于读取环境变量
require('dotenv').config();

// 创建 express 应用实例
const app = express();
// 定义服务器监听的端口号
const PORT = process.env.PORT || 3000;

// 配置 CORS 中间件
// 允许所有来源的请求（开发环境使用，生产环境应配置具体域名）
app.use(cors());

// 配置 express 内置的中间件，用于解析 JSON 格式的请求体
app.use(express.json());

// 配置 express 内置的中间件，用于解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// 创建一个测试接口
// GET 请求 /api/test
app.get('/api/test', (req, res) => {
  // 发送 JSON 响应
  res.json({
    message: '服务器响应成功！',
    timestamp: new Date().toISOString(),
    status: 'success'
  });
});

// 创建聊天接口
// POST 请求 /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    // 验证请求体
    const { question, story, messages } = req.body;
    if (!question || !story) {
      console.error('缺少必要参数:', { question: !!question, story: !!story });
      return res.status(400).json({ error: '缺少必要参数：question 或 story' });
    }
    
    // 验证 story 结构
    if (!story.title || !story.surface || !story.bottom) {
      console.error('story 结构不完整:', { 
        title: !!story.title, 
        surface: !!story.surface, 
        bottom: !!story.bottom 
      });
      return res.status(400).json({ error: 'story 结构不完整，需要包含 title、surface、bottom' });
    }
    
    // 读取环境变量中的 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('未配置 DEEPSEEK_API_KEY 环境变量');
      return res.status(500).json({ error: '未配置 DEEPSEEK_API_KEY 环境变量' });
    }
    
    // 构建系统提示词
    const systemPrompt = `你是「海龟汤」游戏的主持人。你知道本题的完整汤底，但绝不能向玩家直接说出汤底内容或关键剧透。

对玩家的每一个问题，你必须先根据汤底判断真伪与相关性，然后只使用下列标准回答之一作为回复主体（可单独一行，或后接极短补充，但补充不得泄露答案）：

- 是：问题在逻辑上与汤底一致、可判定为真。
- 否：问题与汤底矛盾，或根据汤底可以判断为不成立。
- 无关：问题和推理真相没有关系，无法据此判断真假。

若玩家问题空泛、有歧义或无法据此判断，可回答：问题不够明确，请换一种问法。

### 关键规则：
1. 语义相近的问题必须给出一致回答
2. "之前 / 原本 / 原来 / 曾经"属于相近表达，应视为同一问题
3. 必须参考对话历史，避免前后矛盾
4. 绝对不能透露汤底的任何关键信息
5. 不能添加任何额外解释或描述
6. 回答必须简短，不超过10个字
7. 如果无法判断，直接回答「问题不够明确，请换一种问法」

### 示例问答：
玩家：这个人是自杀吗？
主持人：是

玩家：他是被谋杀的吗？
主持人：否

玩家：今天天气好吗？
主持人：无关

玩家：他为什么死了？
主持人：问题不够明确，请换一种问法

玩家：储藏室里之前有人吗？
主持人：否

玩家：储藏室原本有人吗？
主持人：否

玩家：储藏室原来有人吗？
主持人：否

### 注意事项：
1. 必须严格按照上述格式回答，只能使用「是」「否」「无关」或「问题不够明确，请换一种问法」
2. 禁止输出完整汤底、禁止复述汤底中的关键情节链条；禁止脱离本题汤面与汤底编造新设定。`;
    
    // 构建用户消息
    let userMessage = `【题目】${story.title}
【难度】${story.difficulty || '中等'}

【汤面】（玩家可见）
${story.surface}

【汤底】（仅主持人已知，严禁在回复中向玩家透露）
${story.bottom}

【玩家问题】
${question.trim()}

请严格按系统提示，只给出符合规则的简短回答。`;
    
    // 如果有对话历史，添加到用户消息中
    if (messages && messages.length > 0) {
      const history = messages.map((msg, index) => {
        const role = msg.role === 'player' ? '玩家' : '主持人';
        return `${role}：${msg.content}`;
      }).join('\n');
      userMessage += `

【对话历史】
${history}`;
    }
    
    // 记录请求日志
    console.log(`[${new Date().toISOString()}] 收到请求：题目=${story.title}，问题=${question}`);
    
    // 调用 DeepSeek API
    const response = await fetch(process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0,
        max_tokens: 20
      })
    });
    
    // 处理 API 响应
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('DeepSeek API 请求失败:', { 
        status: response.status, 
        error: errorData?.error?.message || response.statusText 
      });
      return res.status(response.status).json({ 
        error: 'DeepSeek API 请求失败', 
        details: errorData?.error?.message || response.statusText 
      });
    }
    
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || '无关';
    
    // 归一化回答
    const normalizedAnswer = normalizeAnswer(answer);
    
    // 记录响应日志
    console.log(`[${new Date().toISOString()}] 返回结果：题目=${story.title}，问题=${question}，回答=${normalizedAnswer}`);
    
    // 返回结果
    res.json({ answer: normalizedAnswer });
    
  } catch (error) {
    console.error('聊天接口错误:', error);
    res.status(500).json({ error: '服务器内部错误', details: error.message });
  }
});

// 归一化回答
function normalizeAnswer(raw) {
  const t = raw.trim();
  
  // 处理问题不够明确的情况
  if (t.includes('问题不够明确')) {
    return '问题不够明确，请换一种问法';
  }
  
  // 匹配标准回答
  const match = t.match(/(是|否|无关)/);
  if (match) {
    return match[1];
  }
  
  // 处理不规范回答，默认返回无关
  console.warn('不规范回答，已归一化为无关:', raw);
  return '无关';
}

// 启动服务器，监听指定端口
app.listen(PORT, () => {
  console.log(`服务器正在运行，访问地址：http://localhost:${PORT}`);
  console.log(`测试接口地址：http://localhost:${PORT}/api/test`);
  console.log(`聊天接口地址：http://localhost:${PORT}/api/chat`);
});