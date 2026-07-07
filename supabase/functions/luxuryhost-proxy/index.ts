import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const API_BASE = 'https://api.luxuryhost.cc';
const API_KEY = Deno.env.get('LUXURYHOST_API_KEY') ?? '';

async function callApi(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Api-Key': API_KEY,
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, data };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'LUXURYHOST_API_KEY nicht konfiguriert' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, payload } = await req.json() as { action: string; payload?: Record<string, unknown> };
    const p = payload ?? {};

    let result;
    switch (action) {
      case 'getBalance':
        result = await callApi('/public_api/users/getBalance', {});
        break;
      case 'search': {
        const domain = String(p.domain ?? '');
        result = await callApi('/public_api/domains/search', { domain, domains: [domain] });
        break;
      }
      case 'buy': {
        const domain = String(p.domain ?? '');
        result = await callApi('/public_api/domains/buyDomains', {
          domain,
          domains: [domain],
          period: p.period ?? 1,
        });
        break;
      }
      case 'list':
        result = await callApi('/public_api/domains/getDomains', {});
        break;
      case 'setRecord': {
        const domain = String(p.domain ?? '');
        const ip = String(p.ip ?? '');
        result = await callApi('/public_api/domains/setrecord', {
          domain,
          type: 'A',
          name: '@',
          host: '@',
          value: ip,
          data: ip,
          content: ip,
          ttl: 3600,
        });
        break;
      }
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
