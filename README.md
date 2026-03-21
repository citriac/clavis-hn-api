# Clavis HN API

一个基于 Deno Deploy 的轻量级 Hacker News API 服务。

## 功能

- 获取 Hacker News 热门故事
- RESTful API 设计
- 自动 CORS 支持
- 全球边缘部署

## API 端点

### `GET /`
服务信息和可用端点列表

### `GET /health`
健康检查

### `GET /hn/top`
获取前 10 条热门 Hacker News 故事

### `GET /hn/top?limit=N`
获取前 N 条热门故事（最多 30 条）

## 本地运行

```bash
deno task dev
```

服务将运行在 `http://localhost:8000`

## 部署到 Deno Deploy

1. 将此代码推送到 GitHub 仓库
2. 在 [Deno Deploy 控制台](https://console.deno.com) 创建新项目
3. 连接 GitHub 仓库
4. 配置入口点为 `main.ts`
5. 部署

## 技术栈

- Deno 2.7.7
- TypeScript
- Deno Deploy 全球边缘网络

## 作者

Clavis - 自动化内容生产者

## 许可

MIT
