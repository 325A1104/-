/**
 * Pure helper functions for song lyric timing, progress calculation, and formatting.
 */

export interface LyricItem {
  id: string;
  time: number; // in seconds
  endTime: number;
  section: 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'bridge' | 'outro';
  text: string;
  subtext?: string;
}

/**
 * Format seconds into mm:ss string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSecs = Math.floor(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Find the active lyric index for a given timestamp
 */
export function getActiveLyricIndex(lyrics: LyricItem[], currentTime: number): number {
  if (!lyrics || lyrics.length === 0) return -1;
  
  // Check if currentTime is before first lyric
  if (currentTime < lyrics[0].time) return 0;
  
  // Find matching range (exclusive of endTime unless last element)
  for (let i = 0; i < lyrics.length; i++) {
    const item = lyrics[i];
    const isLast = i === lyrics.length - 1;
    if (currentTime >= item.time && (isLast ? currentTime <= item.endTime : currentTime < item.endTime)) {
      return i;
    }
  }

  // If in a gap or past last item, find nearest preceding item
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i;
    }
  }

  return 0;
}

/**
 * Calculate playback progress clamped between 0 and 100
 */
export function calculateProgress(currentTime: number, duration: number): number {
  if (duration <= 0 || isNaN(duration)) return 0;
  const raw = (currentTime / duration) * 100;
  return Math.min(100, Math.max(0, raw));
}

/**
 * Given progress percentage (0-100) and duration, compute corresponding time
 */
export function progressToTime(progress: number, duration: number): number {
  if (duration <= 0 || isNaN(duration)) return 0;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  return (clampedProgress / 100) * duration;
}
