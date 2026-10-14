import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { bankName, keys } = await req.json();
    if (!bankName || !Array.isArray(keys) || keys.length === 0) {
      return new Response(JSON.stringify({ error: 'bankName and keys required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ key: null, error: 'no api key' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sys = `Du ordnest einen Banknamen aus einer IBAN-Datenbank genau einer deutschen Bankseite zu. Du bekommst eine Liste erlaubter Keys. Antworte als JSON {"key": "<einer der Keys>" | null}. Wähle null, wenn keiner klar passt. "Deutsche Bank Privat- und Geschäftskunden" => "Deutsche Bank". "comdirect bank" => "comdirect". Sparkassen (z.B. "Berliner Sparkasse", "Sparkasse Köln") => "Sparkasse". Genossenschaftsbanken/Volksbanken/Raiffeisenbanken => "Berliner Volksbank". "Sparda-Bank West" oder andere Sparda => "Sparda-Bank West".`;
    const user = `Erlaubte Keys: ${JSON.stringify(keys)}\nBankname: ${bankName}`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        reasoning_effort: 'low',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'bank_match',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: { key: { type: ['string', 'null'] } },
              required: ['key'],
            },
          },
        },
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error('gateway error', res.status, txt);
      return new Response(JSON.stringify({ key: null }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '{}';
    let parsed: { key: string | null } = { key: null };
    try { parsed = JSON.parse(content); } catch { /* ignore */ }
    const key = parsed.key && keys.includes(parsed.key) ? parsed.key : null;

    return new Response(JSON.stringify({ key }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ key: null, error: String(e) }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
