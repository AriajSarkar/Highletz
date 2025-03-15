/**
 * Set up MutationObserver to watch for changes in the DOM
 */
export function setupMutationObserver(callback: () => void): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Direct check for react-directory-commit-age
      if (mutation.target instanceof Element && 
          mutation.target.classList && 
          mutation.target.classList.contains('react-directory-commit-age')) {
        //  console.log('[GitHub Highlighter] react-directory-commit-age element changed');
        callback();
        return;
      }
      
      // Check for added react-directory-commit-age elements
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element && 
              ((node.querySelector && node.querySelector('.react-directory-commit-age')) ||
               node.classList.contains('react-directory-commit-age'))) {
            //  console.log('[GitHub Highlighter] New react-directory-commit-age element detected');
            callback();
            return;
          }
        }
      }
      
      // Check for changes in file list areas
      if (mutation.target instanceof Element && 
          mutation.target.classList && 
          (mutation.target.classList.contains('js-navigation-container') ||
           mutation.target.classList.contains('react-directory-filename-column'))) {
        callback();
        return;
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  //  console.log('[GitHub Highlighter] MutationObserver set up');
}
