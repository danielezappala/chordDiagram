// Note: Zod schemas and default values will need to be updated/re-added later for these new types.

<<<<<<< HEAD
export interface NotePosition {
  string: number;               // String number (e.g., 1-6 for standard guitar; 1 is the highest pitch string, typically rendered rightmost, N is the lowest pitch string, typically rendered leftmost).
  fret: number;                 // Tasto (0 per corda a vuoto)
  muted?: boolean;              // Se la corda è stoppata
  tone?: string;                // Nome della nota (es. 'C', 'D#')
  interval?: string;            // Intervallo musicale (es. 'R', '3', '5')
  finger?: number | 'T' | null; // Dito da usare (1-4, 'T' per pollice, null per non specificato)
=======
// --- Core Types for Fret Position and Note Annotation ---

export type Finger = 1 | 2 | 3 | 4 | 'T' | 'P'; // Fingers that press strings (P for Thumb as per user suggestion)
export type StringStatusSymbol = 'O' | 'X';   // O for Open, X for Muted/Not Played
export type FingerDesignator = Finger | StringStatusSymbol | null; // null for unspecified

export interface FretPosition {
  string: number; // String number (1-N, e.g., 1-6 for guitar; 1 is the highest pitch string)
  fret: number;   // Fret number (0 for open string, -1 for a muted or unplayed string that should be marked 'X')
>>>>>>> 7ce2340662a65011446821003aea60254626e7d0
}

export interface NoteAnnotation {
  tone?: string;            // e.g., 'C', 'Db', 'F#' (Scientific pitch notation preferred for internal storage)
  interval?: string;        // e.g., 'R', 'm3', 'P5', 'b7' (Relative to chord root)
  degree?: string;          // e.g., '1', 'b3', '#5' (Scale degree, alternative to interval)
  finger?: FingerDesignator;// Finger to use, or 'O' for open, 'X' for explicitly not played/muted in this context
  highlight?: boolean;      // To visually emphasize this note
}

export interface PositionedNote {
  position: FretPosition;
  annotation?: NoteAnnotation; // Annotations are optional for any given position
}

// --- Tuning and Instrument Types ---

export type InstrumentType = 'guitar' | 'bass' | 'ukulele' | 'banjo' | 'custom';

export interface Tuning {
  name: string;                             // e.g., "Standard EADGBe", "Drop D", "Open G"
  notes: string[];                          // Notes of open strings, from lowest pitch string to highest pitch string (e.g., ['E', 'A', 'D', 'G', 'B', 'E'] for standard guitar)
  instrument?: InstrumentType;              // Optional: type of instrument this tuning is for
  stringCount?: number;                     // Optional: number of strings (can be inferred from notes.length)
}

// --- Barre Chord Type ---

export interface Barre {
<<<<<<< HEAD
  fromString: number;
  toString: number;
  fret: number;
  finger?: number | 'T';  // Optional finger to use for the barre (e.g., 1-4 or 'T' for thumb). Not currently rendered on the diagram.
=======
  fromString: number; // Highest pitch string number involved in the barre (1-N, e.g., 1 for High E)
  toString: number;   // Lowest pitch string number involved in the barre (1-N)
  fret: number;       // Absolute fret number where the barre is placed
  finger?: Finger;     // Optional: Finger used for the barre (1, 2, 3, 4, 'T', 'P')
>>>>>>> 7ce2340662a65011446821003aea60254626e7d0
}

// --- Main Chord Diagram Data Structure ---

export interface ChordPositionData {
  name?: string; // Optional name for this specific position/voicing (e.g., "Open C", "C at 5th fret")
  baseFret: number; // The fret number that should appear at the top of this diagram position.
                   // If 1, the nut is shown. If > 1, fret numbers adjust accordingly.
  
  notes: PositionedNote[]; // Array of notes. It's recommended this array has an entry for each string
                           // of the instrument, using `fret: -1` in FretPosition for muted/unplayed strings
                           // to allow for comprehensive annotations if needed.

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
    intervals?: string[];       // Chord intervals relative to root, e.g., ["R", "m3", "5", "b7"]
    chordTones?: string[];      // Root notes of the chord, e.g., ["A", "C", "E", "G"] for Am7
    // Future extensions: tensions, alterations etc.
  };

