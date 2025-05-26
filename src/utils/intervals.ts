import intervalsData from '../data/intervals.json';

export interface Interval {
  name: string;
  abbr: string;
  semitones: number;
  degree: number;
  quality: string;
}

const intervals: Interval[] = intervalsData as Interval[];

/**
 * Get interval by its abbreviation (e.g., 'm3', 'P5')
 */
export function getIntervalByAbbr(abbr: string): Interval | undefined {
  return intervals.find(interval => interval.abbr === abbr);
}

/**
 * Get interval by number of semitones
 */
export function getIntervalBySemitones(semitones: number): Interval | undefined {
  // Normalize to 0-11 for octave equivalence
  const normalizedSemitones = semitones % 12;
  return intervals.find(interval => interval.semitones === normalizedSemitones);
}

/**
 * Get interval between two notes (0-11 semitones)
 */
export function getIntervalBetweenNotes(
  note1: string, 
  note2: string,
  noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
): Interval | undefined {
  const index1 = noteNames.indexOf(note1);
  const index2 = noteNames.indexOf(note2);
  
  if (index1 === -1 || index2 === -1) return undefined;
  
  let semitones = (index2 - index1) % 12;
  if (semitones < 0) semitones += 12;
  
  return getIntervalBySemitones(semitones);
}

/**
 * Get all intervals for a given degree
 */
export function getIntervalsByDegree(degree: number): Interval[] {
  return intervals.filter(interval => interval.degree === degree);
}

/**
 * Get all intervals for a given quality
 */
export function getIntervalsByQuality(quality: string): Interval[] {
  return intervals.filter(interval => interval.quality === quality);
}

/**
 * Get all interval abbreviations
 */
export function getAllIntervalAbbreviations(): string[] {
  return intervals.map(interval => interval.abbr);
}

/**
 * Get note name by applying an interval to a root note
 */
export function getNoteByInterval(
  rootNote: string, 
  interval: Interval,
  noteNames: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
): string | undefined {
  const rootIndex = noteNames.indexOf(rootNote);
  if (rootIndex === -1) return undefined;
  
  const targetIndex = (rootIndex + interval.semitones) % 12;
  return noteNames[targetIndex];
}
