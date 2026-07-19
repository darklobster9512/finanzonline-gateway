import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    // Verify caller is admin
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const token = authHeader.replace('Bearer ', '')
    const { data: claims, error: claimsErr } = await anonClient.auth.getClaims(token)
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check admin role
    const { data: isAdmin } = await adminClient.rpc('has_role', {
      _user_id: claims.claims.sub,
      _role: 'admin'
    })
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders })
    }

    // Stream all leads in batches
    const BATCH = 50000
    let offset = 0
    const chunks: string[] = []

    while (true) {
      const { data, error } = await adminClient
        .from('leads')
        .select('phone')
        .order('created_at', { ascending: true })
        .range(offset, offset + BATCH - 1)

      if (error) throw error
      if (!data || data.length === 0) break

      chunks.push(data.map((r: any) => r.phone).join('\n'))
      if (data.length < BATCH) break
      offset += BATCH
    }

    const body = chunks.join('\n')
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-backup-${ts}.txt"`,
      },
    })
  } catch (err) {
    console.error('leads-export error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
