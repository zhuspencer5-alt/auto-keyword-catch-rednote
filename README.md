# 🎯 小红书/公众号内容关键词分析工具

一个基于 AI 的内容分析工具，支持解析小红书笔记和微信公众号文章，自动提取核心关键词、阅读量和评论数。

## ✨ 核心功能

- 📊 **链接解析**：自动解析小红书和公众号文章链接
- 🤖 **AI 关键词提取**：使用 Claude Sonnet 4.5 智能提取核心关键词
- 📈 **数据展示**：显示文章阅读量、评论数等关键指标
- 🎨 **现代化 UI**：基于 TailwindCSS 的美观界面
- ⚡ **快速部署**：轻量级架构，易于部署和维护

## 🛠️ 技术栈

- **前端**：HTML + JavaScript + TailwindCSS
- **后端**：Node.js + Express
- **AI**：Claude Sonnet 4.5 (Anthropic API)
- **部署**：支持 Vercel、Netlify 等多种平台

## 📦 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd auto-keyword-catch-rednote
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `env.example` 文件并重命名为 `.env`：

```bash
cp env.example .env
```

编辑 `.env` 文件，填入你的 API 密钥：

```env
# Claude API 配置（必需）
SONNET_API_KEY=your_anthropic_api_key_here
SONNET_API_ENDPOINT=https://api.anthropic.com/v1/messages

# 第三方解析 API（可选，未配置时使用模拟数据）
THIRD_PARTY_API_KEY=your_third_party_api_key_here

# 服务器端口
PORT=3000
```

### 4. 启动服务

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm start
```

访问 `http://localhost:3000` 即可使用！

## 🔑 API 密钥获取

### Claude API（必需）

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 创建 API Key
4. 将密钥填入 `.env` 文件的 `SONNET_API_KEY`

### 第三方解析 API（可选）

**小红书解析服务：**
- [芝士数据](https://www.zhishidata.com/)
- [蝉妈妈](https://www.chanmama.com/)
- [新红数据](https://www.newrank.cn/)

**公众号解析服务：**
- [新榜](https://www.newrank.cn/)
- [清博指数](https://www.gsdata.cn/)
- [微小宝](https://www.wxb.com/)

**注意**：如果未配置第三方 API，系统会使用模拟数据进行演示。

## 📖 使用说明

1. **输入链接**：复制小红书笔记或公众号文章的完整链接
2. **点击分析**：粘贴到输入框，点击"开始分析"按钮
3. **查看结果**：等待几秒，系统会展示：
   - 📈 阅读量
   - 💬 评论数
   - 🏷️ 核心关键词（5-8个）
   - 📝 内容预览

## 🚀 部署指南

### Vercel 部署（推荐）

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 部署项目：
```bash
vercel
```

3. 在 Vercel Dashboard 中配置环境变量

### 传统服务器部署

1. 将代码上传到服务器
2. 安装 Node.js 环境（v14+）
3. 安装依赖并启动：
```bash
npm install --production
npm start
```

4. 使用 PM2 守护进程（推荐）：
```bash
npm install -g pm2
pm2 start server.js --name "keyword-analyzer"
pm2 save
```

5. 配置 Nginx 反向代理（可选）

## 🔧 配置说明

### 环境变量

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `SONNET_API_KEY` | Claude API 密钥 | 否* | - |
| `SONNET_API_ENDPOINT` | Claude API 端点 | 否 | https://api.anthropic.com/v1/messages |
| `THIRD_PARTY_API_KEY` | 第三方解析 API 密钥 | 否 | - |
| `PORT` | 服务器端口 | 否 | 3000 |

*未配置 Claude API 时会降级为简单的关键词提取算法

### 接口说明

#### POST `/api/analyze`

分析文章内容

**请求参数：**
```json
{
  "url": "https://www.xiaohongshu.com/..."
}
```

**响应数据：**
```json
{
  "success": true,
  "readCount": 12345,
  "commentCount": 678,
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "contentPreview": "文章内容预览..."
}
```

#### GET `/api/health`

健康检查接口

**响应数据：**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "config": {
    "sonnetApiConfigured": true,
    "thirdPartyApiConfigured": false
  }
}
```

## ⚠️ 注意事项

1. **API 密钥安全**：
   - ❌ 不要将 `.env` 文件提交到 Git
   - ✅ 使用环境变量管理敏感信息
   - ✅ 生产环境使用服务器环境变量

2. **请求限制**：
   - Claude API 有调用频率限制
   - 第三方解析 API 通常有配额限制
   - 建议添加请求缓存和频率控制

3. **合规使用**：
   - 遵守平台使用规则
   - 不得用于商业目的（除非获得授权）
   - 尊重内容创作者版权

4. **降级策略**：
   - 未配置 Claude API 时使用简单算法
   - 未配置第三方 API 时使用模拟数据
   - 确保核心功能可演示

## 📝 开发计划

- [ ] 支持更多内容平台（抖音、B站等）
- [ ] 添加关键词趋势分析
- [ ] 实现批量分析功能
- [ ] 数据可视化图表
- [ ] 用户系统和历史记录
- [ ] 导出分析报告

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License

## 💡 常见问题

### Q: 为什么需要第三方 API？
A: 小红书和公众号都有反爬机制，直接爬取容易被封禁。使用第三方 API 更稳定可靠。

### Q: 可以免费使用吗？
A: Claude API 有免费额度，第三方 API 部分服务有免费套餐，可用于测试和小规模使用。

### Q: 关键词提取不准确怎么办？
A: 确保配置了 Claude API 密钥，AI 提取的准确度远高于简单算法。也可以调整 `extractKeywords` 函数中的 prompt。

### Q: 如何修改关键词数量？
A: 编辑 `server.js` 中的 `extractKeywords` 函数，修改 prompt 中的数量要求和 `.slice(0, 8)` 的参数。

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至：[your-email@example.com]

---

⭐ 如果这个项目对你有帮助，欢迎点个 Star！

