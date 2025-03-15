# Source Code Submission Information for Highletz

This document contains information for Mozilla Add-on reviewers about building this extension from source code.

## Build Environment Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: version 16.x or later (recommend v18.x)
- **Package Manager**: pnpm 6.x or later (npm 7.x+ or Yarn 1.22.x+ will also work)
- **Build Tools**: The build process requires a basic build environment with Git

## Required Tools and Versions

- Node.js v16.x or later (https://nodejs.org/)
- pnpm v6.x or later (https://pnpm.io/installation)
- (Optional) ImageMagick for icon generation (https://imagemagick.org/)

## Step-by-Step Build Instructions

1. **Clone or extract the source code**
   ```bash
   git clone https://github.com/yourusername/github-file-highlighter.git
   # Or extract the submitted zip file
   cd github-file-highlighter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # Alternative with npm: npm install
   ```

3. **Generate icons** (optional - pre-built icons are included in the repository)
   ```bash
   pnpm generate-icons
   # Alternative with npm: npm run generate-icons
   ```

4. **Build the extension**
   ```bash
   pnpm build
   # Alternative with npm: npm run build
   ```

5. **Package for Firefox**
   ```bash
   pnpm package:firefox
   # Alternative with npm: npm run package:firefox
   ```

   This will create a `.xpi` file in the `extensions/firefox-v1.0.0/` directory.

## Build Process Details

The build process:

1. Transpiles TypeScript code to JavaScript using ts-loader and webpack
2. Processes CSS with PostCSS, including Tailwind CSS and autoprefixer
3. Bundles scripts and stylesheets with webpack
4. Copies static assets and manifest.json to the dist folder
5. Packages everything into a browser-specific extension file

## Project Structure

- `src/` - Source code files
  - `background/` - Extension background script
  - `content/` - Content scripts that run on GitHub pages
  - `popup/` - Extension popup UI
  - `styles/` - CSS files
  - `utils/` - Utility functions and build scripts
- `public/` - Static assets
- `dist/` - Build output (generated)
- `extensions/` - Packaged extensions (generated)

## Source Files

Source files are written in TypeScript and CSS. They are transpiled and processed during the build. No source files are pre-minified or obfuscated.

## Third-Party Libraries

All third-party libraries are managed via npm/pnpm and are listed in the package.json file.
