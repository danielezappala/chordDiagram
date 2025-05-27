import { z } from 'zod';

export interface NotePosition {
  string: number;               // Numero della corda (1-6 per chitarra standard)
  fret: number;                 // Tasto (0 per corda a vuoto)
  muted?: boolean;              // Se la corda è stoppata
  tone?: string;                // Nome della nota (es. 'C', 'D#')
  interval?: string;            // Intervallo musicale (es. 'R', '3', '5')
  finger?: number | 'T' | null; // Dito da usare (1-4, 'T' per pollice, null per non specificato)
}

export interface Barre {
  fromString: number;
  toString: number;
  fret: number;
  finger?: number | 'T';  // Opzionale: dito per la barrata (1-4 o 'T' per pollice)
}

export type FretNumberPosition = 'left' | 'right' | 'none';

export interface ChordDiagramData {
  name: string;        // Nome dell'accordo (es. "C Major")
  
  // Nome dello strumento (es. "Guitar (Standard)" o "Bass (4 strings)")
  instrumentName?: string;
  
  // Posizioni delle dita e informazioni di visualizzazione
  positions: {
    notes: NotePosition[];
    fingers?: (number | 'T' | null)[];  // Array parallelo a notes, con la diteggiatura
    barres?: Barre[];                   // Opzionale: barrature
  };

  // Dati teorici per la visualizzazione
  theory?: {
    // Nomi delle note da mostrare (se labelType = 'tone')
    tones?: string[];  // Array parallelo a positions.notes
    
    // Intervalli da mostrare (se labelType = 'interval')
    intervals?: string[];  // Array parallelo a positions.notes
    
    // Nomi delle note che compongono l'accordo (per la teoria)
    chordTones?: string[];  // Es. ["C", "E", "G"] per Do maggiore
    
    // Formula dell'accordo (es. ["R", "3", "5"] o "R-3-5" per un accordo maggiore)
    formula?: string | string[];
    
    // Estensioni dell'accordo (es. ["7", "9"] per C7/9)
    extensions?: string[];
    
    // Descrizione opzionale
    description?: string;
  };

  // Configurazione di default per la visualizzazione
  display?: {
    labelType?: 'none' | 'finger' | 'tone' | 'interval';  // Default: 'none'
    showFretNumbers?: boolean;  // Mostra i numeri dei tasti
    fretNumberPosition?: FretNumberPosition; // Posizione dei numeri dei tasti
    showStringNames?: boolean;  // Mostra i nomi delle corde
    width?: number;            // Larghezza del diagramma
    height?: number;           // Altezza del diagramma
    startFret?: number;        // Tasto di partenza per la visualizzazione
  };

  tuning?: string[]; // Array di note per ogni corda, dalla più grave alla più acuta
}

export interface ChordDiagramProps {
  data: ChordDiagramData;
  width?: number;
  height?: number;
  numStrings?: number;
  numFrets?: number;
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  showFretNumbers?: boolean;
  showStringNames?: boolean;
  className?: string;
  onNoteClick?: (note: NotePosition, index: number) => void;
  onBarreClick?: (barre: Barre) => void;
}

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
