/**
 * Static export so the site can be hosted anywhere (GitHub Pages, Netlify, S3...).
 * `npm run build` writes plain HTML/JS/CSS into ./out
 *
 * NEXT_PUBLIC_BASE_PATH: set this when hosting under a sub-path,
 * e.g. GitHub Pages project sites live at https://<user>.github.io/<repo>
 * → NEXT_PUBLIC_BASE_PATH=/<repo>. Leave empty for local dev / custom domains.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
