// Cloudflare Worker for LED Matrix API
export default {
  async fetch(request, env) {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only handle POST to /api/lead
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/lead') {
      try {
        const body = await request.json();
        const { name, phone, whatsapp, governorate, address, quantity, total } = body;

        // Generate order details
        const orderNumber = Math.floor(1000 + Math.random() * 9000);
        const timestamp = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
        
        let offerDetails = '';
        if (quantity === '1') {
          offerDetails = 'قطعة واحدة - 2200 جنيه';
        } else if (quantity === '2') {
          offerDetails = 'قطعتين - 3999 جنيه (وفر 401 جنيه)';
        } else {
          offerDetails = '3 قطع - 5599 جنيه (وفر 1001 جنيه)';
        }

        // Parse credentials from environment
        const credentials = JSON.parse(env.GOOGLE_CREDENTIALS);
        
        // Get access token
        const jwtHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
        const now = Math.floor(Date.now() / 1000);
        const jwtClaimSet = btoa(JSON.stringify({
          iss: credentials.client_email,
          scope: 'https://www.googleapis.com/auth/spreadsheets',
          aud: 'https://oauth2.googleapis.com/token',
          exp: now + 3600,
          iat: now
        }));

        // Import private key
        const privateKey = await crypto.subtle.importKey(
          'pkcs8',
          str2ab(atob(credentials.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, ''))),
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
          false,
          ['sign']
        );

        // Sign JWT
        const signature = await crypto.subtle.sign(
          'RSASSA-PKCS1-v1_5',
          privateKey,
          new TextEncoder().encode(`${jwtHeader}.${jwtClaimSet}`)
        );

        const jwt = `${jwtHeader}.${jwtClaimSet}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;

        // Get access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
        });

        const { access_token } = await tokenResponse.json();

        // Append to Google Sheets
        const row = [
          timestamp,
          name,
          phone,
          whatsapp,
          governorate,
          '',
          address,
          offerDetails,
          quantity,
          '',
          'غمازة السيارات',
          'جديد',
          '',
          '',
          '',
          '',
          ''
        ];

        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${env.SPREADSHEET_ID}/values/${env.SHEET_NAME}:append?valueInputOption=RAW`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ values: [row] })
          }
        );

        return new Response(JSON.stringify({ success: true, orderNumber }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};

// Helper function
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
