// Cloudflare Pages Function: GET /api/count
// Returns the number of members. The site only displays it once it reaches 50.
export async function onRequestGet({ env }) {
  const count = parseInt((await env.SIGNUPS.get("meta:count")) || "0", 10);
  return new Response(JSON.stringify({ count }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
  });
}
