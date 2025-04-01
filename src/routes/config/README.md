# Config Route

This directory contains the pages for the Raw Configuration section of the Modular Macropad Configuration Tool.

## Purpose

The Config section allows users to directly edit the raw configuration files of the macropad, providing advanced customization options beyond what's available in the standard UI.

## Components

- `+page.svelte`: The main Config page with tabbed navigation

## Tabs

The page includes five tabs for different configuration sections:

1. **Info**

   - Purpose: Basic device information and settings
   - Icon: Info icon
   - Data file: `/mock-data/config/info.json`

2. **Components**

   - Purpose: Hardware component configurations (buttons, encoders, etc.)
   - Icon: CPU icon
   - Data file: `/mock-data/config/components.json`

3. **Actions**

   - Purpose: Key mappings and input action definitions
   - Icon: Play icon
   - Data file: `/mock-data/config/actions.json`

4. **LEDs**

   - Purpose: LED lighting configurations and effects
   - Icon: Lightbulb icon
   - Data file: `/mock-data/config/leds.json`

5. **Reports**
   - Purpose: Device reporting and notification settings
   - Icon: File Text icon
   - Data file: `/mock-data/config/reports.json`

## Implementation Details

The tab system is implemented using Svelte's conditional rendering:

```svelte
{#if activeTab === 'info'}
	<!-- Info tab content -->
{:else if activeTab === 'components'}
	<!-- Components tab content -->
{/if}
```

Each tab has its own panel with title, description, and content area.

## Usage

1. Navigate to the Config section from the main navigation
2. Select the desired tab to view and edit that configuration section
3. Make changes to the configuration
4. Save changes to update the device configuration

## Future Enhancements

- Add JSON validation to prevent invalid configurations
- Implement schema-based form generation for easier editing
- Add import/export functionality for configuration backups
