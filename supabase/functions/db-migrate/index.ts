import postgres from "npm:postgres@3.4.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLES = [
  "auth.users",
  "auth.identities",
  "public.profiles",
  "public.user_roles",
  "public.watchlist",
  "public.downloads",
  "public.recently_viewed",
  "public.reviews",
  "public.video_links",
  "public.watch_progress",
];

function normalizeUrl(raw: string): string {
  const m = raw.match(/^(postgres(?:ql)?:\/\/)([^:/@]+):(.*)@([^@/]+)(\/.*)?$/);
  if (!m) return raw;
  const [, scheme, user, pw, host, db] = m;
  return `${scheme}${user}:${encodeURIComponent(pw)}@${host}${db ?? ""}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const sourceUrl = Deno.env.get("SUPABASE_DB_URL");
  const targetUrl = Deno.env.get("TARGET_SUPABASE_DB_URL");
  if (!sourceUrl || !targetUrl) {
    return new Response(JSON.stringify({ error: "Missing database credentials" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const src = postgres(normalizeUrl(sourceUrl), { prepare: false, max: 1 });
  const tgt = postgres(normalizeUrl(targetUrl), { prepare: false, max: 1 });
  const report: Record<string, unknown> = {};

  try {
    await tgt.unsafe("set session_replication_role = replica");

    for (const table of TABLES) {
      const rows = await src.unsafe(`select to_jsonb(t) as data from ${table} t`);
      let copied = 0;
      const errors: string[] = [];
      for (const r of rows) {
        try {
          await tgt.unsafe(
            `insert into ${table} select * from jsonb_populate_record(null::${table}, $1::jsonb) on conflict do nothing`,
            [JSON.stringify(r.data)],
          );
          copied++;
        } catch (e) {
          if (errors.length < 3) errors.push(String((e as Error).message));
        }
      }
      const [{ count }] = await tgt.unsafe(`select count(*)::int as count from ${table}`);
      report[table] = { source: rows.length, copied, targetTotal: count, errors };
    }

    return new Response(JSON.stringify({ ok: true, report }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String((e as Error).message), report }, null, 2),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } finally {
    await src.end({ timeout: 5 });
    await tgt.end({ timeout: 5 });
  }
});