  // Tuning: Can be a full Tuning object or a simple array of string names (lowest to highest pitch string)
  tuning?: Tuning | string[];

  // Global Display Settings (can be overridden by component props)
  display?: {
    labelType?: 'none' | 'finger' | 'tone' | 'interval' | 'degree'; // Type of label to show on notes
    showFretNumbers?: boolean;  // Toggle for fret numbers (new conditional logic for startFret applies)
    fretNumberPosition?: 'left' | 'right' | 'none'; // Position of fret numbers, or none
    showStringNames?: boolean;  // Toggle for string names/tuning notes below diagram
  };

  // General Metadata
  instrument?: InstrumentType; // Primary instrument type this chord is for (can also be in Tuning)
  comments?: string;           // Any textual comments about the chord
}


// --- Component Prop Types (will need adjustment based on how ChordDiagram uses new ChordDiagramData) ---

// Placeholder for ChordDiagramProps - this will need significant update
// once ChordDiagram component is refactored to use the new ChordDiagramData.
// For now, we can define it minimally.
export interface ChordDiagramProps {
  data: ChordDiagramData; // Uses the new data structure

  // Which position from data.positions to display (if multiple exist). Defaults to 0.
  positionIndex?: number;

  // Overrides for display settings from ChordDiagramData.display
  labelType?: 'none' | 'finger' | 'tone' | 'interval' | 'degree';
  showFretNumbers?: boolean;
  fretNumberPosition?: 'left' | 'right' | 'none';
  showStringNames?: boolean;

  // Sizing and other direct component props
  width?: number;
  height?: number;
  numStrings?: number; // May become mainly derived from data.tuning or data.positions[x].notes
  numFrets?: number;   // Number of frets to draw on the diagram

  // Callbacks
  // These might need to pass more context with new data structure
  onNoteClick?: (note: PositionedNote, positionData: ChordPositionData, event: React.MouseEvent) => void;
  onBarreClick?: (barre: Barre, positionData: ChordPositionData, event: React.MouseEvent) => void;

  className?: string;
  style?: React.CSSProperties;
}

<<<<<<< HEAD
// Zod validation schemas
const notePositionSchema = z.object({
  string: z.number().int().min(1).max(8),
  fret: z.number().int().min(-1), // -1 for muted, 0 for open
  muted: z.boolean().optional(),
});

const barreSchema = z.object({
  fromString: z.number().int().min(1).max(8),
  toString: z.number().int().min(1).max(8),
  fret: z.number().int().min(0).max(24),
  finger: z.union([z.number().int().min(1).max(4), z.literal('T')]).optional(),
});

const chordDiagramDataSchema = z.object({
  name: z.string(),
  positions: z.object({
    notes: z.array(notePositionSchema),
    fingers: z.array(z.union([z.number().int().min(1).max(4), z.literal('T'), z.null()])).optional(),
    barres: z.array(barreSchema).optional(),
  }),
  theory: z.object({
    tones: z.array(z.string()).optional(),
    intervals: z.array(z.string()).optional(),
    chordTones: z.array(z.string()).optional(),
    formula: z.union([z.string(), z.array(z.string())]).optional(),
    extensions: z.array(z.string()).optional(),
    description: z.string().optional(),
  }).optional(),
  display: z.object({
    labelType: z.enum(['none', 'finger', 'tone', 'interval']).optional(),
    showFretNumbers: z.boolean().optional(),
    showStringNames: z.boolean().optional(),
  }).optional(),
});

export function isValidChordData(data: unknown): data is ChordDiagramData {
  return chordDiagramDataSchema.safeParse(data).success;
}

// Default values
export const DEFAULT_NUM_FRETS = 5;
export const DEFAULT_NUM_STRINGS = 6;
export const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];
export const DEFAULT_WIDTH = 250;  // Increased from 200 to 250
export const DEFAULT_HEIGHT = 300;
=======
// Old FretNumberPosition type, still relevant for ChordDiagramProps and display options
export type FretNumberPosition = 'left' | 'right' | 'none';
>>>>>>> 7ce2340662a65011446821003aea60254626e7d0
