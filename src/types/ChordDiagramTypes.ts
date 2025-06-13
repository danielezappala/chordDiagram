// ChordDiagramTypes.ts
// Tipi principali per ChordDiagram

export type InstrumentType = 'guitar' | 'ukulele' | 'bass' | 'mandolin' | string;

export interface NoteAnnotation {
  finger?: string | number;
  tone?: string;
  interval?: string;
}

export interface FretPosition {
  string: number; // 1 = highest (e.g. high E on guitar)
  fret: number;   // 0 = open, -1 = muted
}

export interface PositionedNote {
  position: FretPosition;
  annotation?: NoteAnnotation;
}

export interface Barre {
  fret: number;
  fromString: number;
  toString: number;
  finger?: string | number;
}

export interface ChordPositionData {
  baseFret: number; // The fret number at the left edge of the diagram
  notes: PositionedNote[];
  barres?: Barre[];
}

export interface ChordDiagramData {
  // Identification
  name: string;                 // Primary name of the chord, e.g., "Am7"
  fullName?: string;            // Optional full descriptive name, e.g., "A Minor 7th"
  aliases?: string[];           // Optional array of alternative names

  // Positions: An array to allow multiple fingerings, voicings, or positions for the same chord
  positions: ChordPositionData[];

  // Musical Theory Information (optional)
  theory?: {
    formula?: string;           // e.g., "R 3 5", "R m3 5 b7" (using R for Root)
    chordTones?: string[];      // e.g., ["A", "C", "E", "G"]
  };

  // Display options (optional)
  display?: {
    labelType?: 'none' | 'finger' | 'tone' | 'interval'; // Type of label to show on notes
    showFretNumbers?: boolean;  // Toggle for fret numbers
    fretNumberPosition?: 'left' | 'right' | 'none'; // Position of fret numbers
    showStringNames?: boolean;  // Toggle for string names/tuning notes below diagram
  };

  // General Metadata
  instrument?: InstrumentType; // Primary instrument type this chord is for (can also be in Tuning)
  comments?: string;           // Any textual comments about the chord
  tuning?: string[] | { notes: string[]; instrument?: InstrumentType };
}
