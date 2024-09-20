"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/PatientPage.css'; // Import your CSS file

const PatientPage = ({ params }: { params: { patientId: string } }) => {
  const [patientData, setPatientData] = useState<any>(null);
  const [observations, setObservations] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("accessToken")
        : null;

    if (!accessToken) {
      console.error("Access token not found");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch patient data
        const patientResponse = await axios.get(
          `/api/patient/${params.patientId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPatientData(patientResponse.data);

        // Fetch observation data
        const observationResponse = await axios.get(
          `/api/observation/${params.patientId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setObservations(observationResponse.data.entry);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      {/* Patient Info Section */}
      <div className="header">
        <h1>Patient Info</h1>
      </div>
      {patientData && (
        <table className="patient-info">
          <tbody>
            <tr>
              <td><strong>Name:</strong></td>
              <td>{patientData.name?.[0]?.text || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>ID:</strong></td>
              <td>{patientData.id}</td>
            </tr>
            <tr>
              <td><strong>Date of Birth:</strong></td>
              <td>{patientData.birthDate || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Address:</strong></td>
              <td>
                {patientData.address?.[0]?.line?.join(", ") || "N/A"},{" "}
                {patientData.address?.[0]?.city || "N/A"},{" "}
                {patientData.address?.[0]?.state || "N/A"},{" "}
                {patientData.address?.[0]?.postalCode || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Observations Section */}
      <div className="header">
        <h1>Observations</h1>
      </div>
      {observations && observations.length > 0 ? (
        <table className="observations-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((observation: any, index: number) => (
              <tr key={index}>
                <td>{observation.resource?.code?.text || "N/A"}</td>
                <td>
                  {observation.resource?.valueQuantity?.value || "N/A"}
                </td>
                <td>{observation.resource?.valueQuantity?.unit || "N/A"}</td>
                <td>{observation.resource?.effectiveDateTime || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No observations found for this patient.</p>
      )}
    </div>
  );
};

export default PatientPage;
