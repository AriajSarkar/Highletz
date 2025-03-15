/**
 * Background script for the GitHub File Highlighter extension
 * 
 * This script runs in the background and can handle events like:
 * - Extension installation/updates
 * - Browser action clicks
 * - Message passing
 */

// Listen for installation events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    //  console.log('[GitHub Highlighter] Extension installed');
    
    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      showBanner: true,
      highlightToday: true,
      highlightYesterday: true,
      highlightRecent: true,
      recentDays: 3
    });
    
    // Open options page on install
    // chrome.runtime.openOptionsPage();
  } else if (details.reason === 'update') {
    //  console.log(`[GitHub Highlighter] Extension updated from ${details.previousVersion} to ${chrome.runtime.getManifest().version}`);
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getSettings') {
    chrome.storage.sync.get(null, (settings) => {
      sendResponse(settings);
    });
    return true; // Required for async response
  }
  
  return false;
});
