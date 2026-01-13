/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
  // typescript: {
  //   ignoreBuildErrors: true,
  //   tsconfigPath: "tsconfig.json",
  // },
};

export default nextConfig;
