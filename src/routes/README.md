# Routes

This directory contains all of the page components for the Modular Macropad Configuration Tool. Each subdirectory represents a route in the application.

## Route Structure

- `+layout.svelte`: The main application layout that wraps all pages
- `+page.svelte`: The homepage/landing page
- `/macros/`: Macros configuration pages
- `/lighting/`: Lighting configuration pages
- `/settings/`: Device settings pages
- `/config/`: Raw configuration editor pages

## Pages

### Home (`+page.svelte`)

The landing page that provides an overview of the application and navigation to other sections.

### Macros (`/macros/+page.svelte`)

Allows users to configure macros and key mappings for the macropad.

### Lighting (`/lighting/+page.svelte`)

Provides controls for customizing the RGB lighting of the macropad.

### Settings (`/settings/+page.svelte`)

Contains general settings for the macropad and application preferences.

### Config (`/config/+page.svelte`)

Provides direct access to edit raw configuration files:

- **Info**: Basic information about the macropad
- **Components**: Hardware components configuration
- **Actions**: Key mapping and action configuration
- **LEDs**: Detailed LED settings
- **Reports**: Reporting and notification settings

## Navigation

The navigation between these pages is handled by the main Header component found in `src/lib/components/Layout/Header.svelte`.
