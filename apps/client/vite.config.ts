import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	resolve: {
		conditions: ["browser", "development", "default"],
		alias: {
			"@market-engine/types": path.resolve(import.meta.dirname, "../../packages/types/index.ts"),
			"@market-engine/utils": path.resolve(import.meta.dirname, "../../packages/utils"),
			"@screens": path.resolve(import.meta.dirname, "src/screens"),
			"@theme": path.resolve(import.meta.dirname, "src/theme"),
			"@context": path.resolve(import.meta.dirname, "src/context"),
			"@type": path.resolve(import.meta.dirname, "src/types"),
			"@interfaces": path.resolve(import.meta.dirname, "src/interfaces"),
			"@utils": path.resolve(import.meta.dirname, "src/utils"),
			"@layouts": path.resolve(import.meta.dirname, "src/layouts"),
			"@components": path.resolve(import.meta.dirname, "src/components"),
			"@features": path.resolve(import.meta.dirname, "src/features"),
		},
	},
});
