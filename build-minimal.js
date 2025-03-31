/**
 * Builds a minimal SvelteKit application with flattened structure:
 * - index.html
 * - vite.svg
 * - assets/
 *   - index.js
 *   - index.css
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { rmSync } from 'fs';

// Configuration
const BUILD_DIR = './build';
const ASSETS_DIR = path.join(BUILD_DIR, 'assets');
const STATIC_DIR = './static';

// Clean build directory if it exists
console.log('Cleaning build directory...');
if (fs.existsSync(BUILD_DIR)) {
	rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Build the application with vite
console.log('Building SvelteKit application with Vite...');
try {
	execSync('vite build', { stdio: 'inherit' });
} catch (error) {
	console.error('Error building application:', error);
	process.exit(1);
}

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
	fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Handle vite.svg
if (fs.existsSync(path.join(STATIC_DIR, 'vite.svg'))) {
	fs.copyFileSync(path.join(STATIC_DIR, 'vite.svg'), path.join(BUILD_DIR, 'vite.svg'));
	console.log('Copied vite.svg to build directory');
} else if (fs.existsSync(path.join(STATIC_DIR, 'favicon.png'))) {
	// Use favicon.png as vite.svg
	fs.copyFileSync(path.join(STATIC_DIR, 'favicon.png'), path.join(BUILD_DIR, 'vite.svg'));
	console.log('Used favicon.png as vite.svg');
} else {
	// Create a placeholder SVG
	const placeholderSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="100%" height="100%" fill="#646cff"/></svg>';
	fs.writeFileSync(path.join(BUILD_DIR, 'vite.svg'), placeholderSvg);
	console.log('Created placeholder vite.svg');
}

// Create manifest for properly including all modules
console.log('Analyzing and tracking import dependencies...');

// Read the index.html to find entry points
if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
	console.error('index.html not found in build directory!');
	process.exit(1);
}

const htmlContent = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
const importRegex = /import\("([^"]+)"\)/g;
const preloadRegex = /<link rel="modulepreload" href="([^"]+)">/g;

// Collect entry points from HTML
const entryPoints = new Set();
let match;

// Find imports in script tags
while ((match = importRegex.exec(htmlContent)) !== null) {
	entryPoints.add(match[1]);
}

// Find preloaded modules
while ((match = preloadRegex.exec(htmlContent)) !== null) {
	entryPoints.add(match[1]);
}

console.log(`Found ${entryPoints.size} entry points in HTML`);

// Process app directory if it exists
const appDir = path.join(BUILD_DIR, '_app');
if (fs.existsSync(appDir)) {
	// Find all CSS files
	const cssFiles = [];
	function findCssFiles(dir) {
		if (!fs.existsSync(dir)) return;

		const files = fs.readdirSync(dir);
		files.forEach((file) => {
			const filePath = path.join(dir, file);
			if (fs.statSync(filePath).isDirectory()) {
				findCssFiles(filePath);
			} else if (file.endsWith('.css')) {
				cssFiles.push(filePath);
			}
		});
	}

	console.log('Copying CSS files...');
	findCssFiles(appDir);

	// Combine all CSS into one file
	if (cssFiles.length > 0) {
		let combinedCss = '';
		cssFiles.forEach((file) => {
			console.log(`Adding CSS: ${path.relative(BUILD_DIR, file)}`);
			const content = fs.readFileSync(file, 'utf8');
			combinedCss += `/* ${path.basename(file)} */\n${content}\n\n`;
		});

		fs.writeFileSync(path.join(ASSETS_DIR, 'index.css'), combinedCss);
		console.log(`Combined ${cssFiles.length} CSS files into assets/index.css`);
	}

	// Extract the modules specified in the entry points
	const moduleContents = {};
	const missingModules = new Set();

	// Function to normalize module path
	function normalizeModulePath(modulePath) {
		// Resolve relative paths to absolute
		if (modulePath.startsWith('/_app/')) {
			return path.join(BUILD_DIR, modulePath.substring(1));
		}
		return path.join(BUILD_DIR, modulePath);
	}

	// Initialize with entry points
	Array.from(entryPoints).forEach((entry) => {
		const normalizedPath = normalizeModulePath(entry);
		if (fs.existsSync(normalizedPath)) {
			moduleContents[entry] = fs.readFileSync(normalizedPath, 'utf8');
		} else {
			missingModules.add(entry);
			console.warn(`Warning: Entry module not found: ${entry}`);
		}
	});

	console.log(`Collected ${Object.keys(moduleContents).length} modules`);

	// Extract additional module dependencies
	const importRegexInJs = /import\s*(?:[\w*{}[\],\s]+from\s*)?\s*["']([^"']+)["']/g;

	// Also look for dynamic imports
	const dynamicImportRegex = /import\(["']([^"']+)["']\)/g;

	// Recursively find all import dependencies
	function findAllImports() {
		let foundNew = false;

		Object.entries(moduleContents).forEach(([modulePath, content]) => {
			// Check static imports
			let importMatch;
			while ((importMatch = importRegexInJs.exec(content)) !== null) {
				const importPath = importMatch[1];

				// Skip external imports
				if (importPath.startsWith('http') || !importPath.startsWith('/')) {
					continue;
				}

				const normalizedImport = normalizeModulePath(importPath);
				if (!moduleContents[importPath] && fs.existsSync(normalizedImport)) {
					moduleContents[importPath] = fs.readFileSync(normalizedImport, 'utf8');
					foundNew = true;
				}
			}

			// Check dynamic imports
			let dynamicMatch;
			while ((dynamicMatch = dynamicImportRegex.exec(content)) !== null) {
				const importPath = dynamicMatch[1];

				// Skip external imports
				if (importPath.startsWith('http') || !importPath.startsWith('/')) {
					continue;
				}

				const normalizedImport = normalizeModulePath(importPath);
				if (!moduleContents[importPath] && fs.existsSync(normalizedImport)) {
					moduleContents[importPath] = fs.readFileSync(normalizedImport, 'utf8');
					foundNew = true;
				}
			}
		});

		return foundNew;
	}

	// Keep finding imports until no new ones are found
	let iterationCount = 0;
	while (findAllImports() && iterationCount < 5) {
		iterationCount++;
		console.log(`Found additional imports, iteration ${iterationCount}`);
	}

	console.log(`Final module count: ${Object.keys(moduleContents).length}`);

	// Create a combined JavaScript file
	let combinedJs = '';

	// Add module registration magic
	combinedJs = `// Flattened SvelteKit modules
