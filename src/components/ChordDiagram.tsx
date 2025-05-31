import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import type {
  ChordDiagramData, // v2
  ChordPositionData,
  PositionedNote,
  // FretPosition, // Not directly used, part of PositionedNote
  // NoteAnnotation, // Not directly used, part of PositionedNote
  // FingerDesignator, // Not directly used, part of NoteAnnotation
  Tuning,
  Barre, // v2
  FretNumberPosition // Still used
} from '../types';
// type LabelType = 'none' | 'finger' | 'tone' | 'interval'; // Now part of ChordDiagramProps & types.ts display options

// Local defaults (as DEFAULT constants are no longer in types.ts)
const DEFAULT_NUM_FRETS = 5;
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 250;
const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

import { FretboardBase } from './FretboardBase';
import { NotesLayer } from './NotesLayer';
import { ChordInfo } from './ChordInfo';

// Updated ChordDiagramProps
interface ChordDiagramProps {
  data: ChordDiagramData; // Uses the new data structure
  positionIndex?: number; // Defaults to 0

  // Overrides for display settings from ChordDiagramData.display
  labelType?: 'none' | 'finger' | 'tone' | 'interval' | 'degree';
  showFretNumbers?: boolean;
  fretNumberPosition?: FretNumberPosition;
  showStringNames?: boolean;

  // Sizing and other direct component props
  width?: number;
  height?: number;
  numStrings?: number; // Prop override
  numFrets?: number;   // Number of frets to draw on the diagram
  tuning?: string[];   // Prop override for tuning string array

  className?: string;
  // Temporarily simplify callbacks, to be fully refactored with NotesLayer update
  onNoteClick?: (note: any, positionData: ChordPositionData | null, event?: React.MouseEvent) => void;
  onBarreClick?: (barre: Barre, positionData: ChordPositionData | null, event?: React.MouseEvent) => void;
}


