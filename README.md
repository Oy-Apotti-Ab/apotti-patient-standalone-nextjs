# Apotti Patient Standalone App (Next.js)

This project is a standalone patient-facing application that allows patients to enter and view their observations. It interacts with a FHIR server to retrieve and create patient observations using the SMART on FHIR protocol. This application is built using Next.js with TypeScript.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [File Structure](#file-structure)
- [Patient Data Handling](#patient-data-handling)
- [License](#license)

## Features
- **Patient Data Display**: Displays patient information (Name, ID, Date of Birth, Address) retrieved from the FHIR server.
- **Observations Display**: Shows the patient's observations in a table, sorted by the `effectiveDateTime` in descending order.
- **Observation Creation**: Allows patients to create new observations by filling out a form.
- **SMART on FHIR Authentication**: Utilizes the SMART on FHIR protocol for OAuth2 authentication.

## Technologies
- **Next.js** (v13+)
- **React** (v18+)
- **TypeScript** (for type safety)
- **CSS Modules** (for styling)
- **Axios** (for data fetching)
- **FHIR** (Fast Healthcare Interoperability Resources)

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/apotti-patient-standalone.git
