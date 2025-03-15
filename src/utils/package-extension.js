import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crx from 'crx';
import webExt from 'web-ext';
import crypto from 'crypto';
import { createZipArchive } from './create-zip.js';
import extensionConfig from './extension-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const distDir = path.resolve(rootDir, 'dist');
const extensionsDir = path.resolve(rootDir, 'extensions');
// Change temp directory location to tests folder
const testsDir = path.resolve(rootDir, 'tests');
const tempDir = path.resolve(testsDir, 'temp-build');

// Get extension details
const manifestPath = path.resolve(distDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;
const name = manifest.name.replace(/\s+/g, '-').toLowerCase();

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Path to create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

// Ensure main extensions and tests directories exist
ensureDirectoryExists(extensionsDir);
ensureDirectoryExists(testsDir);

/**
 * Generate an RSA private key in PEM format
 * @returns {Buffer} Private key as a Buffer
 */
function generatePrivateKey() {
  console.log('Generating new RSA private key...');
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return Buffer.from(privateKey);
}

/**
 * Build Chrome CRX extension file
 */
async function buildChromeExtension() {
  console.log('Building Chrome extension (.crx)...');
  
  // Create version-specific directory for Chrome extension
  const chromeOutputDir = ensureDirectoryExists(path.resolve(extensionsDir, `chrome-v${version}`));
  
  // Path for Chrome extension key
  const keyPath = path.resolve(rootDir, 'extension-key.pem');
  
  try {
    let privateKey;
    
    // Check if the key already exists
    if (fs.existsSync(keyPath)) {
      console.log('Using existing private key...');
      privateKey = fs.readFileSync(keyPath);
    } else {
      console.log('No key found, generating new one...');
      privateKey = generatePrivateKey();
      
      // Save the newly generated private key
      fs.writeFileSync(keyPath, privateKey);
      console.log('Generated new private key and saved to extension-key.pem');
      console.log('⚠️  IMPORTANT: Keep this key secure and don\'t lose it!');
      console.log('   You\'ll need it to update your extension in the future.');
    }
    
    // Create a new .crx package
    const crxPacker = new crx({
      privateKey,
      codebase: `https://github.com/AriajSarkar/${name}/releases/download/v${version}/${name}.crx`,
      rootDirectory: distDir,
    });
    
    // Pack extension to .crx
    const crxBuffer = await crxPacker.pack();
    
    // Save the .crx file
    const crxPath = path.resolve(chromeOutputDir, `${name}-v${version}.crx`);
    fs.writeFileSync(crxPath, crxBuffer);
    console.log(`✅ Chrome extension created: ${crxPath}`);
    
    // Also create a zip file for Chrome Web Store upload
    const zipPath = path.resolve(chromeOutputDir, `${name}-chrome-v${version}.zip`);
    await createZipArchive(distDir, zipPath);
    console.log(`✅ Chrome Web Store zip created: ${zipPath}`);
    
    // Create a README file with information about the build
    createBuildReadme(chromeOutputDir, 'Chrome', version);
    
    return { crxPath, zipPath, outputDir: chromeOutputDir };
  } catch (error) {
    console.error('Error building Chrome extension:', error);
    throw error;
  }
}

/**
 * Build Firefox XPI extension file
 */
async function buildFirefoxExtension() {
  console.log('Building Firefox extension (.xpi)...');
  
  try {
    // Create version-specific directory for Firefox extension
    const firefoxOutputDir = ensureDirectoryExists(path.resolve(extensionsDir, `firefox-v${version}`));
    
    // Create a temporary directory for Firefox-specific manifest
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Copy all dist files to temp directory
    console.log('Copying dist files to temp directory...');
    fs.cpSync(distDir, tempDir, { recursive: true });
    
    // Create Firefox-specific manifest
    const ffManifestPath = path.resolve(tempDir, 'manifest.json');
    const ffManifest = JSON.parse(fs.readFileSync(ffManifestPath, 'utf8'));
    
    // Add Firefox specific keys
    ffManifest.browser_specific_settings = {
      gecko: {
        id: extensionConfig.firefox.id,
        strict_min_version: extensionConfig.firefox.strict_min_version,
        strict_max_version: extensionConfig.firefox.strict_max_version
      }
    };
    
    // Save modified manifest
    fs.writeFileSync(ffManifestPath, JSON.stringify(ffManifest, null, 2));
    console.log('Created Firefox-specific manifest');
    
    const xpiName = `${name}-firefox-v${version}.xpi`;
    
    // Use web-ext to build Firefox extension
    const { extensionPath } = await webExt.cmd.build({
      sourceDir: tempDir,
      artifactsDir: firefoxOutputDir,
      filename: xpiName,
      overwriteDest: true,
      ignoreFiles: extensionConfig.shared.excludeFiles,
    }, {
      shouldExitProgram: false,
    });
    
    // Clean up temp directory
    setTimeout(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('Cleaned up temporary build directory');
    }, 1000);
    
    // Create a README file with information about the build
    createBuildReadme(firefoxOutputDir, 'Firefox', version);
    
    console.log(`✅ Firefox extension created: ${extensionPath}`);
    return { xpiPath: extensionPath, outputDir: firefoxOutputDir };
  } catch (error) {
    console.error('Error building Firefox extension:', error);
    throw error;
  }
}

