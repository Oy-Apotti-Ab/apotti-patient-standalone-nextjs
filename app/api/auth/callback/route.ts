import axios, { AxiosError } from 'axios';
import qs from 'qs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('inside GET');

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  const tokenEndpoint = process.env.NEXT_PUBLIC_FHIR_SERVER_A;
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const state = '1234';

  try {
    const tokenResponse = await axios.post(
      `${tokenEndpoint}/token`,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        state,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, patient } = tokenResponse.data;
    return NextResponse.redirect(
      `http://localhost:3000/patient/${patient}?accessToken=${access_token}`
    );
    
  } catch (error) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status || 500;
    const errorMessage = axiosError.response?.data || 'Internal server error';

    console.error('Error exchanging authorization code for access token:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: statusCode });
  }
}
