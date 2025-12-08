import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "20mb",
		},
		proxyClientMaxBodySize: "20mb",
	},
	serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		config.resolve.alias.encoding = false;

		return config;
	},
};

export default nextConfig;
