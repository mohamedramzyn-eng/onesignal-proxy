export default {
  async fetch(request, env) {
    const allowedOrigin = (env.ALLOWED_ORIGIN || '').trim();
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const payload = await request.text();
    const apiKey = (env.ONESIGNAL_REST_API_KEY || '').trim();

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
'Authorization': `Key ${apiKey}`
      },
      body: payload
    });

    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
