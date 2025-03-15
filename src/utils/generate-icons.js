import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

/**
 * This script generates SVG and PNG icons for the extension
 * It can be run with Node.js to create the icons in /public/assets/
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Please don't change the SVG content unless you know what you're doing
// Icon content - a simple SVG for the extension
const generateSvgIcon = (color = '#2ea44f') => `
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect x="10" y="10" width="108" height="108" rx="12" fill="#f0f6fc" stroke="#24292e" stroke-width="3"/>
  <rect x="20" y="30" width="88" height="12" rx="2" fill="${color}" opacity="0.8"/>
  <rect x="20" y="50" width="88" height="12" rx="2" fill="#d97706" opacity="0.8"/>
  <rect x="20" y="70" width="88" height="12" rx="2" fill="#58a6ff" opacity="0.8"/>
  <rect x="20" y="90" width="60" height="12" rx="2" fill="#24292e" opacity="0.5"/>
  <path d="M117,25 L106,25 L106,20 C106,17.2 103.8,15 101,15 L81,15 C78.2,15 76,17.2 76,20 L76,25 L65,25 C63.3,25 62,26.3 62,28 L62,28 C62,29.7 63.3,31 65,31 L117,31 C118.7,31 120,29.7 120,28 L120,28 C120,26.3 118.7,25 117,25 Z M82,20 C82,20.6 82.4,21 83,21 L99,21 C99.6,21 100,20.6 100,20 L100,20 C100,19.4 99.6,19 99,19 L83,19 C82,19.4 82,20 L82,20 Z" fill="#2ea44f"/>
</svg>
`;

// Ensure the output directory exists
const outputDir = path.resolve(__dirname, '../../public/assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the SVG file
const svgPath = path.join(outputDir, 'icon.svg');
fs.writeFileSync(svgPath, generateSvgIcon());

console.log('SVG generated at:', svgPath);

// Try to generate PNGs if ImageMagick is available
const sizes = [128, 48, 16];
let hasImageMagick = false;

// Improved detection: Try running 'magick -version' via cmd and check output
try {
  const versionOutput = execSync('cmd /c magick -version', { encoding: 'utf8', stdio: 'pipe' });
  if (versionOutput.includes('ImageMagick')) {
    hasImageMagick = true;
  }
} catch (error) {
  console.log('Initial ImageMagick check failed:', error.message);
}

if (!hasImageMagick) {
  console.log('ImageMagick not found. Skipping PNG generation.');
  console.log('To generate PNGs, install ImageMagick and run in cmd:');
  sizes.forEach(size => {
    console.log(`  cmd /c magick convert -background transparent "${svgPath}" -resize ${size}x${size} "${path.join(outputDir, `icon-${size}.png`)}"`);
  });
} else {
  sizes.forEach(size => {
    const pngPath = path.join(outputDir, `icon-${size}.png`);
    try {
      execSync(`cmd /c magick convert -background transparent "${svgPath}" -resize ${size}x${size} "${pngPath}"`, { stdio: 'inherit' });
      console.log(`Generated: ${pngPath}`);
    } catch (error) {
      console.error(`Failed to generate ${pngPath}:`, error.message);
    }
  });
}