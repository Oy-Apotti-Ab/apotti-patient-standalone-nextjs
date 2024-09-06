import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export async function POST(request: NextRequest) {
  // Ensure the environment variables are defined
  const tokenEndpoint = process.env.NEXT_PUBLIC_FHIR_SERVER_A;
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

  if (!tokenEndpoint || !clientId) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const body = await request.text();
  const formData = qs.parse(body);

  const code = formData.code;

  try {
    const tokenResponse = await axios.post(
      tokenEndpoint,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;
    console.log('Received access token:', access_token);

    return NextResponse.json({ access_token });
  } catch (error) {
    console.error('Error during OAuth2 token exchange:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}
