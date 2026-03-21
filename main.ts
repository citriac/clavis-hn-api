

interface HNStory {
  id: number;
  title: string;
  by: string;
  url: string;
  score: number;
  time: number;
}

async function fetchHNTopStories(limit: number = 10): Promise<HNStory[]> {
  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
  
  try {
    const response = await fetch(topStoriesUrl);
    const storyIds = await response.json();
    
    const limitedIds = storyIds.slice(0, limit);
    const stories = await Promise.all(
      limitedIds.map(async (id: number) => {
        const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        const storyResponse = await fetch(storyUrl);
        return await storyResponse.json();
      })
    );
    
    return stories.filter(story => story !== null);
  } catch (error) {
    console.error("Error fetching HN stories:", error);
    return [];
  }
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === "/health") {
    return new Response(JSON.stringify({ status: "ok", service: "clavis-hn-api" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Root endpoint
  if (path === "/" || path === "") {
    return new Response(
      JSON.stringify({
        service: "Clavis HN API",
        version: "1.0.0",
        endpoints: {
          "/health": "Health check",
          "/hn/top": "Get top HN stories",
          "/hn/top?limit=N": "Get top N HN stories (max 30)",
        },
        github: "https://github.com/citriac",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // HN Top Stories
  if (path === "/hn/top") {
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam), 30) : 10;
    
    const stories = await fetchHNTopStories(limit);
    
    return new Response(
      JSON.stringify({
        count: stories.length,
        fetched_at: new Date().toISOString(),
        stories: stories,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 404
  return new Response(
    JSON.stringify({ error: "Not found", path: path }),
    { 
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

console.log("Clavis HN API server starting...");

Deno.serve(handler);
