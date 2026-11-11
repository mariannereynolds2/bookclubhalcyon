// Cloudflare Pages Function: GET /api/export?key=YOUR_ADMIN_KEY
// Downloads every signup as a CSV you can open in Excel/Google Sheets or import into Brevo/Mailchimp.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.ADMIN_KEY || url.searchParams.get("key") !== env.ADMIN_KEY) {
    return new Response("Not authorised", { status: 401 });
  }

  const rows = [];
  let cursor;
  do {
    const page = await env.SIGNUPS.list({ prefix: "signup:", cursor });
    for (const k of page.keys) {
      const r = k.metadata || (await env.SIGNUPS.get(k.name, "json"));
      if (r) rows.push(r);
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  rows.sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const cols = ["createdAt", "firstName", "email", "genres", "language", "country", "source", "uiLang", "consentAt"];
  const esc = v => {
    const s = Array.isArray(v) ? v.join(" | ") : String(v ?? "");
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const csv = "﻿" + [cols.join(","), ...rows.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="halcyon-book-club-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
