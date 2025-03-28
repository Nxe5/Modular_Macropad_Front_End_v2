import { browser } from '$app/environment';

/**
 * Check if the user prefers dark mode from the system
 */
export function getSystemPrefersDarkMode(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Set up a listener for system theme changes
 */
export function listenForSystemThemeChanges(callback: (isDark: boolean) => void): () => void {
	if (!browser) return () => {};

	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

	const listener = (e: MediaQueryListEvent) => {
		callback(e.matches);
	};

	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener('change', listener);
		return () => mediaQuery.removeEventListener('change', listener);
	} else {
		// For older browsers
		mediaQuery.addListener(listener);
		return () => mediaQuery.removeListener(listener);
	}
}

/**
 * Apply a theme to the document
 */
export function applyTheme(theme: 'dark' | 'light'): void {
	if (!browser) return;
	document.documentElement.setAttribute('data-theme', theme);

	// For mobile devices, set the status bar color
	if (theme === 'dark') {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1a1a1a');
	} else {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
	}
}
