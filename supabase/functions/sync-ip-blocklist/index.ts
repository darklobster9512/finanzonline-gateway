// Downloads FireHOL/Tor IP blocklists and stores them in public.ip_blocklist.
// Callable manually (admin) or via cron. Returns per-source counts.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Src = { name: string; url: string; kind: "cidr" | "ip" };

const SOURCES: Src[] = [
  {
    name: "firehol_level1",
    url: "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset",
    kind: "cidr",
  },
  {
    name: "firehol_webclient",
    url: "https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_webclient.netset",
    kind: "cidr",
  },
  {
    name: "datacenter",
    url: "https://raw.githubusercontent.com/lord-alfred/ipranges/main/all/ipv4.txt",
    kind: "cidr",
  },
  {
    name: "tor",
    url: "https://check.torproject.org/torbulkexitlist",
    kind: "ip",
  },
];

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255) return null;
    n = (n << 8) + v;
  }
  return n >>> 0;
}

function parseLine(line: string, kind: "cidr" | "ip"):
  | { cidr: string; base: number; mask: number }
  | null {
  const cleaned = line.split("#")[0].trim();
  if (!cleaned) return null;
  let ip = cleaned;
  let bits = 32;
  if (cleaned.includes("/")) {
    const [a, b] = cleaned.split("/");
    ip = a;
    bits = Number(b);
    if (!Number.isInteger(bits) || bits < 0 || bits > 32) return null;
  }
  const base = ipv4ToInt(ip);
  if (base === null) return null;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  const canonicalBase = (base & mask) >>> 0;
  const cidr = `${
    [
      (canonicalBase >>> 24) & 0xff,
      (canonicalBase >>> 16) & 0xff,
      (canonicalBase >>> 8) & 0xff,
      canonicalBase & 0xff,
    ].join(".")
  }/${bits}`;
  return { cidr, base: canonicalBase, mask };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const results: Record<string, number> = {};
  const errors: Record<string, string> = {};

  for (const src of SOURCES) {
    try {
      const res = await fetch(src.url);
      if (!res.ok) {
        errors[src.name] = `HTTP ${res.status}`;
        continue;
      }
      const text = await res.text();
      const seen = new Set<string>();
      const rows: { base_int: number; mask_int: number; cidr: string; source: string }[] = [];
      for (const line of text.split(/\r?\n/)) {
        const p = parseLine(line, src.kind);
        if (!p) continue;
        if (seen.has(p.cidr)) continue;
        seen.add(p.cidr);
        rows.push({
          base_int: p.base,
          mask_int: p.mask,
          cidr: p.cidr,
          source: src.name,
        });
      }

      const del = await admin.from("ip_blocklist").delete().eq("source", src.name);
      if (del.error) throw del.error;

      const CHUNK = 1000;
      for (let i = 0; i < rows.length; i += CHUNK) {
        const chunk = rows.slice(i, i + CHUNK);
        const ins = await admin.from("ip_blocklist").insert(chunk);
        if (ins.error) throw ins.error;
      }
      results[src.name] = rows.length;
    } catch (e) {
      errors[src.name] = String(e);
    }
  }

  return new Response(
    JSON.stringify({ ok: true, counts: results, errors }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