/**
 * Creates a README.md file with build information
 * @param {string} outputDir - Directory to save the README
 * @param {string} browserType - Type of browser (Chrome, Firefox)
 * @param {string} version - Extension version
 */
function createBuildReadme(outputDir, browserType, version) {
  const date = new Date().toISOString().split('T')[0];
  const readmePath = path.resolve(outputDir, 'README.md');
  
  const readmeContent = `# ${manifest.name} for ${browserType} (v${version})

Build date: ${date}

## Installation Instructions

### ${browserType} 
${browserType === 'Chrome' ? 
`
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Either:
   - Drag and drop the .crx file to install directly, OR
   - Use "Load unpacked" and select the extracted .zip for development
` : 
`
1. Go to about:addons
2. Click the gear icon and select "Install Add-on From File..."
3. Select the .xpi file
`}

## Files
${browserType === 'Chrome' ? 
`- ${name}-v${version}.crx - Extension package for direct installation
- ${name}-chrome-v${version}.zip - ZIP file for Chrome Web Store or unpacked development` :
`- ${name}-firefox-v${version}.xpi - Firefox extension package`}

## Notes
Built with browser_specific_settings for ${browserType}.
`;

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`📝 Created build information: ${readmePath}`);
}

/**
 * Main function to build extensions
 */
async function buildExtensions(type = 'all') {
  console.log(`🚀 Building ${type} extension(s) for ${manifest.name} v${version}`);
  
  try {
    // Check if dist directory exists and has required files
    if (!fs.existsSync(distDir) || !fs.existsSync(manifestPath)) {
      console.error('❌ Error: dist directory or manifest.json not found!');
      console.error('Run "npm run build" first to generate the distribution files.');
      process.exit(1);
    }
    
    const results = {};
    
    if (type === 'chrome' || type === 'all') {
      results.chrome = await buildChromeExtension();
    }
    
    if (type === 'firefox' || type === 'all') {
      results.firefox = await buildFirefoxExtension();
    }
    
    console.log('\n✨ All done! Extension files are in:');
    if (results.chrome) {
      console.log(`- Chrome: ${results.chrome.outputDir}`);
    }
    if (results.firefox) {
      console.log(`- Firefox: ${results.firefox.outputDir}`);
    }
    console.log('\nRemember to check the extensions in your browser before distributing.');
  } catch (error) {
    console.error('❌ Extension build failed:', error);
    process.exit(1);
  }
}

// Get the extension type from command line args
const extensionType = process.argv[2] || 'all';
buildExtensions(extensionType);
