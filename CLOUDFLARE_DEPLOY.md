# 🚀 Cloudflare Pages 部署指南（小白版）

## 📋 前置准备

1. 一个 Cloudflare 账号（免费注册：https://dash.cloudflare.com/sign-up）
2. 一个 GitHub 账号（免费注册：https://github.com/signup）
3. 你的代码已经在本地准备好

---

## 🎯 详细步骤

### 第一步：把代码推到 GitHub

#### 1.1 初始化 Git（如果还没做）

打开终端，在项目目录执行：

```bash
cd /Users/leo/Desktop/auto-keyword-catch-rednote
git init
git add .
git commit -m "Initial commit for Cloudflare Pages"
```

#### 1.2 在 GitHub 创建仓库

1. 打开浏览器，访问 https://github.com/new
2. 填写信息：
   - **Repository name**（仓库名）：`auto-keyword-catch-rednote`
   - **Description**（描述）：可选，比如 "小红书和公众号链接分析工具"
   - 保持 **Public**（公开）
   - ⚠️ **不要**勾选 "Add a README file"
   - ⚠️ **不要**选择 .gitignore 和 license
3. 点击绿色按钮 **Create repository**

#### 1.3 推送代码到 GitHub

创建完仓库后，GitHub 会显示一段命令，复制执行：

```bash
git remote add origin https://github.com/你的用户名/auto-keyword-catch-rednote.git
git branch -M main
git push -u origin main
```

**注意**：把 `你的用户名` 替换成你的 GitHub 用户名！

如果提示需要登录：
- **用户名**：你的 GitHub 用户名
- **密码**：需要使用 Personal Access Token（不是你的 GitHub 密码）
  - 获取方式：https://github.com/settings/tokens → Generate new token → 勾选 `repo` → Generate token

---

### 第二步：部署到 Cloudflare Pages

#### 2.1 登录 Cloudflare

1. 访问 https://dash.cloudflare.com/login
2. 登录你的账号（如果没有，先注册）

#### 2.2 创建 Pages 项目

1. 在 Cloudflare 控制台，点击左侧菜单 **Workers & Pages**
2. 点击右侧蓝色按钮 **Create application**
3. 选择 **Pages** 标签页
4. 点击 **Connect to Git**

#### 2.3 连接 GitHub

1. 选择 **GitHub**
2. 如果是第一次，会弹出授权窗口：
   - 点击 **Install & Authorize**
   - 选择 **Only select repositories**
   - 找到 `auto-keyword-catch-rednote`，勾选
   - 点击 **Install**
3. 授权完成后，会回到 Cloudflare，选择你的仓库：
   - 在列表中找到 `auto-keyword-catch-rednote`
   - 点击 **Begin setup**

#### 2.4 配置构建设置

填写以下信息：

1. **Project name**（项目名）：`auto-keyword-catch-rednote`（或其他你喜欢的名字）
2. **Production branch**（生产分支）：`main`
3. **Build settings**（构建设置）：
   - **Framework preset**：选择 `None`
   - **Build command**：留空（不需要构建）
   - **Build output directory**：填写 `public`

4. 点击底部的 **Save and Deploy**

#### 2.5 配置环境变量（重要！）

部署完成后，你需要配置 API 密钥：

1. 在项目页面，点击顶部的 **Settings**
2. 点击左侧的 **Environment variables**
3. 添加以下变量：

   **变量 1: SONNET_API_KEY**
   - **Variable name**: `SONNET_API_KEY`
   - **Value**: 你的 Anthropic API Key（从 https://console.anthropic.com/ 获取）
   - **Environment**: 选择 `Production` 和 `Preview`
   - 点击 **Save**

   **变量 2: SONNET_API_ENDPOINT**
   - **Variable name**: `SONNET_API_ENDPOINT`
   - **Value**: `https://api.anthropic.com/v1/messages`
   - **Environment**: 选择 `Production` 和 `Preview`
   - 点击 **Save**

   **变量 3: THIRD_PARTY_API_KEY**（可选）
   - **Variable name**: `THIRD_PARTY_API_KEY`
   - **Value**: 如果你有第三方API密钥就填，没有就不填
   - **Environment**: 选择 `Production` 和 `Preview`
   - 点击 **Save**

4. 配置完环境变量后，回到 **Deployments** 页面
5. 点击最新部署右侧的 **... (三个点)**
6. 选择 **Retry deployment** 重新部署

---

### 第三步：访问你的网站

1. 部署成功后，会显示一个网址，类似：
   ```
   https://auto-keyword-catch-rednote.pages.dev
   ```
2. 点击链接，打开你的网站
3. 输入小红书或公众号链接测试

---

## 🎉 完成！

现在你的网站已经部署到 Cloudflare，全球访问速度都很快！

### 📝 后续更新代码

以后要更新代码，只需要：

```bash
cd /Users/leo/Desktop/auto-keyword-catch-rednote
# 修改代码后...
git add .
git commit -m "更新说明"
git push
```

推送后，Cloudflare 会**自动重新部署**，大约 1-2 分钟就能看到更新！

---

## ⚠️ 常见问题

### 1. 推送代码时提示 403 错误

**原因**：GitHub 不再支持密码登录

**解决**：
1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo`
4. 点击 **Generate token**
5. 复制 token（只显示一次！）
6. 再次推送时，用这个 token 作为密码

### 2. 部署后显示 404

**原因**：可能是 Build output directory 配置错误

**解决**：
1. 进入项目 Settings → Builds & deployments
2. 确认 **Build output directory** 是 `public`
3. 点击 **Save**，然后 **Retry deployment**

### 3. API 调用失败

**原因**：环境变量没配置或配置错误

**解决**：
1. 检查 Settings → Environment variables
2. 确认 `SONNET_API_KEY` 是真实的 API Key（不是 `your_anthropic_api_key_here`）
3. 重新部署

---

## 💡 提示

- Cloudflare Pages 免费版限制：
  - 每月 500 次构建
  - 每次构建 20 分钟超时
  - 100GB 带宽/月
  
- 对于个人项目完全够用！

---

有问题随时问！🙋

