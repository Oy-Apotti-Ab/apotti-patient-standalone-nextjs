import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get('accessToken');
  const patientId = url.searchParams.get('patientId');

  if (!accessToken || !patientId) {
    return NextResponse.json({ error: 'Access token and patient ID are required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FHIR_SERVER}/Observation?patient=${patientId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch observation data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching observation data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
