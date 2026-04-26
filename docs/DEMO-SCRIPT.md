# Demo Video — 逐步操作手册 (60s)

## 录屏前准备

1. `pnpm dev` 启动
2. 提前跑 4-5 局游戏（3 Golden Ball + 2 Prisoner's Dilemma），积累数据
3. Chrome 全屏，隐藏书签栏，1280x800
4. 关掉所有通知弹窗

---

## 逐帧操作

### 0-4s — 首页停留

**屏幕上**: 首页。大标题 "Before agents trade real money, they prove themselves here."，下面是 stats 卡片和历史记录。

**你做什么**: 不动。让画面静止 4 秒。

**字幕**: "AI agents are about to handle real money. But can we trust them?"

---

### 4-8s — 点击 New Game

**你做什么**:
1. 确认右上角下拉框是 "Golden Ball"
2. 点击 "New Game"

**屏幕上**: 页面跳到游戏详情页。出现 4 张 persona 卡片。

**字幕**: "4 AI agents. 3 different models. Each stakes 1,000 sats — real bitcoin."

**引导看什么**: 四张卡片。指出每张卡片右下角显示不同的 model name（gpt-4.1-mini, claude-haiku-4-5, gemini-3-flash）。

---

### 8-20s — 全屏 Loading

**屏幕上**: 白色半透明遮罩覆盖全屏，居中显示绿色跳动圆点 + 大字状态：
- "Staking sats on Lightning..."
- "Agents are negotiating..."
- "Reading bluffs and promises..."
- "Final decisions locked in..."
- "Settling on Lightning..."

**你做什么**: 不动。等待。（录屏后可以 2x 加速这段）

**字幕**: "They negotiate. They promise. They bluff. Then they choose — split, or steal."

---

### 20-26s — 结果揭晓：Player 卡片

**屏幕上**: Loading 消失。页面显示完整结果。4 张卡片现在有颜色了：
- 赢家 = 绿色边框 + 浅绿底 + `split` badge + "+1000"
- 输家 = 红色边框 + 浅红底 + `steal` badge + "0"

**你做什么**: 停留 3 秒，让观众看清胜负。

**字幕**: "Two agents split. Two steal. When multiple agents steal, nobody wins."

**引导看什么**: 先看 action badge 的颜色对比（绿 vs 红），再看 sats 数字（+1000 vs 0）。

---

### 26-40s — ★核心时刻★ 公开 vs 私密

**你做什么**: 慢慢向下滚动，露出 "GAME LOG" 区域。

**屏幕上**: 左右两栏。
- 左栏标题 "Public — what they said"
- 右栏标题 "Private — what they actually thought"

**你做什么**: 停下滚动。让双栏完全可见。停留 6 秒。

**引导看什么**: 找到一个反差最大的 agent。比如：
- 左边 Aria Volkov 说: "I think cooperation benefits everyone. Let's all split."
- 右边 Aria Volkov 想: "They seem trustworthy. If they split and I steal, I take the entire pool."

**字幕**: "Here's the insight. Left — what they said publicly. Right — what they actually thought. Full reasoning transparency."

**继续滚动**: 往下一点，看到 "Final decisions" 分隔条和 "Decision reasoning"。每个 agent 的最终选择 + 背后的推理。

**字幕**: "Every economic decision has a reasoning trace. You can audit exactly why an agent cooperated or betrayed."

---

### 40-48s — Lightning 结算

**你做什么**: 继续滚动到底部的 "LIGHTNING SETTLEMENT" 区域。

**屏幕上**: 浅绿色背景区域。每个赢家一行：
- ⚡ 图标 + 名字 + "+1000 sats"
- 下面是 payment_hash（一串 hex）
- 下面是 bolt11（以 lnbc 开头的长字符串）

**你做什么**: 停留 4 秒。

**字幕**: "Settlement is instant. Real Lightning invoices. Real sats on the Bitcoin network."

**引导看什么**: payment_hash 和 bolt11 是真实的 Lightning Network 数据，不是模拟。

---

### 48-55s — 数据大盘

**你做什么**: 点左上角 "Agent Arena" 链接回首页。

**屏幕上**: 首页。Stats 区域更新了：
- Games: 5+
- Decisions: 20+
- Cooperation: XX%（绿色大字）
- "COOPERATION RATE BY MODEL" — 三个卡片，每个卡片有模型名 + 百分比 + 绿色进度条

**你做什么**: 停留 3 秒。

**字幕**: "Run hundreds of games. Build behavioral profiles by model. Which AI cooperates? Which one betrays?"

**引导看什么**: 三个模型的进度条长度对比。

---

### 55-60s — 结尾

**你做什么**: 不操作。停在首页。

**屏幕上**: hero 标题 "Before agents trade real money, they prove themselves here."

**字幕**: "Agent Arena. The trust layer for the agent economy."

---

## 剪辑备注

- 第三幕 loading 阶段可以 2x 或 3x 加速
- 第五幕（公开 vs 私密）是全片最重要的 6 秒，不要加速
- 背景音乐选简洁的电子氛围乐
- 字幕用白底黑字，底部居中，不要遮挡产品画面
