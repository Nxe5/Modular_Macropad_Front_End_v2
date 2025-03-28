import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
	getSystemPrefersDarkMode,
	applyTheme,
	listenForSystemThemeChanges
} from '$lib/utils/theme';

export type Theme = 'light' | 'dark';

// Initialize theme from localStorage or system preference
const getInitialTheme = (): Theme => {
	if (!browser) return 'dark';

	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'light' || savedTheme === 'dark') {
		return savedTheme;
	}

	return getSystemPrefersDarkMode() ? 'dark' : 'light';
};

// Create the theme store
export const theme = writable<Theme>(getInitialTheme());

// Apply the theme when it changes
if (browser) {
	// Apply initial theme
	applyTheme(getInitialTheme());

	// Subscribe to theme changes
	theme.subscribe((value) => {
		localStorage.setItem('theme', value);
		applyTheme(value);
	});

	// Set up listener for system theme changes
	const unsubscribe = listenForSystemThemeChanges((isDark) => {
		const currentTheme = localStorage.getItem('theme');
		// Only update if the user hasn't explicitly set a preference
		if (!currentTheme) {
			theme.set(isDark ? 'dark' : 'light');
		}
	});
}

// Toggle between light and dark themes
export function toggleTheme(): void {
	theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
}

// Set a specific theme
export function setTheme(newTheme: Theme): void {
	theme.set(newTheme);
}

// Use system theme (clears saved preference)
export function useSystemTheme(): void {
	if (browser) {
		localStorage.removeItem('theme');
		theme.set(getSystemPrefersDarkMode() ? 'dark' : 'light');
	}
}
