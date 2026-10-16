import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTime, getActiveLyricIndex, calculateProgress, progressToTime, type LyricItem } from './lyric-timing.ts';

const mockLyrics: LyricItem[] = [
  { id: '1', time: 0, endTime: 15, section: 'intro', text: 'Intro' },
  { id: '2', time: 15, endTime: 30, section: 'verse', text: 'Verse 1' },
  { id: '3', time: 30, endTime: 45, section: 'chorus', text: 'Chorus' },
];

test('formatTime converts seconds to mm:ss correctly', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(15), '00:15');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(205), '03:25');
  assert.equal(formatTime(-5), '00:00');
  assert.equal(formatTime(NaN), '00:00');
});

test('getActiveLyricIndex selects correct lyric for timestamps', () => {
  assert.equal(getActiveLyricIndex([], 10), -1);
  assert.equal(getActiveLyricIndex(mockLyrics, 5), 0);
  assert.equal(getActiveLyricIndex(mockLyrics, 15), 1);
  assert.equal(getActiveLyricIndex(mockLyrics, 25), 1);
  assert.equal(getActiveLyricIndex(mockLyrics, 35), 2);
  assert.equal(getActiveLyricIndex(mockLyrics, 50), 2); // clamped to last
});

test('calculateProgress returns correct percentage within 0-100', () => {
  assert.equal(calculateProgress(0, 200), 0);
  assert.equal(calculateProgress(100, 200), 50);
  assert.equal(calculateProgress(200, 200), 100);
  assert.equal(calculateProgress(250, 200), 100);
  assert.equal(calculateProgress(-10, 200), 0);
  assert.equal(calculateProgress(50, 0), 0);
});

test('progressToTime returns correct time from percentage', () => {
  assert.equal(progressToTime(0, 200), 0);
  assert.equal(progressToTime(50, 200), 100);
  assert.equal(progressToTime(100, 200), 200);
  assert.equal(progressToTime(150, 200), 200);
});
