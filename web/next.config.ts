import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const basePath = isGithubActions && repository ? `/${repository}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
