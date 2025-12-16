# 🚀 快速开始指南

## 前置要求

在开始之前，请确保你的系统已安装：
- **Node.js** (v14 或更高版本) - [下载地址](https://nodejs.org/)
- **npm** (通常随 Node.js 一起安装)

检查是否已安装：
```bash
node --version
npm --version
```

## 安装步骤

### 1. 安装依赖

在项目根目录下运行：

```bash
npm install
```

这将安装以下依赖：
- `express` - Web 服务器框架
- `cors` - 跨域资源共享
- `axios` - HTTP 客户端
- `dotenv` - 环境变量管理
- `nodemon` - 开发工具（自动重启）

### 2. 配置 API 密钥

复制环境变量模板文件：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置你的 API 密钥：

```env
# Claude API 配置（推荐配置，用于 AI 关键词提取）
SONNET_API_KEY=sk-ant-xxxxx
SONNET_API_ENDPOINT=https://api.anthropic.com/v1/messages

# 第三方解析 API（可选，未配置时使用模拟数据）
THIRD_PARTY_API_KEY=your_key_here

# 服务器端口（默认 3000）
PORT=3000
```

### 3. 获取 Claude API 密钥

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 点击 "API Keys" 创建新密钥
4. 复制密钥并粘贴到 `.env` 文件

**免费额度**：新用户通常有 $5 免费额度，足够测试使用。

### 4. 启动服务

**开发模式**（推荐，支持自动重启）：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

### 5. 访问应用

打开浏览器，访问：
```
http://localhost:3000
```

你应该能看到一个漂亮的界面！🎉

## 测试功能

### 方式 1：使用模拟数据（无需配置 API）

即使不配置任何 API 密钥，程序也能运行并返回模拟数据，方便你测试界面和流程。

### 方式 2：配置 Claude API（推荐）

配置 Claude API 后，可以获得高质量的 AI 关键词提取。

试试这些测试链接：
- 小红书：`https://www.xiaohongshu.com/explore/xxxxx`
- 公众号：`https://mp.weixin.qq.com/s/xxxxx`

### 方式 3：完整配置（生产环境）

如果需要真实的阅读量和评论数，还需要配置第三方解析 API。

## 常见问题排查

### ❌ 问题：npm 命令未找到

**解决方案**：
1. 下载并安装 [Node.js](https://nodejs.org/)
2. 重启终端
3. 验证安装：`node --version`

### ❌ 问题：端口 3000 被占用

**解决方案**：
编辑 `.env` 文件，修改端口：
```env
PORT=3001
```

或者终止占用 3000 端口的进程：
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F
```

### ❌ 问题：API 调用失败

**检查清单**：
1. ✅ `.env` 文件是否存在且配置正确
2. ✅ API 密钥是否有效（未过期）
3. ✅ 网络连接是否正常
4. ✅ 查看控制台错误信息

### ❌ 问题：关键词提取不准确

**解决方案**：
1. 确保配置了 `SONNET_API_KEY`
2. 检查 API 密钥是否有效
3. 查看服务器日志，确认 AI API 调用成功

## 进阶配置

### 使用 PM2 守护进程（Linux/macOS 生产环境）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name "keyword-analyzer"

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs keyword-analyzer

# 重启应用
pm2 restart keyword-analyzer
```

### 配置 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 下一步

✅ 配置完成后，可以：
1. 测试不同的文章链接
2. 查看 API 调用日志
3. 自定义关键词提取逻辑（编辑 `server.js`）
4. 美化前端界面（编辑 `public/index.html`）
5. 部署到云服务器（参考 README.md 部署指南）

## 需要帮助？

- 📖 查看 [README.md](./README.md) 了解更多功能
- 🐛 遇到问题？提交 [GitHub Issue](https://github.com/your-repo/issues)
- 💬 技术交流：[联系方式]

---

祝你使用愉快！🎉

