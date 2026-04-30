// 验证问题是否有效
function isValidQuestion(question) {
  const q = question.trim();
  
  if (!q) return false;
  
  // 纯数字
  if (/^\d+$/.test(q)) return false;
  
  // 纯符号（如 "？""。"""!" 等）
  if (/^[？。.!！]+$/.test(q)) return false;
  
  // 单个字符且不是中文或问号结尾的有效问题
  if (q.length <= 2 && !/[\u4e00-\u9fa5]/.test(q) && !q.includes('?')) {
    // 允许简短的有效问题如 "有人吗?""他在哪?"
    if (!q.endsWith('?') && !q.endsWith('？') && !q.endsWith('吗') && !q.endsWith('么')) {
      return false;
    }
  }
  
  // 纯字母
  if (/^[a-zA-Z]+$/.test(q)) return false;
  
  return true;
}

// 归一化回答
function normalizeAnswer(raw) {
  const t = raw.trim();
  
  // 1. 优先处理问题不够明确的情况
  if (t.includes('问题不够明确')) {
    return '问题不够明确，请换一种问法';
  }
  
  // 2. 检查否定表达 - 优先判断"否"
  // 否定关键词列表（按优先级排序，精确匹配优先）
  const negativePatterns = [
    { pattern: /^否$/, answer: '否' },                    // 纯"否"
    { pattern: /^(不是|并不是|不对|没有|不能|不存在|并未|并未曾|并未有)/, answer: '否' },  // 否定词开头
    { pattern: /(不是|并不是|不对|没有|不能|不存在|并未)/, answer: '否' },  // 否定词在任何位置
  ];
  
  for (const { pattern, answer } of negativePatterns) {
    if (pattern.test(t)) {
      return answer;
    }
  }
  
  // 3. 检查肯定表达 - 判断"是"
  // 肯定关键词列表
  const positivePatterns = [
    { pattern: /^是$/, answer: '是' },                    // 纯"是"
    { pattern: /^(是的|是的，|是对)/, answer: '是' },    // "是"开头
    { pattern: /^(对|对的|对，)/, answer: '是' },        // "对"开头
    { pattern: /^(有|有的|有，)/, answer: '是' },        // "有"开头
    { pattern: /(是|是的|对|对的|有|有的)/, answer: '是' },  // 肯定词在任何位置
  ];
  
  for (const { pattern, answer } of positivePatterns) {
    if (pattern.test(t)) {
      return answer;
    }
  }
  
  // 4. 检查"无关"关键词
  if (t.includes('无关')) {
    return '无关';
  }
  
  // 5. 无法判断，默认返回无关
  console.warn('不规范回答，已归一化为无关:', raw);
  return '无关';
}

// 处理 POST 请求
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 验证请求体
    const { question, story } = req.body;
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
    
    // 验证问题有效性
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      console.error('问题为空或无效');
      return res.status(400).json({ error: '问题不能为空' });
    }
    
    if (trimmedQuestion.length > 200) {
      console.error('问题过长:', trimmedQuestion.length);
      return res.status(400).json({ error: '问题长度不能超过200个字符' });
    }
    
    // 检查问题是否包含非法内容
    const invalidPatterns = ['汤底', '答案', '剧透', '告诉我答案', '泄露'];
    const hasInvalidContent = invalidPatterns.some(pattern => 
      trimmedQuestion.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (hasInvalidContent) {
      console.error('问题包含非法内容');
      return res.status(400).json({ error: '问题中不能包含试图获取答案的内容' });
    }
    
    // 检查问题是否有效（纯数字、纯符号等无效问题）
    if (!isValidQuestion(question)) {
      console.log('无效问题，直接返回提示:', question);
      return res.json({ answer: '问题不够明确，请换一种问法' });
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
    if (req.body.messages && req.body.messages.length > 0) {
      const history = req.body.messages.map((msg, index) => {
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
}