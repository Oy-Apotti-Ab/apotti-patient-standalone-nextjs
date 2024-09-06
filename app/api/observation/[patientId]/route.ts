import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest, { params }: { params: { patientId: string } }) {
  const { patientId } = params;
  const FHIR_SERVER_URL = process.env.NEXT_PUBLIC_FHIR_SERVER!;
  const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '');

  console.log('API route hit: /api/observation/[patientId]');
  console.log('Received patientId:', patientId);
  console.log('Extracted access token:', accessToken);
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await axios.get(`${FHIR_SERVER_URL}/Observation?patient=${patientId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    console.log('FHIR server response status:', response.status);
    const observationData = response.data;

    return NextResponse.json(observationData, { status: 200 });
  } catch (error) {
    console.error('Error fetching observation data:', error);
    return NextResponse.json({ error: 'Failed to fetch observation data' }, { status: 500 });
  }
}