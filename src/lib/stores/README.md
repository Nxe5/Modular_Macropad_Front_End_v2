# Stores

This directory contains Svelte stores used for state management throughout the application.

## Available Stores

### Theme Store (`theme.ts`)

Manages the application theme (light/dark mode).

```typescript
import { theme } from '$lib/stores/theme';

// Get the current theme
console.log($theme); // 'light' or 'dark'

// Toggle the theme
theme.update((current) => (current === 'dark' ? 'light' : 'dark'));

// Set a specific theme
theme.set('dark');
```

The theme store automatically:

- Persists the theme selection in localStorage
- Applies the theme to the document by setting the data-theme attribute
- Initializes from localStorage or defaults to 'light'

## Store Principles

1. **Simplicity**: Stores should be as simple as possible while still meeting needs
2. **Reactivity**: Use Svelte's reactive stores to ensure UI updates when state changes
3. **Persistence**: For user preferences, persist state to localStorage where appropriate
4. **Typing**: Use TypeScript for type safety in store values and methods

## Adding New Stores

When adding a new store:

1. Create a new file with a descriptive name (e.g., `connection.ts` for connection state)
2. Export the store using Svelte's store mechanisms (writable, readable, or derived)
3. Document the store's purpose and usage at the top of the file
4. Add usage examples to this README for reference

## Usage with Components

Import stores in components using:

```typescript
import { storeName } from '$lib/stores/storeName';
```

Access the store value in the component with the $ prefix:

```html
<script>
	import { theme } from '$lib/stores/theme';
</script>

<div class="my-component" data-theme="{$theme}">Current theme: {$theme}</div>
```
