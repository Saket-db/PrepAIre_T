import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(__dirname, "credentials", "service-account.json");

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    GOOGLE_CREDENTIALS: fs.existsSync(serviceAccountPath)
      ? fs.readFileSync(serviceAccountPath, "utf-8")
      : "",
  },
};

export default nextConfig;
