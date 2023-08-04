/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  env: {
    HOST_URL: process.env.VERCEL_URL || "localhost:3000",
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
    GITHUB_OWNER: process.env.GITHUB_OWNER || "",
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  },
};

export default config;
