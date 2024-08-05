/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_FHIR_SERVER: process.env.NEXT_PUBLIC_FHIR_SERVER,
    CLIENT_ID: process.env.CLIENT_ID,
  },
};

export default nextConfig;

  



// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
