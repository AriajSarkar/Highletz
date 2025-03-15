import { HighlightType } from './types';

/**
 * Main function that highlights files based on their commit time
 */
export function highlightCommitTimes(): void {
  //  console.log('%c[GitHub Highlighter] Scanning repository files', 'background: #2ea44f; color: white; padding: 2px 5px;');
  
  // Specific targeting of react-directory-commit-age elements
  const timeElements = document.querySelectorAll<HTMLElement>('.react-directory-commit-age relative-time, .react-directory-commit-age time-ago');
  
  if (timeElements.length > 0) {
    //  console.log(`[GitHub Highlighter] Found ${timeElements.length} React directory commit ages`);
    processTimeElements(timeElements);
    return;
  }
  
  // Fallback to row-based approach if no React elements found
  const fileRows = document.querySelectorAll<HTMLElement>('table.files tr.js-navigation-item');
  
  if (fileRows.length === 0) {
    //  console.log('[GitHub Highlighter] No file rows found in standard view, trying alternative selectors');
    
    // Try the new React-based GitHub file list structure
    const reactFileRows = document.querySelectorAll<HTMLElement>('[role="row"]');
    if (reactFileRows.length > 0) {
      //  console.log(`[GitHub Highlighter] Found ${reactFileRows.length} rows with React structure`);
      processFileRows(reactFileRows);
      return;
    }
    
    //  console.log('%c[GitHub Highlighter] No repository file rows found.', 'color: red');
    return;
  }
  
  //  console.log(`[GitHub Highlighter] Found ${fileRows.length} file rows in standard view`);
  processFileRows(fileRows);
}

/**
 * Process time elements directly - optimized for react-directory-commit-age
 */
function processTimeElements(timeElements: NodeListOf<HTMLElement>): void {
  const dateInfo = getDateRanges();
  let highlighted = 0;
  
  timeElements.forEach((timeElement) => {
    // Get the datetime from the time element
    const datetime = timeElement.getAttribute('datetime') || timeElement.getAttribute('title');
    if (!datetime) {
      //  console.log('[GitHub Highlighter] No datetime found in:', timeElement);
      return;
    }
    
    try {
      const time = new Date(datetime);
      if (isNaN(time.getTime())) {
        //  console.log('[GitHub Highlighter] Invalid date:', datetime);
        return;
      }
      
      // Find the parent row element
      const row = timeElement.closest('[role="row"]') || 
                  timeElement.closest('tr') ||
                  timeElement.closest('.js-navigation-item');
      
      if (!row) {
        //  console.log('[GitHub Highlighter] Could not find parent row for:', timeElement);
        return;
      }
      
      // Apply highlighting
      const highlightType = getHighlightType(time, dateInfo);
      if (highlightType) {
        applyHighlight(row as HTMLElement, highlightType);
        highlighted++;
      }
    } catch (error) {
      console.error('[GitHub Highlighter] Error processing time:', error);
    }
  });
  
  //  console.log(`[GitHub Highlighter] Successfully highlighted ${highlighted} items`);
}

/**
 * Process file rows by looking for time elements within
 */
function processFileRows(fileRows: NodeListOf<HTMLElement>): void {
  const dateInfo = getDateRanges();
  let highlighted = 0;
  
  fileRows.forEach((row, index) => {
    // Look specifically for time in the commit age column
    const timeElement = row.querySelector<HTMLElement>('.react-directory-commit-age relative-time') || 
                        row.querySelector<HTMLElement>('relative-time') ||
                        row.querySelector<HTMLElement>('time-ago');
    
    if (!timeElement) {
      if (index < 3) { // Only log a few to avoid spam
        //  console.log('[GitHub Highlighter] No time element found in row');
      }
      return;
    }
    
    // Get the datetime from the time element
    const datetime = timeElement.getAttribute('datetime') || timeElement.getAttribute('title');
    if (!datetime) {
      //  console.log('[GitHub Highlighter] No datetime found in:', timeElement);
      return;
    }
    
    try {
      const time = new Date(datetime);
      if (isNaN(time.getTime())) {
        //  console.log('[GitHub Highlighter] Invalid date:', datetime);
        return;
      }
      
      // Apply highlighting
      const highlightType = getHighlightType(time, dateInfo);
      if (highlightType) {
        applyHighlight(row, highlightType);
        highlighted++;
      }
    } catch (error) {
      console.error('[GitHub Highlighter] Error processing time:', error);
    }
  });
  
  //  console.log(`[GitHub Highlighter] Successfully highlighted ${highlighted} file rows`);
}

/**
 * Get today, yesterday, and 3 days ago dates for comparison
 */
function getDateRanges() {
  const today = new Date();
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  
  return { today, yesterday, threeDaysAgo };
}

/**
 * Determine which highlight should be applied based on the date
 */
function getHighlightType(
  time: Date, 
  { today, yesterday, threeDaysAgo }: { today: Date, yesterday: Date, threeDaysAgo: Date }
): HighlightType | null {
  // Remove time portion for date comparison
  const timeDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (timeDate.getTime() === todayDate.getTime()) {
    return 'today';
  } else if (timeDate.getTime() === yesterdayDate.getTime()) {
    return 'yesterday';
  } else if (time >= threeDaysAgo) {
    return 'recent';
  }
  
  return null;
}

/**
 * Apply the highlight class and log the result
 */
function applyHighlight(element: HTMLElement, type: HighlightType): void {
  // Remove any existing highlight classes
  element.classList.remove('gh-highlight-today', 'gh-highlight-yesterday', 'gh-highlight-recent');
  
  // Apply new highlight class
  element.classList.add(`gh-highlight-${type}`);
  
  // Get file name for logging
  const fileName = element.querySelector('.react-directory-filename-column a')?.textContent || 
                  element.querySelector('a')?.textContent || 
                  'unknown';
  
  //  console.log(`[GitHub Highlighter] Highlighted ${type.toUpperCase()}: ${fileName}`);
}
