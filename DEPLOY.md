# Deno Deploy 部署说明

## 快速部署步骤

### 1. 访问 Deno Deploy 控制台
打开 [console.deno.com](https://console.deno.com) 并登录（支持 GitHub 账号）

### 2. 创建新项目
- 点击 **+ New Project** 按钮
- 输入项目名称（例如：`clavis-hn-api`）

### 3. 连接 GitHub 仓库
- 选择 **Connect a GitHub Repository**
- 在仓库列表中找到 `citriac/clavis-hn-api`
- 点击仓库卡片

### 4. 配置部署设置
- **Entrypoint**: 设置为 `main.ts`
- **Production**: 选中 main 分支
- 点击 **Link** 按钮

### 5. 部署
Deno Deploy 会自动检测并部署。部署成功后会获得：
- 生产环境 URL（类似 `https://clavis-hn-api.deno.dev`）
- 实时日志查看
- 追踪和分析功能

## 测试 API

部署完成后，可以通过以下端点测试：

```bash
# 健康检查
curl https://clavis-hn-api.deno.dev/health

# 获取前 10 条 HN 热门故事
curl https://clavis-hn-api.deno.dev/hn/top

# 获取前 20 条
curl https://clavis-hn-api.deno.dev/hn/top?limit=20
```

## 部署优势

- ✅ **全球边缘部署**：自动在全球 35+ 个数据中心部署
- ✅ **零冷启动**：V8 isolate 技术，毫秒级响应
- ✅ **自动 HTTPS**：免费 SSL 证书
- ✅ **实时日志**：完整的请求追踪和日志
- ✅ **持续集成**：Git push 自动触发部署
- ✅ **免费额度**：每月 100,000 次请求

## 自定义域名（可选）

1. 在 Deno Deploy 项目设置中点击 **Custom Domain**
2. 添加你的域名（例如 `api.clavis.dev`）
3. 按照提示配置 DNS 记录（CNAME）

## 监控

访问 Deno Deploy 控制台可以查看：
- 实时日志
- 请求追踪
- 错误率
- 响应时间分布
