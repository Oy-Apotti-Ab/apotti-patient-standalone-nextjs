import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, { params }: { params: { patientId: string } }) {
  const FHIR_SERVER_URL = process.env.NEXT_PUBLIC_FHIR_SERVER;
  const patientId = params.patientId; // Extract patientId from the route params

  // Extract the accessToken from the Authorization header
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]; 

  console.log('FHIR_SERVER_URL',FHIR_SERVER_URL);
  console.log('observation patientId:', patientId);
  console.log('observation accessToken:', accessToken);

  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }

  try {

    const response = await axios.get(`${FHIR_SERVER_URL}/Observation`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        patient: patientId,
        category: 'vital-signs', // Assuming this is part of the observation request
      },
    });
    //console.log('FHIR Server Response Data:', response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching observation data:', error);
    return NextResponse.json({ error: 'Failed to fetch observations' }, { status: error.response?.status || 500 });
  }
}
