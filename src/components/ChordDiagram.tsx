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
const DEFAULT_WIDTH = 250; // Adjusted as per prompt
const DEFAULT_HEIGHT = 300; // Adjusted as per prompt
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
    if (numStringsProp) return numStringsProp; // Prop override

    if (data.tuning) {
      if (typeof data.tuning === 'object' && !Array.isArray(data.tuning) && data.tuning.notes) {
        return data.tuning.notes.length;
      }
      if (Array.isArray(data.tuning)) {
        return data.tuning.length;
      }
    }

    if (positionToDisplay && positionToDisplay.notes && positionToDisplay.notes.length > 0) {
      const validStrings = positionToDisplay.notes
          .filter(pn => pn && pn.position)
          .map(pn => pn.position.string);
      if (validStrings.length > 0) {
          return Math.max(...validStrings);
      }
    }
    // Ensure DEFAULT_TUNING is defined or use a literal
    const defaultTuningArray = (typeof DEFAULT_TUNING !== 'undefined' && Array.isArray(DEFAULT_TUNING)) ? DEFAULT_TUNING : ['E', 'A', 'D', 'G', 'B', 'E'];
    return defaultTuningArray.length;
  }, [numStringsProp, data.tuning, positionToDisplay]);

  const derivedActualTuning = useMemo(() => {
    if (tuningProp) return tuningProp; // Prop override
    if (data.tuning) {
      if (typeof data.tuning === 'object' && !Array.isArray(data.tuning) && data.tuning.notes) {
        return data.tuning.notes;
      }
      if (Array.isArray(data.tuning)) {
        return data.tuning;
      }
    }

    // Fallback using derivedNumStrings
    const strings = derivedNumStrings;
    if (strings === 4) return ['E', 'A', 'D', 'G']; // Bass default EADG (Low to High)
    if (strings === 5) return ['A', 'D', 'G', 'B', 'E']; // Example 5-string ADGBE (Low to High)
    if (strings === 7) return ['B', 'E', 'A', 'D', 'G', 'B', 'E']; // 7-string BEADGBE (Low to High)

    // Default 6-string or use DEFAULT_TUNING if available and appropriate
    const defaultTuningArray = (typeof DEFAULT_TUNING !== 'undefined' && Array.isArray(DEFAULT_TUNING)) ? DEFAULT_TUNING : ['E', 'A', 'D', 'G', 'B', 'E'];
    return defaultTuningArray;
  }, [tuningProp, data.tuning, derivedNumStrings]);
  
  // New Sizing Logic
  // Local constants for defining content's natural aspect ratio and min size
  const CONTENT_MIN_WIDTH = 250;
  const CONTENT_MIN_HEIGHT = 300;
  const CONTENT_ASPECT_RATIO = CONTENT_MIN_WIDTH / CONTENT_MIN_HEIGHT;

  // Start with dimensions from props or defaults
  const propWidth = widthProp ?? DEFAULT_WIDTH; // widthProp is the 'width' from component props
  const propHeight = heightProp ?? DEFAULT_HEIGHT; // heightProp is the 'height' from component props

  let calculatedWidth = propWidth;
  let calculatedHeight = propWidth / CONTENT_ASPECT_RATIO; // Calculate height based on propWidth and content's aspect ratio

  if (calculatedHeight > propHeight) { // If calculated height is too much for propHeight
    calculatedHeight = propHeight; // Limit height to propHeight
    calculatedWidth = calculatedHeight * CONTENT_ASPECT_RATIO; // Recalculate width based on limited height
  }

  // Ensure the calculated dimensions are not less than a very small absolute minimum (e.g., to prevent division by zero or invisible diagram)
  const ABSOLUTE_MIN_RENDER_WIDTH = 50;
  const ABSOLUTE_MIN_RENDER_HEIGHT = 50;
  calculatedWidth = Math.max(ABSOLUTE_MIN_RENDER_WIDTH, calculatedWidth);
  calculatedHeight = Math.max(ABSOLUTE_MIN_RENDER_HEIGHT, calculatedHeight);
  
  const diagramWidth = calculatedWidth;
  const diagramHeight = calculatedHeight;
  
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
        <div className="w-full px-4 mb-2 order-1">
          <ChordInfo data={data} className="text-sm" /> {/* ChordInfo will need update for v2 data */}
        </div>
        
        {/* Diagram Section */}
        <div 
          className={`chord-diagram relative ${className || ''} order-2`}
          style={{ 
            width: diagramWidth,
            height: diagramHeight,
          }}
        >
          <div className="relative w-full h-full">
            <svg
              ref={ref}
              className="w-full h-full"
              viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
              <g transform={`translate(${sidePadding}, ${topPadding})`}>
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
