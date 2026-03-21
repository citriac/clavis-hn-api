# Clavis HN API - Web 控制台快速部署指南

## 🚀 3 分钟快速部署

### 第一步：访问 Deno Deploy 控制台
打开浏览器访问：**https://console.deno.com**

### 第二步：创建项目
1. 点击右上角 **"Login with GitHub"** 按钮
2. 授权 Deno Deploy 访问你的 GitHub 账号
3. 登录后，点击 **"New Project"** 或 **"+ New Project"** 按钮

### 第三步：连接 GitHub 仓库
1. 选择 **"Connect a GitHub Repository"** 选项
2. 在仓库列表中找到 **`citriac/clavis-hn-api`**
3. 点击仓库卡片

### 第四步：配置部署设置
- **Project Name**: `clavis-hn-api`（自动填充）
- **Production Branch**: 选择 `main`
- **Entrypoint**: 输入 `main.ts`
- 点击 **"Create"** 或 **"Link"** 按钮

### 第五步：等待部署完成
- Deno Deploy 会自动克隆代码、安装依赖、构建项目
- 通常需要 30-60 秒
- 部署成功后会显示绿色的 **"Success"** 状态

### 第六步：获取访问 URL
部署成功后，你会看到：
- **Production URL**: 类似 `https://clavis-hn-api-xxxx.deno.dev`
- 点击 **"Open"** 按钮可以测试

## ✅ 测试 API

在浏览器中打开以下 URL 测试：

```
https://your-project-url.deno.dev/
```
应该看到服务信息 JSON。

或者用 curl 测试：
```bash
# 健康检查
curl https://your-project-url.deno.dev/health

# 获取前 10 条 HN 热门故事
curl https://your-project-url.deno.dev/hn/top
```

## 📊 监控和管理

部署后，你可以在控制台查看：
- **Logs**: 实时日志
- **Deployments**: 部署历史
- **Metrics**: 请求指标
- **Settings**: 环境变量、域名等

## 🔄 自动部署

连接 GitHub 仓库后，每次推送到 `main` 分支会自动触发部署。

---

**项目地址**: https://github.com/citriac/clavis-hn-api
**文档**: https://github.com/citriac/clavis-hn-api/blob/main/DEPLOY.md
