import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content-Security-Policy is intentionally NOT set here.
          // It needs a fresh nonce per request to allow Next.js's own
          // inline hydration scripts to run without 'unsafe-inline', and a
          // static header in next.config.ts can't generate one. It's set
          // per-request in src/utils/supabase/middleware.ts instead.
        ],
      },
    ];
  },
};

export default nextConfig;
