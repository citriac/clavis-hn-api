# Clavis Tech API

<div align="center">

**Hacker News + GitHub Trending，一个 API 搞定**

[![Deno Deploy](https://img.shields.io/badge/Deno%20Deploy-live-brightgreen?logo=deno)](https://clavis-hn-api.citriac.deno.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Base URL:** `https://clavis-hn-api.citriac.deno.net`

[📖 文档](#endpoints) · [🚀 快速开始](#quick-start) · [❤ 赞助](https://github.com/sponsors/citriac)

</div>

---

## 简介

免费、无需 Key、全球边缘部署的技术资讯 API。

- 🔥 **Hacker News 热点**：实时 Top Stories，带评论数
- 🚀 **GitHub Trending**：按时间段和语言筛选新项目
- 📅 **每日摘要**：一次请求，HN + GitHub 全拿

---

## Quick Start

```bash
# 获取 HN 热门 10 条
curl https://clavis-hn-api.citriac.deno.net/hn/top

# 获取过去 7 天 GitHub 最热新项目
curl https://clavis-hn-api.citriac.deno.net/gh/trending

# 今日技术摘要（HN + GitHub 合并）
curl https://clavis-hn-api.citriac.deno.net/daily
```

---

## Endpoints

### `GET /`
服务信息。

---

### `GET /health`
健康检查。

```json
{ "status": "ok", "ts": "2026-03-22T08:00:00.000Z" }
```

---

### `GET /hn/top`

获取 Hacker News 热门故事。

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `limit` | int | 10 | 返回数量，最大 30 |

**示例**

```bash
curl "https://clavis-hn-api.citriac.deno.net/hn/top?limit=5"
```

```json
{
  "source": "Hacker News",
  "count": 5,
  "fetched_at": "2026-03-22T08:00:00.000Z",
  "stories": [
    {
      "id": 12345678,
      "title": "Some things just take time",
      "url": "https://example.com/article",
      "by": "username",
      "score": 486,
      "descendants": 163,
      "time": 1742600000
    }
  ]
}
```

---

### `GET /gh/trending`

获取 GitHub 近期最热新仓库（基于 GitHub Search API）。

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `days` | int | 7 | 查找最近 N 天内创建的仓库，最大 30 |
| `language` | string | 全部 | 编程语言，如 `python`、`typescript`、`rust` |
| `limit` | int | 10 | 返回数量，最大 30 |

**示例**

```bash
# Python 项目最近 3 天热门
curl "https://clavis-hn-api.citriac.deno.net/gh/trending?days=3&language=python&limit=5"

# 所有语言过去一周热门
curl "https://clavis-hn-api.citriac.deno.net/gh/trending?days=7&limit=15"
```

```json
{
  "source": "GitHub",
  "days": 7,
  "language": "all",
  "count": 10,
  "fetched_at": "2026-03-22T08:00:00.000Z",
  "repos": [
    {
      "name": "owner/repo-name",
      "description": "A cool project",
      "url": "https://github.com/owner/repo-name",
      "stars": 2468,
      "language": "Python",
      "topics": ["ai", "agent"],
      "created_at": "2026-03-18",
      "forks": 120
    }
  ]
}
```

---

### `GET /daily`

今日技术摘要，HN + GitHub 一次搞定。

```bash
curl https://clavis-hn-api.citriac.deno.net/daily
```

```json
{
  "date": "2026-03-22",
  "fetched_at": "2026-03-22T08:00:00.000Z",
  "hacker_news": {
    "count": 10,
    "stories": [ ... ]
  },
  "github_trending": {
    "count": 10,
    "repos": [ ... ]
  }
}
```

---

## 使用场景

- **个人 Dashboard**：把 `/daily` 接入你的 start page
- **Telegram/Discord Bot**：定时推送技术热点
- **RSS 替代**：轮询 `/hn/top` 获取最新内容
- **数据分析**：采集 GitHub 语言生态趋势

---

## 限制

- 免费服务，不保证 SLA
- GitHub API 速率限制：60 次/小时（无 token）
- HN API 无限制

---

## 本地运行

需要 [Deno](https://deno.land/) 2.x。

```bash
git clone https://github.com/citriac/clavis-hn-api.git
cd clavis-hn-api
deno run --allow-net main.ts
# → http://localhost:8000
```

---

## 开源协议

MIT © [Clavis](https://github.com/citriac)

---

<div align="center">

如果这个 API 对你有用，欢迎 [⭐ Star](https://github.com/citriac/clavis-hn-api) 或 [❤ 赞助](https://github.com/sponsors/citriac)

</div>
