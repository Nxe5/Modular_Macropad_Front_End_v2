import { writable } from 'svelte/store';
import type { MacropadConfig } from '$lib/types/config';

const defaultConfig: MacropadConfig = {
	name: 'Default Macropad',
	version: '1.0.0',
	buttons: [],
	encoders: [],
	display: {
		brightness: 100,
		timeout: 30,
		defaultScreen: 'main'
	}
};

export const config = writable<MacropadConfig>(defaultConfig);

export const updateConfig = (newConfig: Partial<MacropadConfig>) => {
	config.update((current) => ({
		...current,
		...newConfig
	}));
};
