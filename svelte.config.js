import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use static adapter for ESP32 deployment
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // Use SPA mode with a single HTML entry point
			precompress: false,
			strict: false
		}),

		// Force SPA mode
		paths: {
			relative: false
		},

		// Minimize server-side rendering
		prerender: {
			handleMissingId: 'ignore',
			entries: ['*']
		},

		// Handle routing in a way that works with a single JS file
		alias: {
			$lib: 'src/lib'
		},

		// Ensure all files use proper ES module loading
		moduleExtensions: ['.js', '.ts', '.svelte']
	}
};

export default config;
