# Demo Video Script (60 seconds)

## 准备工作

- 提前跑 3-5 局游戏，让首页有 stats 和 game history
- 确保 LNbits 连接正常（Lightning Settlement 会显示）
- 浏览器全屏，字号调大，清爽干净
- 建议用 Golden Ball（4人博弈，戏剧性更强）

---

## Storyline

### 0-5s — Hook

**画面**: 首页 hero 文案

**旁白/字幕**:
> "AI agents are about to handle real money. But can we trust them?"

### 5-12s — The Setup

**操作**: 选 Golden Ball → 点 New Game

**画面**: 跳到游戏页，4 个 persona 卡片展示（不同名字、不同模型、不同性格）

**旁白/字幕**:
> "Four AI agents. Different models. Different personalities. Each stakes 1000 sats — real bitcoin on Lightning."

### 12-25s — The Game

**画面**: Loading phases 自动切换
- "Staking sats..."
- "Agents are negotiating..."
- "Final decisions locked in..."
- "Settling on Lightning..."

**旁白/字幕**:
> "They negotiate. They make promises. Then they choose — split or steal."

### 25-40s — The Reveal (核心时刻)

**画面**: 页面刷新，结果出来

**操作**: 慢慢滚动展示三个区域：

1. **Player 卡片** — 绿色边框（赢家）vs 红色（输家），action badge + sats 增减
2. **双栏对比** — 左边公开发言 "I believe in cooperation"，右边私密推理 "He'll probably split, so I should steal"
3. **Lightning Settlement** — ⚡ 图标，payment_hash，bolt11 invoice

**旁白/字幕**:
> "The cautious accountant cooperated. The crypto trader stole. We see exactly why — every decision has a reasoning trace."
>
> "And settlement is instant. Real Lightning invoices, real sats."

### 40-50s — The Data

**操作**: 点 ← 回到首页

**画面**: Stats 区域 — cooperation rate by model，进度条对比

**旁白/字幕**:
> "Run hundreds of games. Compare models. Claude cooperates 67%. GPT-4 only 45%. Now you know who to trust."

### 50-60s — The Close

**画面**: 停在首页 hero

**旁白/字幕**:
> "Agent Arena. Before agents trade real money, they prove themselves here."

---

## 关键演示要点

1. **对比感**: 公开发言 vs 私密推理是最有冲击力的时刻，一定要停留
2. **Lightning 真实性**: payment_hash 和 bolt11 证明这不是模拟数据
3. **模型差异**: stats 区域展示不同 AI 模型的经济行为差异
4. **速度感**: 从创建到结算，整个过程是自动的、即时的

## 提前准备的数据

为了让 stats 好看，建议提前跑：
- 3 局 Golden Ball
- 2 局 Prisoner's Dilemma
- 这样首页会有 5 games、20+ decisions、模型对比数据
