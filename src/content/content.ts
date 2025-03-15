import '../styles/content.css';
import { highlightCommitTimes } from './highlighter';
import { setupMutationObserver } from './observers';
import { debounce } from '../utils/utils';

/**
 * Initialize the extension
 */
function initialize(): void {
  // Banner creation removed
  
  // Do initial highlighting with a slight delay to ensure DOM is ready
  setTimeout(() => {
    highlightCommitTimes();
  }, 500);
  
  // Create a debounced version of highlightCommitTimes
  const debouncedHighlight = debounce(highlightCommitTimes, 300);
  
  // Setup observers
  setupMutationObserver(debouncedHighlight);
  
  // Handle GitHub's pjax navigation
  document.addEventListener('pjax:end', () => {
    setTimeout(highlightCommitTimes, 500);
  });
  
  // Watch for GitHub's pushState/replaceState navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  // Use rest parameters instead of 'arguments'
  history.pushState = function<T>(...args: [T, string, string | URL | null | undefined]) {
    originalPushState.apply(this, args);
    setTimeout(highlightCommitTimes, 500);
  };
  
  history.replaceState = function<T>(...args: [T, string, string | URL | null | undefined]) {
    originalReplaceState.apply(this, args);
    setTimeout(highlightCommitTimes, 500);
  };
  
  // Poll occasionally because GitHub loads content dynamically
  setInterval(highlightCommitTimes, 3000);
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
