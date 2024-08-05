"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const patientId = urlParams.get('patientId');

    if (accessToken && patientId) {
      setAccessToken(accessToken);
      setPatientId(patientId);
    }
  }, []);

  const handleSignIn = () => {
    //const authorizeUrl = `${process.env.NEXT_PUBLIC_FHIR_SERVER_A}/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/callback&scope=openid%20profile%20patient.read`;
    const authorizeUrl = `${process.env.NEXT_PUBLIC_FHIR_SERVER_A}/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&launch=YOUR_LAUNCH_ID`;
    window.location.href = authorizeUrl;
  };

  return (
    <div>
      <h1>Welcome to the Apotti Patient Standalone App</h1>
      <button onClick={handleSignIn}>Sign In</button>
      {accessToken && patientId && (
        <div>
          <h2>Patient ID: {patientId}</h2>
          <Link href={`/patient?accessToken=${accessToken}&patientId=${patientId}`}>
            <a>View Patient Data</a>
          </Link>
        </div>
      )}
    </div>
  );
}
