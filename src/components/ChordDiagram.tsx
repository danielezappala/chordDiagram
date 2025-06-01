import { forwardRef, useMemo, useCallback } from 'react';
import type { ForwardedRef } from 'react';
import type {
  // ChordDiagramData, // Not directly used, ChordDiagramProps covers it
  // ChordPositionData, // Not directly used, ChordDiagramProps covers it
  PositionedNote,
  Barre,
  // FretNumberPosition, // Not directly used, ChordDiagramProps covers it
  ChordDiagramProps
} from '../types';

// Local defaults (as DEFAULT constants are no longer in types.ts)
const DEFAULT_NUM_FRETS = 5;
const DEFAULT_WIDTH = 200; // Adjusted as per prompt
const DEFAULT_HEIGHT = 300; // Adjusted as per prompt
const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

import { FretboardBase } from './FretboardBase';
import { NotesLayer } from './NotesLayer';
import { ChordInfo } from './ChordInfo';

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

  // All hooks must be called unconditionally at the top level.
  const positionToDisplay = data.positions && data.positions.length > 0 && positionIndex < data.positions.length
    ? data.positions[positionIndex]
    : null;

  // Resolve display settings: Prop > data.display > component default
  // These need to be resolvable even if positionToDisplay is null for hooks below.
  const currentLabelType = labelTypeProp ?? data.display?.labelType ?? 'finger';
  const currentShowFretNumbers = showFretNumbersProp ?? data.display?.showFretNumbers ?? true;
  const currentFretNumberPosition = fretNumberPositionProp ?? data.display?.fretNumberPosition ?? 'left';
  const currentShowStringNames = showStringNamesProp ?? data.display?.showStringNames ?? true;

  // currentBaseFret might be undefined if positionToDisplay is null. Hooks using it must handle this.
  const currentBaseFret = positionToDisplay?.baseFret ?? 1;

  const derivedNumStrings = useMemo(() => {
    if (numStringsProp) return numStringsProp;

    if (data.tuning) {
      if (typeof data.tuning === 'object' && !Array.isArray(data.tuning) && data.tuning.notes) {
        return data.tuning.notes.length;
      }
      if (Array.isArray(data.tuning)) {
        return data.tuning.length;
      }
    }
    // If positionToDisplay is null, we can't derive from its notes.
    if (positionToDisplay?.notes && positionToDisplay.notes.length > 0) {
      const validStrings = positionToDisplay.notes
        .filter(pn => pn && pn.position)
        .map(pn => pn.position.string);
      if (validStrings.length > 0) {
        return Math.max(...validStrings);
      }
    }
    const defaultTuningArray = (typeof DEFAULT_TUNING !== 'undefined' && Array.isArray(DEFAULT_TUNING)) ? DEFAULT_TUNING : ['E', 'A', 'D', 'G', 'B', 'E'];
    return defaultTuningArray.length;
  }, [numStringsProp, data.tuning, positionToDisplay]);

  const derivedActualTuning = useMemo(() => {
    if (tuningProp) return tuningProp;
    if (data.tuning) {
      if (typeof data.tuning === 'object' && !Array.isArray(data.tuning) && data.tuning.notes) {
        return data.tuning.notes;
      }
      if (Array.isArray(data.tuning)) {
        return data.tuning;
      }
    }

    const strings = derivedNumStrings;
    if (strings === 4) return ['E', 'A', 'D', 'G'];
    if (strings === 5) return ['A', 'D', 'G', 'B', 'E'];
    if (strings === 7) return ['B', 'E', 'A', 'D', 'G', 'B', 'E'];

    const defaultTuningArray = (typeof DEFAULT_TUNING !== 'undefined' && Array.isArray(DEFAULT_TUNING)) ? DEFAULT_TUNING : ['E', 'A', 'D', 'G', 'B', 'E'];
    return defaultTuningArray;
  }, [tuningProp, data.tuning, derivedNumStrings]);

  const handleNoteClickForLayer = useCallback((note: PositionedNote, event: React.MouseEvent) => {
    if (onNoteClickCallback && positionToDisplay) {
      onNoteClickCallback(note, positionToDisplay, event);
    }
  }, [onNoteClickCallback, positionToDisplay]);

  const handleBarreClickForLayer = useCallback((barre: Barre, event: React.MouseEvent) => {
    if (onBarreClickCallback && positionToDisplay) {
      onBarreClickCallback(barre, positionToDisplay, event);
    }
  }, [onBarreClickCallback, positionToDisplay]);

  // processedNotesForLayer is removed. NotesLayer will receive positionToDisplay.notes directly.

  const noteLabels = useMemo(() => {
    const labels = Array(derivedNumStrings).fill(' ');
    if (!positionToDisplay?.notes) return labels; // Return default if no notes in position

    // currentLabelType is already resolved before hooks
    if (currentLabelType === 'none') {
      positionToDisplay.notes.forEach(note => { // Iterate over PositionedNote
        if (note.position.fret === -1) { // Check muted state from PositionedNote
          const stringIndex = note.position.string - 1;
          if (stringIndex >= 0 && stringIndex < derivedNumStrings) {
            labels[stringIndex] = 'X';
          }
        }
      });
      return labels;
    }

    positionToDisplay.notes.forEach(note => { // Iterate over PositionedNote
      const stringIndex = note.position.string - 1;
      if (stringIndex < 0 || stringIndex >= derivedNumStrings) return;

      if (note.position.fret === -1) { // Check muted state from PositionedNote
        labels[stringIndex] = 'X';
      } else {
        let labelContent: string | null = null;
        // Access annotations from PositionedNote
        if (currentLabelType === 'finger') labelContent = note.annotation?.finger?.toString() ?? null;
        else if (currentLabelType === 'tone') labelContent = note.annotation?.tone ?? null;
        else if (currentLabelType === 'interval') labelContent = note.annotation?.interval ?? null;
        // Removed: else if (currentLabelType === 'degree') labelContent = note.annotation?.degree ?? null;
        labels[stringIndex] = labelContent ?? ' ';
      }
    });
    return labels;
  }, [derivedNumStrings, positionToDisplay?.notes, currentLabelType]); // Dependency on positionToDisplay.notes

  // New Sizing Logic (can remain here, does not depend on hooks directly)
  const CONTENT_MIN_WIDTH = 200;
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
  const bottomPadding = 40;

  const horizontalOffset = -Math.min(diagramWidth * 0.5, 80);
  const paddedWidth = diagramWidth - sidePadding * 1;
  const paddedHeight = diagramHeight - topPadding - bottomPadding;

  const actualNumFrets = numFretsProp ?? DEFAULT_NUM_FRETS;

  // barresForLayer needs to be defined before the return, and after positionToDisplay might be null
  const barresForLayer = positionToDisplay?.barres || [];

  // Early return if positionToDisplay is null. This is AFTER all hooks.
  if (!positionToDisplay) {
    console.error("ChordDiagram: No valid position data to display for index.", positionIndex);
    // Optionally render a placeholder or error message
    return <svg ref={ref} width={widthProp ?? DEFAULT_WIDTH} height={heightProp ?? DEFAULT_HEIGHT} className={className}><text x="10" y="20">No position data</text></svg>;
  }

  // All variables that depend on positionToDisplay being non-null and are used in JSX
  // should be defined after this null check, or ensure they have defaults.
  // currentBaseFret is already handled with a default.
  // processedNotesForLayer and noteLabels return defaults if positionToDisplay was null.
  // barresForLayer is handled with a default.

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="flex flex-col items-center w-full" // Added w-full here
        style={{
          marginLeft: `${horizontalOffset}px`,
          transition: 'margin-left 0.2s ease-in-out'
        }}
      >
        {/* Chord Info Section */}
        <div className="w-full flex justify-center mb-2"> {/* Added flex and justify-center */}
          <div className="w-full max-w-[600px] px-4"> {/* Added max-width and centered content */}
            <ChordInfo
              data={data}
              name={data.name}
              intervals={data.theory?.formula?.split(' ') || []}
              playedNotes={data.theory?.chordTones || []}
              showFormula={true}
              className="text-center"
            />
          </div>
        </div>
        {/* Diagram Section */}
        <div
          className={`chord-diagram relative ${className || ''} order-2`}
          style={{
            width: diagramWidth,
            height: diagramHeight,
            marginLeft: '-25px'
          }}
        >
          <div className="relative w-full h-full" style={{ marginLeft: '-2px' }}>
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
                    notes={positionToDisplay.notes} // Pass PositionedNote[] directly
                    barres={barresForLayer}
                    numStrings={derivedNumStrings}
                    numFrets={actualNumFrets}
                    startFret={currentBaseFret}
                    labelType={currentLabelType} // Pass resolved labelType
                    labels={noteLabels} // Pass generated labels
                    onNoteClick={onNoteClickCallback ? handleNoteClickForLayer : undefined}
                    onBarreClick={onBarreClickCallback ? handleBarreClickForLayer : undefined}
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
// Export the type for named imports (ChordDiagramProps is now imported from types.ts)
// export type { ChordDiagramProps }; // This line can be removed
