import webExt from 'web-ext';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const distDir = path.resolve(rootDir, 'dist');
// Change temp directory location to tests folder
const testsDir = path.resolve(rootDir, 'tests');
const tempDir = path.resolve(testsDir, 'temp-firefox');

/**
 * Prepare Firefox manifest with browser_specific_settings
 * This is needed for Firefox to properly load the extension
 */
async function prepareFirefoxManifest() {
  console.log('Preparing Firefox-compatible manifest...');
  
  // Create tests directory if it doesn't exist
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Copy all dist files to temp directory
  fs.cpSync(distDir, tempDir, { recursive: true });
  
  // Read and modify the manifest
  const manifestPath = path.resolve(tempDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Add Firefox specific settings if not already present
  if (!manifest.browser_specific_settings) {
    manifest.browser_specific_settings = {
      gecko: {
        id: "{025b7e0b-11eb-4ae6-8f03-a7e522dd3cca}",
        strict_min_version: "58.0"
      }
    };
  }
  
  // Write back the modified manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Firefox-compatible manifest created');
  
  return tempDir;
}

/**
 * Run Firefox with the extension loaded for development
 */
async function runFirefox() {
  console.log('Starting Firefox with the extension loaded for development testing...');
  console.log('=========================================================================');
  console.log('NOTE: Some Firefox console warnings are normal and can be ignored, including:');
  console.log('- "unrecognized command line flag -foreground"');
  console.log('- "Experiment X has unknown featureId: Y"');
  console.log('These are Firefox internal messages, not problems with your extension.');
  console.log('=========================================================================');
  
  try {
    // Prepare Firefox-compatible manifest
    const sourceDir = await prepareFirefoxManifest();
    
    // Firefox preferences to enable developer mode
    const firefoxPreferences = {
      // Disable signature requirements for development
      'xpinstall.signatures.required': false,
      // Reduce console noise (optional)
      'devtools.console.stdout.content': true,
      'browser.startup.homepage': 'about:blank',
      // Other helpful development settings
      'devtools.debugger.remote-enabled': true,
      'devtools.chrome.enabled': true
    };
    
    // Find Firefox binary (allows custom location via env var)
    const firefoxBinary = process.env.FIREFOX_BINARY || 
                         (process.platform === 'win32' ? undefined : 'firefox');
    
    // Start Firefox with our extension
    const runnerResults = await webExt.cmd.run({
      sourceDir,
      firefox: firefoxBinary,
      browserConsole: true,
      pref: firefoxPreferences,
      args: ['--browser-console', '--new-instance'],
      devtools: true
    }, {
      shouldExitProgram: false,
    });
    
    console.log('✅ Firefox started with extension loaded');
    console.log('📝 View extension debugging at: about:debugging#/runtime/this-firefox');
    console.log('🔍 Press Ctrl+C to exit.');
    
    // Clean up on exit
    process.on('SIGINT', () => {
      console.log('\nShutting down Firefox and cleaning up...');
      runnerResults.extensionRunners.forEach(runner => runner.exit());
      
      // Clean up temp directory after a short delay
      setTimeout(() => {
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Temporary directory cleaned up');
        process.exit(0);
      }, 500);
    });
  } catch (error) {
    console.error('Error running Firefox:', error);
    // Try to clean up temp directory even if there's an error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

runFirefox();
