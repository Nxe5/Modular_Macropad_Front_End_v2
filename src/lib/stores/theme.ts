import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// Get initial theme from localStorage or default to light
const getInitialTheme = (): Theme => {
	if (!browser) return 'light';

	const savedTheme = localStorage.getItem('theme');
	return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'light';
};

// Create the store
export const theme = writable<Theme>(getInitialTheme());

// Initialize theme attributes on document if in browser
if (browser) {
	// Set initial theme attribute
	document.documentElement.setAttribute('data-theme', getInitialTheme());

	// Subscribe to theme changes
	theme.subscribe((value) => {
		// Update localStorage
		localStorage.setItem('theme', value);

		// Update document attribute
		document.documentElement.setAttribute('data-theme', value);
	});
}

// Update theme in the DOM
function updateTheme(newTheme: 'light' | 'dark'): void {
	if (newTheme === 'dark') {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}

// Toggle between light and dark themes
export function toggleTheme(): void {
	theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
}

// Set a specific theme
export function setTheme(newTheme: 'light' | 'dark'): void {
	theme.set(newTheme);
}

// Use system theme (clears saved preference)
export function useSystemTheme(): void {
	if (browser) {
		localStorage.removeItem('theme');
		theme.set(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	}
}
