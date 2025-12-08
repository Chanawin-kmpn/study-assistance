import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "20mb",
		},
		proxyClientMaxBodySize: "20mb",
	},
	serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;
