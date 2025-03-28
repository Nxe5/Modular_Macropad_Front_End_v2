# Components

This directory contains reusable UI components for the Modular Macropad Configuration Tool.

## Directory Structure

- `/Layout/`: Components for page layout
  - `Header.svelte`: Main navigation header with app title, navigation links, connection status, and theme toggle
  - `Footer.svelte`: Application footer with copyright information
- `/shared/`: Shared UI components used across multiple pages
  - `ThemeToggle.svelte`: Light/dark mode toggle button
  - `JsonEditor.svelte`: JSON editor component for editing configuration files
- `/ui/`: Base UI components (buttons, inputs, cards, etc.)
- `/macro/`: Components specific to macro configuration
- `/lighting/`: Components specific to lighting configuration

## Key Components

### Header (`Layout/Header.svelte`)

The main navigation component that appears at the top of every page. It includes:

- Logo/title on the left
- Navigation links in the center
- Connection status indicator and theme toggle on the right

### ThemeToggle (`shared/ThemeToggle.svelte`)

A button that toggles between light and dark themes. It uses the theme store to manage application-wide theme state.

### JsonEditor (`shared/JsonEditor.svelte`)

An editor component that allows users to view and edit JSON configuration files with syntax highlighting and validation.

## Usage Guidelines

1. **Component Organization**:

   - Place page-specific components in their respective route directories
   - Place shared components in the `/shared/` directory
   - Place layout components in the `/Layout/` directory

2. **Component Naming**:

   - Use PascalCase for component file names (e.g., `ButtonGroup.svelte`)
   - Make names descriptive of the component's function

3. **Props and Events**:
   - Document component props at the top of each component file
   - Use TypeScript interfaces for complex prop types
   - Export event dispatchers for component events
