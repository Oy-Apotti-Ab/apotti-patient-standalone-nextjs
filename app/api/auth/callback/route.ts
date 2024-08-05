import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import qs from 'qs';

interface TokenResponse {
  access_token: string;
  patient: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  const tokenEndpoint = `${process.env.NEXT_PUBLIC_FHIR_SERVER_A}/token`;
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

  const tokenRequestBody = qs.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code for access token');
    }

    const tokenData = await response.json() as TokenResponse;
    const { access_token, patient } = tokenData;

    const redirectUrl = new URL('http://localhost:3000/');
    redirectUrl.searchParams.append('accessToken', access_token);
    redirectUrl.searchParams.append('patientId', patient);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
