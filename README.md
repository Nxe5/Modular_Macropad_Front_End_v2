# Modular Macropad Configuration Tool

A modern web application for configuring and customizing your Ocho Labs Macropad device.

## Overview

This web-based tool allows you to customize and configure your mechanical macropad with powerful shortcuts and RGB lighting. The application features a clean, intuitive interface with both light and dark mode support.

## Features

- **Macros Configuration**: Create and manage custom key mappings and macros
- **Lighting Configuration**: Customize RGB lighting effects and colors
- **Settings Management**: Configure device settings
- **Raw Configuration Editor**: Directly edit device configuration files:
  - Info Configuration
  - Components Configuration
  - Actions Configuration
  - LEDs Configuration
  - Reports Configuration

## Getting Started

### Prerequisites

- Node.js (16.x or later)
- npm or yarn
- Macropad device (for full functionality)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd Modular_Macropad_Front_End_v2
   ```

2. Install dependencies:

   ```
   npm install
   ```

   or

   ```
   yarn
   ```

3. Start the development server:

   ```
   npm run dev -- --host
   ```

   or

   ```
   yarn dev --host
   ```

4. Open your browser and navigate to the displayed URL (typically http://localhost:5173)

## Project Structure

- `src/`: Main source code
  - `lib/`: Reusable components and utilities
    - `components/`: UI components
    - `api/`: API communication
    - `stores/`: Svelte stores for state management
    - `types/`: TypeScript type definitions
    - `utils/`: Utility functions
  - `routes/`: Page components (Svelte routes)
  - `app.css`: Global styles
- `mock-data/`: Mock JSON data for development and testing

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to a web server.

## Technologies

- [Svelte](https://svelte.dev/) + [SvelteKit](https://kit.svelte.dev/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [Lucide Icons](https://lucide.dev/) - SVG icon library
- CSS Variables - For theming and styling

## License

[MIT License](LICENSE)
