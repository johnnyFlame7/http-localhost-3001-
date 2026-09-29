/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kbrandmusisc.com" }],
        destination: "https://kbrandmusisc.com/:path*",
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
