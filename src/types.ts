/**
 * Types of highlights that can be applied
 */
export type HighlightType = 'today' | 'yesterday' | 'recent';

/**
 * Configuration options for the highlighter
 */
export interface HighlighterOptions {
  enabled: boolean;
  showBanner: boolean;
  highlightToday: boolean;
  highlightYesterday: boolean;
  highlightRecent: boolean;
  recentDays: number;
}
