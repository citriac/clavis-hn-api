/**
 * Clavis Tech API
 * Endpoints:
 *   GET /           - Service info
 *   GET /health     - Health check
 *   GET /hn/top     - HN top stories (limit, filter)
 *   GET /gh/trending - GitHub trending repos (days, language, limit)
 *   GET /daily      - Today's combined tech digest
 */

interface HNStory {
  id: number;
  title: string;
  by: string;
  url: string;
  score: number;
  time: number;
  descendants?: number;
  type?: string;
}

interface GHRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  topics: string[];
  created_at: string;
}

// ─── Hacker News ────────────────────────────────────────────────────────────

async function fetchHNTopStories(limit = 10): Promise<HNStory[]> {
  const idsRes = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const allIds: number[] = await idsRes.json();
  const ids = allIds.slice(0, limit * 2); // fetch extra to filter non-stories

  const items = await Promise.all(
    ids.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then((r) => r.json())
        .catch(() => null)
    )
  );

  return (items as HNStory[])
    .filter((s) => s && s.type === "story" && s.url)
    .slice(0, limit);
}

// ─── GitHub Search API ───────────────────────────────────────────────────────

async function fetchGHTrending(
  days = 7,
  language = "",
  limit = 10
): Promise<GHRepo[]> {
  const since = new Date(Date.now() - days * 86400000)
    .toISOString()
    .slice(0, 10);

  let query = `created:>${since}`;
  if (language) query += ` language:${language}`;

  const params = new URLSearchParams({
    q: query,
    sort: "stars",
    order: "desc",
    per_page: String(Math.min(limit, 30)),
  });

  const res = await fetch(
    `https://api.github.com/search/repositories?${params}`,
    {
      headers: {
        "User-Agent": "Clavis-TechAPI/2.0",
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  return (data.items ?? []).map((item: Record<string, unknown>) => ({
    name: item.full_name,
    description: (item.description as string) ?? "",
    url: item.html_url,
    stars: item.stargazers_count,
    language: (item.language as string) ?? "Unknown",
    topics: ((item.topics as string[]) ?? []).slice(0, 5),
    created_at: ((item.created_at as string) ?? "").slice(0, 10),
    forks: item.forks_count,
  }));
}

// ─── CORS / Response helpers ─────────────────────────────────────────────────

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

// ─── Handler ─────────────────────────────────────────────────────────────────

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    // ── / ──
    if (path === "/" || path === "") {
      return json({
        service: "Clavis Tech API",
        version: "2.0.0",
        description: "Hacker News + GitHub Trending in one place",
        endpoints: {
          "GET /health": "Health check",
          "GET /hn/top": "HN top stories · params: limit(1-30)",
          "GET /gh/trending":
            "GitHub trending repos · params: days(1-30), language, limit(1-30)",
          "GET /daily": "Combined daily tech digest",
        },
        github: "https://github.com/citriac",
        sponsor: "https://github.com/sponsors/citriac",
      });
    }

    // ── /health ──
    if (path === "/health") {
      return json({ status: "ok", ts: new Date().toISOString() });
    }

    // ── /hn/top ──
    if (path === "/hn/top") {
      const limit = Math.min(
        parseInt(url.searchParams.get("limit") ?? "10"),
        30
      );
      const stories = await fetchHNTopStories(limit);
      return json({
        source: "Hacker News",
        count: stories.length,
        fetched_at: new Date().toISOString(),
        stories,
      });
    }

    // ── /gh/trending ──
    if (path === "/gh/trending") {
      const days = Math.min(
        parseInt(url.searchParams.get("days") ?? "7"),
        30
      );
      const language = url.searchParams.get("language") ?? "";
      const limit = Math.min(
        parseInt(url.searchParams.get("limit") ?? "10"),
        30
      );
      const repos = await fetchGHTrending(days, language, limit);
      return json({
        source: "GitHub",
        days,
        language: language || "all",
        count: repos.length,
        fetched_at: new Date().toISOString(),
        repos,
      });
    }

    // ── /daily ──
    if (path === "/daily") {
      const [hnStories, ghRepos] = await Promise.allSettled([
        fetchHNTopStories(10),
        fetchGHTrending(7, "", 10),
      ]);

      return json({
        date: new Date().toISOString().slice(0, 10),
        fetched_at: new Date().toISOString(),
        hacker_news: {
          count:
            hnStories.status === "fulfilled" ? hnStories.value.length : 0,
          stories:
            hnStories.status === "fulfilled" ? hnStories.value : [],
          error:
            hnStories.status === "rejected"
              ? String(hnStories.reason)
              : undefined,
        },
        github_trending: {
          count:
            ghRepos.status === "fulfilled" ? ghRepos.value.length : 0,
          repos:
            ghRepos.status === "fulfilled" ? ghRepos.value : [],
          error:
            ghRepos.status === "rejected"
              ? String(ghRepos.reason)
              : undefined,
        },
      });
    }

    // ── 404 ──
    return json({ error: "Not found", path }, 404);
  } catch (err) {
    console.error(err);
    return json({ error: "Internal server error", detail: String(err) }, 500);
  }
}

console.log("Clavis Tech API v2.0 starting...");
Deno.serve(handler);
