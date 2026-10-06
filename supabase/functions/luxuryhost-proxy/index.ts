import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const API_BASE = 'https://api.luxuryhost.cc';
const API_KEY = Deno.env.get('LUXURYHOST_API_KEY') ?? '';
const VPS_AGENT_URL = Deno.env.get('VPS_AGENT_URL') ?? '';
const VPS_AGENT_TOKEN = Deno.env.get('VPS_AGENT_TOKEN') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const admin = SUPABASE_URL && SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
  : null;

async function call(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, data };
}

// ----- DNS check (same logic as domain-status-check) -----
async function dohQuery(url: string): Promise<{ status: number; hasAnswer: (type: number) => boolean } | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/dns-json' } });
    if (!r.ok) return null;
    const j: any = await r.json();
    return {
      status: typeof j.Status === 'number' ? j.Status : -1,
      hasAnswer: (type: number) => Array.isArray(j.Answer) && j.Answer.some((a: any) => a.type === type),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

type DohOutcome = 'up' | 'nxdomain' | 'unknown';

async function resolveA(base: string, domain: string): Promise<DohOutcome> {
  const res = await dohQuery(`${base}?name=${encodeURIComponent(domain)}&type=A`);
  if (!res) return 'unknown';
  if (res.status === 0 && res.hasAnswer(1)) return 'up';
  if (res.status === 3) return 'nxdomain';
  return 'unknown';
}

async function resolveNS(base: string, domain: string): Promise<boolean> {
  const res = await dohQuery(`${base}?name=${encodeURIComponent(domain)}&type=NS`);
  return !!res && res.status === 0 && res.hasAnswer(2);
}

async function domainResolves(domain: string): Promise<boolean> {
  const resolvers = [
    'https://dns.google/resolve',
    'https://cloudflare-dns.com/dns-query',
    'https://dns.quad9.net:5053/dns-query',
  ];
  for (const r of resolvers) {
    const o = await resolveA(r, domain);
    if (o === 'up') return true;
    if (o === 'nxdomain') return false;
  }
  for (const r of resolvers.slice(0, 2)) {
    if (await resolveNS(r, domain)) return true;
  }
  return false;
}

// ----- VPS agent -----
async function callAgent(path: string, body: Record<string, unknown>, timeoutMs: number) {
  if (!VPS_AGENT_URL || !VPS_AGENT_TOKEN) {
    return { status: 500, data: { ok: false, error: 'VPS_AGENT_URL / VPS_AGENT_TOKEN nicht gesetzt' } };
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${VPS_AGENT_URL.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Token': VPS_AGENT_TOKEN,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data: any = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
    return { status: res.status, data };
  } catch (err) {
    return { status: 504, data: { ok: false, error: err instanceof Error ? err.message : String(err) } };
  } finally {
    clearTimeout(t);
  }
}

async function saveConnectionStatus(domain: string, luxuryhostId: string | undefined, status: string, message: string) {
  if (!admin) return;
  const patch: Record<string, unknown> = {
    domain,
    status,
    last_message: message,
  };
  if (luxuryhostId) patch.luxuryhost_id = luxuryhostId;
  if (status === 'connected') patch.connected_at = new Date().toISOString();
  await admin.from('domain_connections').upsert(patch, { onConflict: 'domain' });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { action, payload } = await req.json() as { action: string; payload?: Record<string, unknown> };
    const p = payload ?? {};

    // Non-luxuryhost actions
    if (action === 'checkDns') {
      const domain = String(p.domain ?? '').toLowerCase().trim();
      if (!domain) {
        return new Response(JSON.stringify({ status: 400, data: { error: 'domain fehlt' } }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const up = await domainResolves(domain);
      return new Response(JSON.stringify({ status: 200, data: { resolves: up, domain } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'connectDomain') {
      const domain = String(p.domain ?? '').toLowerCase().trim();
      const luxuryhostId = p.id ? String(p.id) : undefined;
      if (!domain) {
        return new Response(JSON.stringify({ status: 400, data: { error: 'domain fehlt' } }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      await saveConnectionStatus(domain, luxuryhostId, 'pending', 'Verbindung wird eingerichtet…');
      const res = await callAgent('/provision', { domain }, 120_000);
      const ok = res.status >= 200 && res.status < 300 && res.data?.ok;
      const message = ok
        ? `Domain ${domain} ist verbunden.`
        : (res.data?.error || res.data?.stderr || `Verbindung fehlgeschlagen (HTTP ${res.status}).`);
      await saveConnectionStatus(domain, luxuryhostId, ok ? 'connected' : 'ssl_failed', message);
      return new Response(JSON.stringify({ status: res.status, data: { ok, message, detail: res.data } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'retrySSL') {
      const domain = String(p.domain ?? '').toLowerCase().trim();
      const luxuryhostId = p.id ? String(p.id) : undefined;
      if (!domain) {
        return new Response(JSON.stringify({ status: 400, data: { error: 'domain fehlt' } }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const res = await callAgent('/ssl-retry', { domain }, 90_000);
      const ok = res.status >= 200 && res.status < 300 && res.data?.ok;
      const message = ok
        ? `SSL für ${domain} erfolgreich ausgestellt.`
        : (res.data?.error || res.data?.stderr || `SSL fehlgeschlagen (HTTP ${res.status}).`);
      await saveConnectionStatus(domain, luxuryhostId, ok ? 'connected' : 'ssl_failed', message);
      return new Response(JSON.stringify({ status: res.status, data: { ok, message, detail: res.data } }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // LuxuryHost actions
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'LUXURYHOST_API_KEY nicht konfiguriert' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;
    switch (action) {
      case 'getBalance':
        result = await call('/public/api/users/me', { method: 'GET' });
        break;
      case 'bulkSearch': {
        const domains = Array.isArray(p.domains) ? p.domains : [];
        result = await call('/public/api/domains/search/bulk', {
          method: 'POST',
          body: JSON.stringify({ domains }),
        });
        break;
      }
      case 'purchase': {
        const domain = String(p.domain ?? '');
        const contactId = p.contactId ? String(p.contactId) : undefined;
        const body: Record<string, unknown> = { domain };
        if (contactId) body.contactId = contactId;
        result = await call('/public/api/domains/purchase', {
          method: 'POST',
          body: JSON.stringify({ domains: [body] }),
        });
        break;
      }
      case 'list': {
        result = await call('/public/api/domains/list?limit=100&sort_by=createdAt&sort_direction=desc', { method: 'GET' });
        break;
      }
      case 'getDomain': {
        const id = String(p.id ?? '');
        result = await call(`/public/api/domains/${encodeURIComponent(id)}`, { method: 'GET' });
        break;
      }
      case 'addRecord': {
        const id = String(p.id ?? '');
        const domain = String(p.domain ?? '');
        result = await call(`/public/api/domains/${encodeURIComponent(id)}/records`, {
          method: 'PUT',
          body: JSON.stringify({
            name: domain || '@',
            type: 'A',
            value: String(p.ip ?? ''),
            ttl: 3600,
          }),
        });
        break;
      }
      case 'addTxtRecord': {
        const id = String(p.id ?? '');
        const name = String(p.name ?? '_acme-challenge');
        const value = String(p.value ?? '');
        result = await call(`/public/api/domains/${encodeURIComponent(id)}/records`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            type: 'TXT',
            value,
            ttl: 300,
          }),
        });
        break;
      }
      case 'deleteRecord': {
        const id = String(p.id ?? '');
        const recordId = String(p.recordId ?? '');
        if (!id || !recordId) {
          return new Response(JSON.stringify({ status: 400, data: { error: 'id/recordId fehlt' } }), {
            status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        result = await call(
          `/public/api/domains/${encodeURIComponent(id)}/records/${encodeURIComponent(recordId)}`,
          { method: 'DELETE' },
        );
        break;
      }
      case 'listContacts':
        result = await call('/public/api/domains/contacts', { method: 'GET' });
        break;
      default:
        return new Response(JSON.stringify({ error: `unknown action: ${action}` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('luxuryhost-proxy error', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
