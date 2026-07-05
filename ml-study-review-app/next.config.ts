import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGithubPages ? "/ml-ice-quiz-practice" : undefined,
  assetPrefix: isGithubPages ? "/ml-ice-quiz-practice/" : undefined,
};

export default nextConfig;
