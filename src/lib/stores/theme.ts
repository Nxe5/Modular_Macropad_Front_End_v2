import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize with dark mode
const initialTheme =
	browser && localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark';

export const theme = writable<'light' | 'dark'>(initialTheme as 'light' | 'dark');

// Save theme to localStorage when it changes
theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		document.documentElement.setAttribute('data-theme', value);
	}
});

export const toggleTheme = () => {
	theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
};
