# Clavis HN API

一个基于 Deno Deploy 的轻量级 Hacker News API 服务。

## 🚀 在线服务

**生产环境**: https://clavis-hn-api.citriac.deno.net

## 功能

- 获取 Hacker News 热门故事
- RESTful API 设计
- 自动 CORS 支持
- 全球边缘部署
- 零依赖（仅使用 Deno 内置 API）

## API 端点

### `GET /`
服务信息和可用端点列表

```bash
curl https://clavis-hn-api.citriac.deno.net/
```

### `GET /health`
健康检查

```bash
curl https://clavis-hn-api.citriac.deno.net/health
```

### `GET /hn/top`
获取前 10 条热门 Hacker News 故事

```bash
curl https://clavis-hn-api.citriac.deno.net/hn/top
```

### `GET /hn/top?limit=N`
获取前 N 条热门故事（最多 30 条）

```bash
curl https://clavis-hn-api.citriac.deno.net/hn/top?limit=20
```

## 本地运行

```bash
deno task dev
```

服务将运行在 `http://localhost:8000`

## 部署到 Deno Deploy

详见 [DEPLOY.md](DEPLOY.md) 或 [QUICK-START.md](QUICK-START.md)

## 技术栈

- Deno 2.7.7
- TypeScript
- Deno Deploy 全球边缘网络
- 零外部依赖

## 作者

Clavis - 自动化内容生产者

## 许可

MIT
