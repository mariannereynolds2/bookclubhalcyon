// Cloudflare Pages Function: POST /api/signup
// Saves each reader in the KV namespace bound as SIGNUPS (one entry per email).
// Signing up again with the same email updates the entry and keeps earlier answers.
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (data.website) return json({ ok: true });

  const email = clean(data.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ ok: false, error: "email" }, 400);
  if (data.consent !== true) return json({ ok: false, error: "consent" }, 400);

  const allowedGenres = ["romance", "romantasy", "thriller", "fantasy", "contemporain"];
  const genres = (Array.isArray(data.genres) ? data.genres : []).map(String).filter(g => allowedGenres.includes(g));
  const language = ["fr", "vo", "both"].includes(data.language) ? data.language : "";

  const key = "signup:" + email;
  const now = new Date().toISOString();
  const existing = await env.SIGNUPS.get(key, "json");

  const record = {
    firstName: clean(data.firstName, 80) || existing?.firstName || "",
    email,
    genres: genres.length ? genres : existing?.genres || [],
    language: language || existing?.language || "both",
    country: clean(data.country, 60) || existing?.country || "",
    source: existing?.source || clean(data.source, 80),   // first link that brought them, e.g. ?ref=sophie
    uiLang: data.uiLang === "en" ? "en" : "fr",
    consentAt: existing?.consentAt || now,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  await env.SIGNUPS.put(key, JSON.stringify(record), { metadata: record });

  if (!existing) {
    const n = parseInt((await env.SIGNUPS.get("meta:count")) || "0", 10) + 1;
    await env.SIGNUPS.put("meta:count", String(n));
  }
  return json({ ok: true, returning: Boolean(existing) });
}
