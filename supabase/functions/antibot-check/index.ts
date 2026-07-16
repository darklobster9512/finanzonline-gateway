// AntiBot check edge function
// Validates incoming requests against IP blocklists (via SQL),
// crawler User-Agent patterns, headless browser markers and referer blacklist.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const REFERER_BLACKLIST = [
  "phishtank.com",
  "phishtank.org",
  "openphish.com",
  "namecheap.com",
  "virustotal.com",
  "urlscan.io",
  "urlquery.net",
  "urlvoid.com",
  "sucuri.net",
  "sitecheck.sucuri.net",
  "fortinet.com",
  "fortiguard.com",
  "trendmicro.com",
  "sitesafety.trendmicro.com",
  "sophos.com",
  "bitdefender.com",
  "quttera.com",
  "eset.com",
  "kaspersky.com",
  "opswat.com",
  "metadefender.com",
  "hybrid-analysis.com",
  "joesandbox.com",
  "any.run",
  "ipqualityscore.com",
  "abuse.ch",
  "phishcheck.me",
  "netcraft.com",
  "report.netcraft.com",
  "scanurl.net",
  "isitphishing.org",
  "checkphish.ai",
  "threatbook.io",
  "webinspector.com",
  "browserling.com",
  "browserstack.com",
  "saucelabs.com",
  "archive.org",
  "web.archive.org",
  "cachedview.com",
  "google.com/safebrowsing",
  "safebrowsing.google.com",
  "transparencyreport.google.com",
];

const SCANNER_UA_MARKERS = [
  "urlscan",
  "sucuri",
  "fortinet",
  "trendmicro",
  "sophos",
  "bitdefender",
  "kaspersky",
  "eset",
  "netcraft",
  "phishtank",
  "openphish",
  "safebrowsing",
  "googlebot-safety",
  "smartscreen",
  "msnbot-media",
  "bingpreview",
  "slackbot",
  "twitterbot",
  "discordbot",
  "telegrambot",
  "whatsapp",
  "facebookexternalhit",
  "linkedinbot",
  "skypeuripreview",
  "pinterest",
  "applebot",
  "duckduckbot",
  "yandex",
  "baiduspider",
  "mj12bot",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "rogerbot",
  "screaming frog",
  "python-requests",
  "curl/",
  "wget",
  "go-http-client",
  "java/",
  "okhttp",
  "aiohttp",
  "node-fetch",
  "axios",
];

const HEADLESS_MARKERS = [
  "headlesschrome",
  "phantomjs",
  "puppeteer",
  "selenium",
  "playwright",
  "electron",
  "slimerjs",
  "htmlunit",
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

function getAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function extractIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") || "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const domain: string = (body?.domain || "").toString().slice(0, 255);
    const path: string = (body?.path || "").toString().slice(0, 500);
    const ua: string = (req.headers.get("user-agent") || "").toLowerCase();
    const referer = req.headers.get("referer") || "";
    const acceptLanguage = req.headers.get("accept-language") || "";
    const ip = extractIp(req);

    let reason: string | null = null;

    // 1) Headless markers (cheap, no DB)
    for (const m of HEADLESS_MARKERS) {
      if (ua.includes(m)) {
        reason = `headless:${m}`;
        break;
      }
    }

    // 1b) Scanner / crawler UA markers
    if (!reason && ua) {
      for (const m of SCANNER_UA_MARKERS) {
        if (ua.includes(m)) {
          reason = `scanner_ua:${m}`;
          break;
        }
      }
    }

    // 1c) Missing accept-language
    if (!reason && !acceptLanguage) {
      reason = "missing_accept_language";
    }

    // 2) Referer blacklist
    if (!reason && referer) {
      try {
        const host = new URL(referer).hostname.toLowerCase();
        for (const bad of REFERER_BLACKLIST) {
          if (host === bad || host.endsWith("." + bad) || host.includes(bad)) {
            reason = `referer:${bad}`;
            break;
          }
        }
      } catch {
        // invalid referer URL
      }
    }

    // 3+4) IP check via single SQL query (Tor + CIDR combined)
    if (!reason && ip) {
      const ipInt = ipv4ToInt(ip);
      if (ipInt !== null) {
        try {
          const admin = getAdmin();
          const { data } = await admin.rpc("check_ip_blocked", { p_ip_int: ipInt });
          if (data && data.length > 0) {
            const src = data[0].source;
            reason = src === "tor" ? "tor" : "firehol_cidr";
          }
        } catch (e) {
          console.error("check_ip_blocked error", e);
          // fail open
        }
      }
    }

    const admin = getAdmin();

    if (reason) {
      // Log block (best-effort)
      try {
        await admin.from("bot_blocks").insert({
          ip: ip || null,
          user_agent: ua || null,
          referer: referer || null,
          reason,
          domain: domain || null,
          path: path || null,
        });
      } catch (e) {
        console.error("Failed to insert bot_block log", e);
      }

      return new Response(
        JSON.stringify({ allowed: false, reason, ip }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Log allowed visit (best-effort)
    try {
      await admin.from("page_visits").insert({
        domain: domain || null,
        path: path || null,
      });
    } catch (e) {
      console.error("Failed to insert page_visit", e);
    }

    return new Response(JSON.stringify({ allowed: true, ip }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("antibot-check error", e);
    return new Response(JSON.stringify({ allowed: true, error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