const ChordDiagram = forwardRef<SVGSVGElement, ChordDiagramProps>(({
  // Data
  data,
  positionIndex = 0, // Default to first position
  
  // Display settings (can be overridden by data.display or component props)
  labelType: labelTypeProp,
  showFretNumbers: showFretNumbersProp, // Prop override
  fretNumberPosition: fretNumberPositionProp, // Prop override
  showStringNames: showStringNamesProp, // Prop override
  
  // Sizing
  width: widthProp, // Renamed to avoid conflict with calculated width
  height: heightProp, // Renamed to avoid conflict with calculated height
  numStrings: numStringsProp, // Prop override
  numFrets: numFretsProp, // Prop override for number of frets to draw
  tuning: tuningProp, // Prop override for tuning string array
  
  // Callbacks
  onNoteClick: onNoteClickCallback, // Renamed
  onBarreClick: onBarreClickCallback, // Renamed
  
  // Class name
  className = '',
}: ChordDiagramProps, ref: ForwardedRef<SVGSVGElement>) => {

  const positionToDisplay = data.positions && data.positions.length > 0
                            ? data.positions[positionIndex ?? 0]
                            : null;

  if (!positionToDisplay) {
    console.error("ChordDiagram: No valid position data to display for index.", positionIndex);
    // Optionally render a placeholder or error message
    return <svg ref={ref} width={widthProp ?? DEFAULT_WIDTH} height={heightProp ?? DEFAULT_HEIGHT} className={className}><text x="10" y="20">No position data</text></svg>;
  }
  
  // Resolve display settings: Prop > data.display > component default
  const currentLabelType = labelTypeProp ?? data.display?.labelType ?? 'finger';
  const currentShowFretNumbers = showFretNumbersProp ?? data.display?.showFretNumbers ?? true;
  const currentFretNumberPosition = fretNumberPositionProp ?? data.display?.fretNumberPosition ?? 'left';
  const currentShowStringNames = showStringNamesProp ?? data.display?.showStringNames ?? true;

  const currentBaseFret = positionToDisplay.baseFret;

  const derivedNumStrings = useMemo(() => {
    if (numStringsProp) return numStringsProp;
    if (data.tuning && typeof data.tuning !== 'string' && data.tuning.notes) return data.tuning.notes.length;
    if (data.tuning && Array.isArray(data.tuning)) return data.tuning.length;
    // Infer from notes if possible, ensuring all strings are accounted for up to the max string number.
    if (positionToDisplay.notes && positionToDisplay.notes.length > 0) {
      return Math.max(...positionToDisplay.notes.map(pn => pn.position.string), 0);
    }
    return 6; // Fallback default
  }, [numStringsProp, data.tuning, positionToDisplay.notes]);

  const derivedActualTuning = useMemo(() => {
    if (tuningProp) return tuningProp;
    if (data.tuning && typeof data.tuning !== 'string' && data.tuning.notes) return data.tuning.notes;
    if (data.tuning && Array.isArray(data.tuning)) return data.tuning;
    return DEFAULT_TUNING.slice(0, derivedNumStrings); // Ensure tuning matches string count
  }, [tuningProp, data.tuning, derivedNumStrings]);

  // Calculate dimensions with minimums and scale proportionally
  const minWidth = 250;
  const minHeight = 300;
  
  // Get base dimensions from props or data, fallback to defaults
  const baseWidth = typeof widthProp === 'number' ? widthProp : (data.display?.width ?? DEFAULT_WIDTH);
  const baseHeight = typeof heightProp === 'number' ? heightProp : (data.display?.height ?? DEFAULT_HEIGHT);
  
  // Calculate aspect ratio based on minimum dimensions
  const minAspectRatio = minWidth / minHeight;
  
  // Calculate dimensions that respect minimums and maintain aspect ratio
  let diagramWidth = Math.max(minWidth, baseWidth);
  let diagramHeight = Math.max(minHeight, baseHeight);
  
  // Ensure the aspect ratio is maintained if one dimension is fixed
  if (diagramWidth / diagramHeight > minAspectRatio) {
    diagramHeight = diagramWidth / minAspectRatio;
  } else {
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
  const sidePadding = 40;
  const topPadding = 30;
  const bottomPadding = 15;
  
  const horizontalOffset = -Math.min(diagramWidth * 0.1, 80);
  const paddedWidth = diagramWidth - sidePadding * 2;
  const paddedHeight = diagramHeight - topPadding - bottomPadding;
  
  const actualNumFrets = numFretsProp ?? DEFAULT_NUM_FRETS;
  
  const barresForLayer = positionToDisplay.barres || [];

  const processedNotesForLayer = useMemo(() => {
    if (!positionToDisplay) return [];
    return positionToDisplay.notes.map(pn => {
      return {
        string: pn.position.string,
        fret: pn.position.fret,
        muted: pn.position.fret === -1, // Muted if fret is -1
        finger: pn.annotation?.finger || null,
        tone: pn.annotation?.tone || '',
        interval: pn.annotation?.interval || '',
        degree: pn.annotation?.degree || '',
        highlight: pn.annotation?.highlight || false
      };
    });
  }, [positionToDisplay]);

  const noteLabels = useMemo(() => {
    const labels = Array(derivedNumStrings).fill(' ');
    if (!positionToDisplay) return labels;

    const currentLabelTypeForLogic = labelTypeProp ?? data.display?.labelType ?? 'finger';

    if (currentLabelTypeForLogic === 'none') {
        processedNotesForLayer.forEach(note => {
            if (note.muted) { // Use the 'muted' flag from processedNotesForLayer
                const stringIndex = note.string - 1;
                if (stringIndex >= 0 && stringIndex < derivedNumStrings) {
                    labels[stringIndex] = 'X';
                }
            }
        });
        return labels;
    }

    processedNotesForLayer.forEach(note => {
      const stringIndex = note.string - 1;
      if (stringIndex < 0 || stringIndex >= derivedNumStrings) return;

      if (note.muted) { // Use the 'muted' flag
        labels[stringIndex] = 'X';
      } else {
        let labelContent: string | null = null;
        if (currentLabelTypeForLogic === 'finger') labelContent = note.finger?.toString() ?? null;
        else if (currentLabelTypeForLogic === 'tone') labelContent = note.tone ?? null;
        else if (currentLabelTypeForLogic === 'interval') labelContent = note.interval ?? null;
        else if (currentLabelTypeForLogic === 'degree') labelContent = note.degree ?? null;
        labels[stringIndex] = labelContent ?? ' ';
      }
    });
    return labels;
  }, [derivedNumStrings, positionToDisplay, processedNotesForLayer, labelTypeProp, data.display?.labelType]);
  
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
          <ChordInfo data={data} className="text-sm" /> {/* ChordInfo will need update for v2 data */}
        </div>
        
        {/* Diagram Section */}
        <div 
          className={`chord-diagram relative ${className || ''}`}
          style={{ 
            width: diagramWidth + 30, // Consider if this +30 is still needed or part of overall sizing
            height: diagramHeight + 20, // Same for +20
          }}
        >
          <div className="relative w-full h-full">
            <svg
              ref={ref}
              className="w-full h-full"
              viewBox={`${currentFretNumberPosition === 'left' ? -sidePadding : 0} 0 ${diagramWidth + (currentFretNumberPosition === 'right' ? sidePadding : 0)} ${diagramHeight}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <g transform={`translate(${(currentFretNumberPosition === 'left' ? sidePadding : 0) - 30}, ${topPadding})`}>
                <FretboardBase
                  width={paddedWidth}
                  height={paddedHeight}
                  numStrings={derivedNumStrings}
                  numFrets={actualNumFrets}
                  startFret={currentBaseFret}
                  showFretNumbers={currentShowFretNumbers}
                  fretNumberPosition={currentFretNumberPosition}
                  showStringNames={currentShowStringNames}
                  tuning={derivedActualTuning}
                  labelType={currentLabelType} // Pass resolved labelType
                  labels={noteLabels} // Pass generated labels
                  theory={data.theory} // Pass global theory for now
                >
                  <NotesLayer
                    width={paddedWidth}
                    height={paddedHeight}
                    notes={processedNotesForLayer} // Pass new processed notes
                    barres={barresForLayer} // Pass new barres
                    numStrings={derivedNumStrings}
                    numFrets={actualNumFrets}
                    startFret={currentBaseFret}
                    labelType={currentLabelType} // Pass resolved labelType
                    labels={noteLabels} // Pass generated labels
                    // Temporarily simplified onNoteClick and onBarreClick
                    onNoteClick={onNoteClickCallback ? (note) => onNoteClickCallback(note, positionToDisplay) : undefined}
                    onBarreClick={onBarreClickCallback ? (barre) => onBarreClickCallback(barre, positionToDisplay) : undefined}
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

// Add error boundary (no change here)
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
