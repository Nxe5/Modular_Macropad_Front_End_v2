# Modular Macropad Frontend

A web-based configuration tool for the ESP32 Modular Macropad. This application allows you to customize your macropad's buttons, encoders, display, and macros.

## Features

- Configure macropad layout and components
- Customize buttons with different actions and colors
- Define encoder rotation and press behaviors
- Adjust display settings
- Create and edit macros
- Dark mode support

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or pnpm

### Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
pnpm build
```

## Project Structure

```
modular-macropad-frontend/
├── src/
│   ├── lib/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Display/
│   │   │   ├── Encoder/
│   │   │   └── Layout/
│   │   ├── stores/               # Svelte stores for state management
│   │   ├── types/                # TypeScript type definitions
│   │   ├── api/                  # API client and endpoints
│   │   └── utils/                # Utility functions
│   ├── routes/                   # SvelteKit routes
│   └── app.html
├── static/                       # Static assets
├── tests/                        # Test files
├── mock-data/                    # Mock data for development
├── package.json
├── svelte.config.js
├── tsconfig.json
└── README.md
```

## Connecting to the Macropad

By default, the application connects to `http://localhost:8080` for development. To connect to your actual ESP32 macropad, update the `API_BASE_URL` in `src/lib/api/client.ts` with your macropad's IP address.

## License

MIT
