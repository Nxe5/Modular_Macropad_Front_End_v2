import type { Plugin } from 'vite';
import type { OutputOptions } from 'rollup';

export default function viteLittleFS(): Plugin[] {
	return [
		{
			name: 'vite-plugin-littlefs',
			enforce: 'post',
			apply: 'build',

			async config(config) {
				if (!config.build?.rollupOptions?.output) {
					return;
				}

				const output = config.build.rollupOptions.output as OutputOptions;

				// Handle file names by removing hashes to fit LittleFS 32 char limit
				if (output.assetFileNames && typeof output.assetFileNames === 'string') {
					config.build.rollupOptions.output = {
						...output,
						assetFileNames: output.assetFileNames.replace('.[hash]', '')
					};
				}

				// Handle Client-build chunk files
				if (
					output.chunkFileNames &&
					typeof output.chunkFileNames === 'string' &&
					output.chunkFileNames.includes('hash')
				) {
					config.build.rollupOptions.output = {
						...output,
						chunkFileNames: output.chunkFileNames.replace('.[hash]', ''),
						entryFileNames:
							typeof output.entryFileNames === 'string'
								? output.entryFileNames.replace('.[hash]', '')
								: output.entryFileNames
					};
				}
			}
		}
	];
}
