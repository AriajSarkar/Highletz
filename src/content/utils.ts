/**
 * Creates a visual banner to indicate the extension is active
 */
export function createExtensionBanner(): void {
  const banner = document.createElement('div');
  banner.id = 'gh-highlighter-banner';
  banner.innerHTML = 'GitHub File Highlighter Active';
  banner.style.position = 'fixed';
  banner.style.top = '10px';
  banner.style.right = '10px';
  banner.style.zIndex = '9999';
  banner.style.background = 'rgba(46, 160, 67, 0.8)';
  banner.style.color = 'white';
  banner.style.padding = '5px 10px';
  banner.style.borderRadius = '5px';
  banner.style.fontSize = '12px';
  banner.style.cursor = 'pointer';
  banner.style.transition = 'opacity 1s';
  banner.onclick = () => { banner.style.display = 'none'; };
  
  document.body.appendChild(banner);
  
  // Fade out after 5 seconds
  setTimeout(() => {
    banner.style.opacity = '0';
    setTimeout(() => {
      banner.remove();
    }, 1000);
  }, 5000);
}

/**
 * Debounce function to prevent excessive calls
 */
export function debounce<F extends (...args: unknown[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: unknown, ...args: Parameters<F>): void {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
