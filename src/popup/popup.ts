import '../styles/popup.css';

/**
 * Initialize the popup UI and settings
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get references to form elements
  const enabledCheckbox = document.getElementById('enabled') as HTMLInputElement;
  const showBannerCheckbox = document.getElementById('showBanner') as HTMLInputElement;
  const highlightTodayCheckbox = document.getElementById('highlightToday') as HTMLInputElement;
  const highlightYesterdayCheckbox = document.getElementById('highlightYesterday') as HTMLInputElement;
  const highlightRecentCheckbox = document.getElementById('highlightRecent') as HTMLInputElement;
  const recentDaysInput = document.getElementById('recentDays') as HTMLInputElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
  const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;
  
  // Load saved settings
  chrome.storage.sync.get({
    enabled: true,
    showBanner: true,
    highlightToday: true,
    highlightYesterday: true,
    highlightRecent: true,
    recentDays: 3
  }, function(items) {
    enabledCheckbox.checked = items.enabled;
    showBannerCheckbox.checked = items.showBanner;
    highlightTodayCheckbox.checked = items.highlightToday;
    highlightYesterdayCheckbox.checked = items.highlightYesterday;
    highlightRecentCheckbox.checked = items.highlightRecent;
    recentDaysInput.value = items.recentDays.toString();
  });
  
  // Save settings
  saveButton.addEventListener('click', function() {
    const settings = {
      enabled: enabledCheckbox.checked,
      showBanner: showBannerCheckbox.checked,
      highlightToday: highlightTodayCheckbox.checked,
      highlightYesterday: highlightYesterdayCheckbox.checked,
      highlightRecent: highlightRecentCheckbox.checked,
      recentDays: parseInt(recentDaysInput.value, 10) || 3
    };
    
    chrome.storage.sync.set(settings, function() {
      statusMessage.textContent = 'Settings saved!';
      statusMessage.classList.remove('hidden');
      
      setTimeout(() => {
        statusMessage.classList.add('hidden');
      }, 2000);
    });
  });
});
