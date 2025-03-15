import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

/**
 * Creates a ZIP archive using available tools (7z or zip)
 * Works cross-platform on Windows (with 7zip) and Unix (with zip)
 * @param {string} sourceDir - Directory to compress
 * @param {string} outputPath - Path to save the ZIP file
 * @returns {Promise<string>} - Path to the created ZIP file
 */
export async function createZipArchive(sourceDir, outputPath) {
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Check if 7z is available (Windows with 7zip)
    const use7zip = checkCommandAvailability('7z');
    
    if (use7zip) {
      console.log('Using 7zip to create archive...');
      execSync(`7z a -tzip "${outputPath}" "${sourceDir}/*"`, { stdio: 'inherit' });
    } else {
      // Try zip (Unix/Mac)
      const useZip = checkCommandAvailability('zip');
      if (useZip) {
        console.log('Using zip to create archive...');
        execSync(`cd "${sourceDir}" && zip -r "${outputPath}" ./*`, { stdio: 'inherit' });
      } else {
        throw new Error('No zip utility found. Please install 7zip or zip command-line tools.');
      }
    }
    
    return outputPath;
  } catch (error) {
    console.error('Error creating ZIP archive:', error);
    throw error;
  }
}

/**
 * Check if a command is available in the system
 * @param {string} command - Command to check
 * @returns {boolean} - Whether the command exists
 */
function checkCommandAvailability(command) {
  try {
    if (process.platform === 'win32') {
      // On Windows, use where command
      execSync(`where ${command}`, { stdio: 'ignore' });
    } else {
      // On Unix-like systems, use which
      execSync(`which ${command}`, { stdio: 'ignore' });
    }
    return true;
  } catch (error) {
    return false;
  }
}

// If called directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'package.json'), 'utf8'));
  const version = packageJson.version;
  const name = packageJson.name;
  
  const sourceDir = path.resolve(rootDir, 'dist');
  const zipPath = path.resolve(rootDir, 'dist', `${name}-v${version}.zip`);
  
  console.log(`Creating ZIP archive of ${sourceDir} to ${zipPath}`);
  createZipArchive(sourceDir, zipPath)
    .then(() => console.log('✅ ZIP archive created successfully!'))
    .catch(error => {
      console.error('Failed to create ZIP archive:', error);
      process.exit(1);
    });
}
