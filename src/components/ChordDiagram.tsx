import { forwardRef, useMemo } from 'react';
import type { 
  NotePosition,
  Barre,
  ChordDiagramData
} from '../types';
import { 
  DEFAULT_NUM_FRETS, 
  DEFAULT_WIDTH, 
  DEFAULT_HEIGHT,
  DEFAULT_TUNING
} from '../types';
import FretboardBase from './FretboardBase';
import NotesLayer from './NotesLayer';
import LabelsLayer from './LabelsLayer';
import ChordInfo from './ChordInfo';

// Define the component props
type ChordDiagramProps = {
  // The chord data
  data: ChordDiagramData;
  
  // Override display settings from data
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  showFretNumbers?: boolean;
  showStringNames?: boolean;
  
  // Layout
  width?: number;
  height?: number;
  numStrings?: number;
  numFrets?: number;
  
  // Tuning
  tuning?: string[];
  
  // Styling
  className?: string;
  
  // Events
  onNoteClick?: (note: NotePosition, index: number) => void;
  onBarreClick?: (barre: Barre) => void;
};

const ChordDiagram = forwardRef<SVGSVGElement, ChordDiagramProps>(({
  // Data
  data,
  
  // Display overrides
  labelType: labelTypeProp,
  showFretNumbers: showFretNumbersProp,
  showStringNames: showStringNamesProp,
  
  // Layout
  width,
  height,
  numStrings: numStringsProp,
  numFrets: numFretsProp,
  tuning,
  
  // Styling
  className = '',
  
  // Events
  onNoteClick,
  onBarreClick,
}, ref) => {
  // Use display settings from data or from props (props take precedence)
  const labelType = labelTypeProp ?? data.display?.labelType ?? 'finger';
  const showFretNumbers = showFretNumbersProp ?? data.display?.showFretNumbers ?? true;
  const showStringNames = showStringNamesProp ?? data.display?.showStringNames ?? true;
  const numStrings = numStringsProp ?? data.positions.notes.length;
  
  // Extract data from the chord object
  const { positions, theory } = data;
  const { notes, barres = [], fingers } = positions;
  
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
  
  // Add padding (10% of the minimum dimension on each side, extra on top for open/muted strings)
  const minDimension = Math.min(diagramWidth, diagramHeight);
  const padding = Math.max(20, minDimension * 0.1); // At least 20px or 10% of min dimension
  const topPadding = padding * 1.8; // Extra space on top for open/muted strings
  const paddedWidth = Math.max(0, diagramWidth - padding * 2);
  const paddedHeight = Math.max(0, diagramHeight - padding * 2);
  
  // Maximum number of frets to show
  const MAX_FRETS = 24;
  
  // Calculate actual number of frets
  const maxFret = notes.length > 0 ? Math.max(...notes.map(note => 
    typeof note.fret === 'number' ? note.fret : 0
  )) : 0;
  const actualNumFrets = Math.min(
    Math.max(numFretsProp ?? DEFAULT_NUM_FRETS, maxFret + 1),
    MAX_FRETS
  );
  
  // Use provided tuning or default
  const actualTuning = tuning ?? DEFAULT_TUNING;
  
  // Generate note labels based on label type
  const noteLabels = useMemo(() => {
    // Crea un array di lunghezza numStrings riempito con spazi
    const defaultLabels = Array(numStrings).fill(' ');
    
    if (labelType === 'none') return [...defaultLabels];
    
    let sourceArray = [];
    
    if (labelType === 'finger') {
      // Per le diteggiature, usa l'array fornito o un array di null
      sourceArray = fingers?.length ? [...fingers] : Array(notes.length).fill(null);
    } else if (labelType === 'tone') {
      // Per le note, usa quelle fornite o un array vuoto
      sourceArray = theory?.tones ? [...theory.tones] : [];
    } else if (labelType === 'interval') {
      // Per gli intervalli, usa quelli forniti o un array vuoto
      sourceArray = theory?.intervals ? [...theory.intervals] : [];
    }
    
    // Mappa l'array sorgente sostituendo 'x' o 'X' con uno spazio
    const labels = sourceArray.map(item => {
      if (item === 'x' || item === 'X') return ' ';
      return item || ' ';
    });
    
    // Assicurati che l'array abbia la lunghezza corretta
    while (labels.length < numStrings) {
      labels.push(' ');
    }
    
    // Tronca l'array se è più lungo di numStrings
    return labels.slice(0, numStrings);
  }, [labelType, fingers, notes.length, theory, numStrings]);
  
  return (
    <div className="flex flex-col items-center">
      {/* Chord Info Section */}
      <div className="w-full px-2 mb-2">
        <ChordInfo data={data} className="text-sm" />
      </div>
      
      {/* Diagram Section */}
      <div 
        className={`chord-diagram relative ${className}`}
        style={{ width: diagramWidth, height: diagramHeight }}
      >
        <div className="relative w-full h-full">
          <svg
            ref={ref}
            className="w-full h-full"
            viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={`translate(${padding}, ${topPadding})`}>
              <FretboardBase 
                width={paddedWidth}
                height={paddedHeight}
                numStrings={numStrings} 
                numFrets={actualNumFrets}
                showFretNumbers={showFretNumbers}
                showStringNames={showStringNames}
                tuning={actualTuning}
                labelType={labelType}
                labels={noteLabels} // Passa sempre le noteLabels per gestire le corde mute
                theory={data.theory}
              />
              
              <NotesLayer
                width={paddedWidth}
                height={paddedHeight}
                numStrings={numStrings}
                numFrets={actualNumFrets}
                notes={notes}
                barres={barres}
                onNoteClick={onNoteClick ? (note) => onNoteClick(note, 0) : undefined}
                onBarreClick={onBarreClick}
              />
              
              {labelType !== 'none' && (
                <LabelsLayer
                  width={paddedWidth}
                  height={paddedHeight}
                  numStrings={numStrings}
                  numFrets={actualNumFrets}
                  notes={notes}
                  labels={noteLabels}
                  className={`label-type-${labelType}`}
                />
              )}
            </g>
          </svg>
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
