import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import viteLittleFS from './vite-plugin-littlefs';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Shorten file names for LittleFS 32 char limit
		viteLittleFS()
	],
	build: {
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: () => 'bundle',
				entryFileNames: 'assets/index.js',
				chunkFileNames: 'assets/index.js',
				assetFileNames: (assetInfo) => {
					const name = assetInfo.name || '';
					if (name.endsWith('.css')) {
						return 'assets/index.css';
					}
					return 'assets/[name].[ext]';
				}
			}
		}
	}
});