const moduleCache = new Map();
const originalImport = window.import;

// Override import to use our flattened modules
window.import = function(modulePath) {
	if (moduleCache.has(modulePath)) {
		return Promise.resolve(moduleCache.get(modulePath));
	}

	// Fall back to original import for external modules
	return originalImport(modulePath);
};

// Register all modules
${Object.entries(moduleContents)
	.map(([modulePath, content]) => {
		// Escape any backticks in the content
		const escapedContent = content.replace(/`/g, '\\`');

		return `
// Module: ${modulePath}
(function registerModule() {
	const exports = {};
	const module = { exports };

	// Module code
	${escapedContent}

	// Store in cache
	moduleCache.set('${modulePath}', module.exports);
})();
`;
	})
	.join('\n')}

// Initialize app with entry points
Promise.all([
	${Array.from(entryPoints)
		.map((entry) => `window.import('${entry}')`)
		.join(',\n  ')}
]).then(([kit, app]) => {
	if (kit && kit.start && app) {
		const element = document.querySelector('[data-sveltekit-preload-data="hover"]')?.firstElementChild;
		if (element) {
			kit.start(app, element);
		}
	}
}).catch(err => {
	console.error('Error initializing app:', err);
});
`;

	fs.writeFileSync(path.join(ASSETS_DIR, 'index.js'), combinedJs);
	console.log(`Created combined JavaScript bundle in assets/index.js`);

	// Remove the _app directory now that we've extracted what we need
	rmSync(appDir, { recursive: true, force: true });
	console.log('Removed _app directory');
}

// Update index.html to point to our flattened assets
console.log('Updating index.html...');
if (fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
	// Create a simplified HTML file
	const simpleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Modular Macropad</title>
	<link rel="icon" type="image/svg+xml" href="/vite.svg">
	<link rel="stylesheet" href="/assets/index.css">
</head>
<body data-sveltekit-preload-data="hover">
	<div style="display: contents"></div>
	<script type="module" src="/assets/index.js"></script>
</body>
</html>`;

	fs.writeFileSync(path.join(BUILD_DIR, 'index.html'), simpleHtml);
	console.log('Created simplified index.html');
}

// Remove any additional HTML files except index.html
fs.readdirSync(BUILD_DIR).forEach((file) => {
	const filePath = path.join(BUILD_DIR, file);
	if (fs.statSync(filePath).isFile() && file.endsWith('.html') && file !== 'index.html') {
		fs.unlinkSync(filePath);
		console.log(`Removed ${file}`);
	}
});

// Remove favicon.png if it exists (we've renamed it to vite.svg)
const faviconPath = path.join(BUILD_DIR, 'favicon.png');
if (fs.existsSync(faviconPath)) {
	fs.unlinkSync(faviconPath);
	console.log('Removed favicon.png');
}

console.log('\nBuild complete! Minimal structure created:');
console.log('- build/index.html');
console.log('- build/vite.svg');
console.log('- build/assets/index.js');
console.log('- build/assets/index.css');
