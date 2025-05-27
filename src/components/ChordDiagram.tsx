import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import type { 
  NotePosition,
  Barre,
  ChordDiagramData,
  FretNumberPosition
} from '../types';

type LabelType = 'none' | 'finger' | 'tone' | 'interval';
import { 
  DEFAULT_NUM_FRETS, 
  DEFAULT_WIDTH, 
  DEFAULT_HEIGHT,
  DEFAULT_TUNING
} from '../types';
import { FretboardBase } from './FretboardBase';
import { NotesLayer } from './NotesLayer';
import { ChordInfo } from './ChordInfo';

interface ChordDiagramProps {
  data: ChordDiagramData;
  labelType?: LabelType;
  showFretNumbers?: boolean;
  fretNumberPosition?: FretNumberPosition;
  showStringNames?: boolean;
  width?: number;
  height?: number;
  numStrings?: number;
  numFrets?: number;
  tuning?: string[];
  className?: string;
  onNoteClick?: (note: NotePosition, index: number) => void;
  onBarreClick?: (barre: Barre) => void;
}

const ChordDiagram = forwardRef<SVGSVGElement, ChordDiagramProps>(({
  // Data
  data,
  
  // Display settings (can be overridden by data.display)
  labelType: labelTypeProp,
  showFretNumbers: showFretNumbersProp,
  fretNumberPosition: fretNumberPositionProp,
  showStringNames: showStringNamesProp,
  
  // Sizing
  width,
  height,
  numStrings: numStringsProp,
  numFrets: numFretsProp,
  tuning,
  
  // Callbacks
  onNoteClick,
  onBarreClick,
  
  // Class name
  className = '',
}: ChordDiagramProps, ref: ForwardedRef<SVGSVGElement>) => {
  // Use display settings from data or from props (props take precedence)
  const labelType = labelTypeProp ?? data.display?.labelType ?? 'finger';
  const showFretNumbers = showFretNumbersProp ?? data.display?.showFretNumbers ?? true;
  const fretNumberPosition = fretNumberPositionProp ?? data.display?.fretNumberPosition ?? 'left';
  const showStringNames = showStringNamesProp ?? data.display?.showStringNames ?? true;
  const numStrings = numStringsProp ?? data.positions.notes.length;
  
  // Extract data from the chord object
  const { positions, theory } = data;
  const { notes, fingers } = positions;
  

  
  // Usa il tasto di partenza specificato o 1 come default
  const startFret = data.display?.startFret ?? 1;

  // Calculate dimensions with minimums and scale proportionally
  const minWidth = 250; // Minimum width in pixels
  const minHeight = 300; // Minimum height in pixels
  
  // Get base dimensions from props or data, fallback to defaults
  const baseWidth = typeof width === 'number' ? width : (data.display?.width ?? DEFAULT_WIDTH);
  const baseHeight = typeof height === 'number' ? height : (data.display?.height ?? DEFAULT_HEIGHT);
  
  // Calculate aspect ratio based on minimum dimensions
  const minAspectRatio = minWidth / minHeight;
  
  // Calculate dimensions that respect minimums and maintain aspect ratio
  let diagramWidth = Math.max(minWidth, baseWidth);
  let diagramHeight = Math.max(minHeight, baseHeight);
  
  // Ensure the aspect ratio is maintained if one dimension is fixed
  if (diagramWidth / diagramHeight > minAspectRatio) {
    // If too wide for the height, adjust height
    diagramHeight = diagramWidth / minAspectRatio;
  } else {
    // If too tall for the width, adjust width
    diagramWidth = diagramHeight * minAspectRatio;
  }
  
  // Limit maximum width to 370px and scale height proportionally
  const maxDiagramWidth = 370;
  if (diagramWidth > maxDiagramWidth) {
    const scale = maxDiagramWidth / diagramWidth;
    diagramWidth = maxDiagramWidth;
    diagramHeight = diagramHeight * scale;
  }
  
  // Calculate dimensions and padding
  const sidePadding = 40; // Spazio per i numeri dei tasti a sinistra/destra
  const topPadding = 30; // Aumentato da 15 a 30 per dare più spazio ai pallini delle corde a vuoto
  const bottomPadding = 15; // Spazio inferiore per le etichette delle corde
  
  // Calcola lo spostamento orizzontale in base alla larghezza (10% della larghezza, massimo 80px)
  // Usiamo un valore negativo per spostare a sinistra
  const horizontalOffset = -Math.min(diagramWidth * 0.1, 80);
  const paddedWidth = diagramWidth - sidePadding * 2; // Larghezza effettiva della tastiera
  const paddedHeight = diagramHeight - topPadding - bottomPadding; // Altezza effettiva della tastiera
  
  // Usa il numero di tasti specificato o il valore di default
  // Non ricalcoliamo in base alle note per mantenere la posizione esatta
  const actualNumFrets = numFretsProp ?? DEFAULT_NUM_FRETS;
  
  // Use provided tuning or default
  const actualTuning = tuning ?? DEFAULT_TUNING;
  
  // Get barres from data
  const barres = data.positions.barres || [];
  
  // Map notes to include finger positions and other metadata
  const notesWithMetadata = useMemo(() => {
    // Create a map of string number to note data
    const noteMap = new Map<number, any>();
    
    // First, map all notes by their string number
    notes.forEach(note => {
      noteMap.set(note.string, {
        ...note,
        finger: null,
        tone: '',
        interval: ''
      });
    });
    
    // Then apply fingers, tones, and intervals based on their positions
    if (fingers) {
      fingers.forEach((finger, index) => {
        const stringNum = index + 1; // Convert 0-based to 1-based string number
        if (noteMap.has(stringNum)) {
          noteMap.get(stringNum)!.finger = finger;
        }
      });
    }
    
    if (theory?.tones) {
      theory.tones.forEach((tone, index) => {
        const stringNum = index + 1; // Convert 0-based to 1-based string number
        if (noteMap.has(stringNum)) {
          noteMap.get(stringNum)!.tone = tone;
        }
      });
    }
    
    if (theory?.intervals) {
      // Inverti l'ordine degli intervalli per far corrispondere le corde dal basso verso l'alto
      // (indice 0 = corda 6, indice 1 = corda 5, ecc.)
      const reversedIntervals = [...theory.intervals].reverse();
      
      reversedIntervals.forEach((interval, index) => {
        const stringNum = index + 1; // 1-based string number (1 = 6th string, 2 = 5th, etc.)
        if (noteMap.has(stringNum)) {
          noteMap.get(stringNum)!.interval = interval;
        }
      });
    }
    
    // Convert map back to array of notes
    return Array.from(noteMap.values());
  }, [notes, fingers, theory?.tones, theory?.intervals]);
  
  // Generate note labels based on label type
  const noteLabels = useMemo(() => {
    // Create an array filled with spaces for all strings
    const labels = Array(numStrings).fill(' ');
    
    if (labelType === 'none') return labels;
    
    // Map notes to their string positions
    notesWithMetadata.forEach(note => {
      const stringIndex = note.string - 1; // Convert from 1-based to 0-based
      
      if (stringIndex < 0 || stringIndex >= numStrings) return;
      
      if (labelType === 'finger' && note.finger !== null && note.finger !== undefined) {
        labels[stringIndex] = note.finger.toString();
      } else if (labelType === 'tone' && note.tone) {
        labels[stringIndex] = note.tone;
      } else if (labelType === 'interval' && note.interval) {
        labels[stringIndex] = note.interval;
      }
    });
    
    // Replace any 'x' or 'X' with spaces
    return labels.map(label => {
      if (label === 'x' || label === 'X') return ' ';
      return label || ' ';
    });
  }, [labelType, notesWithMetadata, numStrings]);
  
  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className="flex flex-col items-center"
        style={{ 
          marginLeft: `${horizontalOffset}px`,
          transition: 'margin-left 0.2s ease-in-out'
        }}
      >
        {/* Chord Info Section */}
        <div className="w-full px-4 mb-2">
          <ChordInfo data={data} className="text-sm" />
        </div>
        
        {/* Diagram Section */}
        <div 
          className={`chord-diagram relative ${className || ''}`}
          style={{ 
            width: diagramWidth + 30,
            height: diagramHeight + 20,
          }}
        >
          <div className="relative w-full h-full">
            <svg
              ref={ref}
              className="w-full h-full"
              viewBox={`${fretNumberPosition === 'left' ? -sidePadding : 0} 0 ${diagramWidth + (fretNumberPosition === 'right' ? sidePadding : 0)} ${diagramHeight}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <g transform={`translate(${(fretNumberPosition === 'left' ? sidePadding : 0) - 30}, ${topPadding})`}>
                <FretboardBase
                  width={paddedWidth}
                  height={paddedHeight}
                  numStrings={numStrings}
                  numFrets={actualNumFrets}
                  startFret={startFret}
                  showFretNumbers={showFretNumbers}
                  fretNumberPosition={fretNumberPosition}
                  showStringNames={showStringNames}
                  tuning={actualTuning}
                  labelType={labelType}
                  labels={labelType !== 'none' ? noteLabels : []}
                  theory={data.theory}
                >
                  <NotesLayer
                    width={paddedWidth}
                    height={paddedHeight}
                    notes={notesWithMetadata}
                    barres={barres}
                    numStrings={numStrings}
                    numFrets={actualNumFrets}
                    startFret={startFret}
                    labelType={labelType}
                    labels={noteLabels}
                    onNoteClick={onNoteClick ? (note) => onNoteClick(note, 0) : undefined}
                    onBarreClick={onBarreClick}
                  />
                </FretboardBase>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

ChordDiagram.displayName = 'ChordDiagram';

// Add error boundary
const ChordDiagramWithErrorBoundary = forwardRef<SVGSVGElement, ChordDiagramProps>((props, ref) => {
  try {
    return <ChordDiagram ref={ref} {...props} />;
  } catch (error) {
    console.error('Error rendering ChordDiagram:', error);
    return (
      <div className="bg-red-50 p-4 rounded border border-red-200 text-red-700">
        Error rendering chord diagram
      </div>
    );
  }
});

ChordDiagramWithErrorBoundary.displayName = 'ChordDiagramWithErrorBoundary';

export default ChordDiagramWithErrorBoundary;
// Export the type for named imports
export type { ChordDiagramProps };
