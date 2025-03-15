/**
 * Configuration for extension packaging
 */
export default {
  // Chrome extension settings
  chrome: {
    // URL where extension will be hosted (for update_url in manifest)
    updateUrl: 'https://example.com/updates.xml',
    // Whether to include source maps in production build
    includeSourceMaps: false,
  },
  
  // Firefox extension settings
  firefox: {
    // Firefox-specific settings
    id: '{025b7e0b-11eb-4ae6-8f03-a7e522dd3cca}', // Extension ID for Firefox (generate a new UUID)
    strict_min_version: '58.0',  // Minimum Firefox version
    strict_max_version: '120.*',  // Maximum Firefox version
    // Browser specific preferences
    preferences: {
      "browser.startup.homepage": "https://github.com"
    }
  },
  
  // Shared settings
  shared: {
    // Files to exclude when packaging
    excludeFiles: [
      '*.map', 
      '*.log', 
      'extension-key.pem'
    ],
  }
};
