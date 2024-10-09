"use client"; // Ensure this is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '../../styles/PatientPage.css'; // Import the CSS file.

const PatientPage = ({ params }: { params: { patientId: string } }) => {
  const [patientData, setPatientData] = useState<any>(null);
  const [observations, setObservations] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if running in the browser before trying to access window
  useEffect(() => {
    const accessToken = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('accessToken')
      : null;

    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientResponse = await axios.get(`/api/patient/${params.patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatientData(patientResponse.data);

        // Fetch observation data
        const observationResponse = await axios.get(`/api/observation/${params.patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Sort observations by effectiveDateTime in descending order
        const sortedObservations = observationResponse.data.entry.sort((a: any, b: any) => {
          return new Date(b.resource.effectiveDateTime).getTime() - new Date(a.resource.effectiveDateTime).getTime();
        });

        setObservations(sortedObservations);
        console.log('>>>Sorted Observations:', sortedObservations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.patientId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Patient Info</h1>
      </div>

      {patientData && (
        <div className="patient-info">
          <table>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{patientData.name?.[0]?.text || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>ID:</strong></td>
                <td>{patientData.id}</td>
              </tr>
              <tr>
                <td><strong>Date of Birth:</strong></td>
                <td>{patientData.birthDate || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Address:</strong></td>
                <td>{patientData.address?.[0]?.text || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="header">
        <h1>Observations</h1>
      </div>

      {observations && observations.length > 0 ? (
        <div>
          <table className="observations-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Value</th>
                <th>Unit</th>
                <th>DateTime</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((observation: any, index: number) => (
                <tr key={index}>
                  <td>{observation.resource.code?.text || 'N/A'}</td>
                  <td>{observation.resource.valueQuantity?.value || 'N/A'}</td>
                  <td>{observation.resource.valueQuantity?.unit || 'N/A'}</td>
                  <td>{new Date(observation.resource.effectiveDateTime).toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No observations found for this patient.</p>
      )}
    </div>
  );
};

export default PatientPage;

