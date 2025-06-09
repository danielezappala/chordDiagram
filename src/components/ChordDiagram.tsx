import React, { forwardRef, useState, useMemo, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import type {
  PositionedNote,
  Barre,
  ChordDiagramData,
  ChordPositionData
} from '../types';

// Local defaults (as DEFAULT constants are no longer in types.ts)
const DEFAULT_NUM_FRETS = 5;
const DEFAULT_WIDTH = 200; // Adjusted as per prompt
const DEFAULT_HEIGHT = 300; // Adjusted as per prompt
const DEFAULT_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

import { FretboardBase } from './FretboardBase';
import { NotesLayer } from './NotesLayer';
import { ChordInfo } from './ChordInfo';

interface ChordDiagramProps {
  data: ChordDiagramData;
  positionIndex?: number;
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  showFretNumbers?: boolean;
  fretNumberPosition?: 'left' | 'right';
  showStringNames?: boolean;
  width?: number;
  height?: number;
  numStrings?: number;
  numFrets?: number;
  tuning?: string[];
  onNoteClick?: (note: PositionedNote, position: ChordPositionData, event: React.MouseEvent<unknown>) => void;
  onBarreClick?: (barre: Barre, position: ChordPositionData, event: React.MouseEvent<unknown>) => void;
  className?: string;
  // Bottom labels configuration
  bottomLabels?: {
    showFingers?: boolean;
    showTones?: boolean;
    showIntervals?: boolean;
  };
  chordInfoVisibility?: { // Object to control visibility of individual ChordInfo sections
    showInstrument?: boolean;
    showTuning?: boolean;
    showChordTones?: boolean;
    showIntervals?: boolean;
  };
}

const ChordDiagram = forwardRef<SVGSVGElement, ChordDiagramProps>(
  (props, ref): JSX.Element | null => {
    const diagramRef = useRef<HTMLDivElement>(null);
    // Destructure props
    const {
      data,
      positionIndex = 0,
      labelType: labelTypeProp,
      showFretNumbers: showFretNumbersProp,
      fretNumberPosition: fretNumberPositionProp,
      showStringNames: showStringNamesProp,
      width: widthProp,
      height: heightProp,
      numStrings: numStringsProp,
      numFrets: numFretsProp,
      tuning: tuningProp,
      onNoteClick: onNoteClickCallback,
      onBarreClick: onBarreClickCallback,
      className = '',
      bottomLabels: propBottomLabels = {
        showFingers: false,
        showTones: true,
        showIntervals: false
      },
    } = props;

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

    // ...function body continues here...

    const exportToPng = useCallback(async () => {
      if (diagramRef.current) {
        // Temporarily force background for html2canvas
        const originalBackgroundColor = diagramRef.current.style.backgroundColor;
        diagramRef.current.style.backgroundColor = '#ffffff'; // Force white

        try {
          const canvas = await html2canvas(diagramRef.current, {
            useCORS: true,
            scale: 1, // Natural scale
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              if (clonedDoc.body) {
                clonedDoc.body.style.backgroundColor = '#ffffff';
              }
            },
          });
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${data.name || 'chord-diagram'}.png`;
          link.href = image;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error exporting to PNG:', error);
        } finally {
          diagramRef.current.style.backgroundColor = originalBackgroundColor; // Restore original background
        }
      }
    }, [data.name]);

    const copyImageToClipboard = useCallback(async () => {
      if (diagramRef.current) {
        // Temporarily force background for html2canvas
        const originalBackgroundColor = diagramRef.current.style.backgroundColor;
        diagramRef.current.style.backgroundColor = '#ffffff'; // Force white

        try {
          const canvas = await html2canvas(diagramRef.current, {
            useCORS: true,
            scale: 1, // Natural scale
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
              if (clonedDoc.body) {
                clonedDoc.body.style.backgroundColor = '#ffffff';
              }
            },
          });
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob })
                ]);
                alert('Image copied to clipboard!'); // Consider a more subtle notification
              } catch (err) {
                console.error('Failed to copy image to clipboard: ', err);
                alert('Failed to copy image. See console for details.');
              }
            } else {
              throw new Error('Canvas toBlob returned null');
            }
          }, 'image/png');
        } catch (error) {
          console.error('Error preparing image for clipboard:', error);
          alert('Error preparing image for clipboard. See console for details.');
        } finally {
          diagramRef.current.style.backgroundColor = originalBackgroundColor; // Restore original background
        }
      }
    }, []);


    // Local state for bottomLabels if not provided by props
    const [bottomLabels, setBottomLabels] = useState(() => ({
      showFingers: false,
      showTones: true,
      showIntervals: false,
      ...propBottomLabels
    }));

    // Only use local state if propBottomLabels is undefined (uncontrolled mode)
    const effectiveBottomLabels = propBottomLabels === undefined ? bottomLabels : propBottomLabels;

    // Toggle function for local state only
    const toggleBottomLabel = (type: keyof typeof bottomLabels) => {
      if (propBottomLabels !== undefined) return;
      setBottomLabels(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    };

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

  const handleNoteClickForLayer = useCallback((note: PositionedNote, event: React.MouseEvent<unknown>) => {
    if (onNoteClickCallback && positionToDisplay) {
      onNoteClickCallback(note, positionToDisplay, event);
    }
  }, [onNoteClickCallback, positionToDisplay]);

  const handleBarreClickForLayer = useCallback((barre: Barre, event: React.MouseEvent<unknown>) => {
    if (onBarreClickCallback && positionToDisplay) {
      onBarreClickCallback(barre, positionToDisplay, event);
    }
  }, [onBarreClickCallback, positionToDisplay]);

  const noteLabels = useMemo(() => {
    const labels = Array(derivedNumStrings).fill(' ');
    if (!positionToDisplay?.notes) return labels;

    if (currentLabelType === 'none') {
      positionToDisplay.notes.forEach((note: PositionedNote) => {
        if (note.position.fret === -1) {
          const stringIndex = note.position.string - 1;
          if (stringIndex >= 0 && stringIndex < derivedNumStrings) {
            labels[stringIndex] = 'X';
          }
        }
      });
      return labels;
    }

    positionToDisplay.notes.forEach((note: PositionedNote) => {
      const stringIndex = note.position.string - 1;
      if (stringIndex < 0 || stringIndex >= derivedNumStrings) return;


      // Controlla se la corda è muta in modo più robusto
      const isMuted = note.position.fret === -1 || 
                      note.annotation?.finger?.toString().toLowerCase() === 'x';

      if (isMuted) {
        if (currentLabelType === 'finger') {
          labels[stringIndex] = 'X';
        } else if (currentLabelType === 'tone') {
          labels[stringIndex] = ''; // Stringa vuota per i toni delle corde mute
        } else if (currentLabelType === 'interval') {
          labels[stringIndex] = ''; // Stringa vuota anche per gli intervalli (o 'X' se preferito)
        } else { // Include 'none' o qualsiasi altro tipo non gestito esplicitamente
          labels[stringIndex] = 'X';
        }
      } else {
        let labelContent: string | null = null;
        if (currentLabelType === 'finger') labelContent = note.annotation?.finger?.toString() ?? null;
        else if (currentLabelType === 'tone') labelContent = note.annotation?.tone ?? null;
        else if (currentLabelType === 'interval') labelContent = note.annotation?.interval ?? null;
        
        // Se labelContent è null (es. per 'none' o se l'annotazione manca), usa uno spazio.
        // Se è una stringa vuota (es. per un tono/intervallo che è intenzionalmente vuoto ma non muto), mantienila.
        labels[stringIndex] = labelContent === null ? ' ' : labelContent;
      }
    });
    return labels;
  }, [derivedNumStrings, positionToDisplay?.notes, currentLabelType]);
  
  // Layout calculations
  const CONTENT_MIN_WIDTH = 200;
  const CONTENT_MIN_HEIGHT = 250;
  const CONTENT_ASPECT_RATIO = CONTENT_MIN_WIDTH / CONTENT_MIN_HEIGHT;

  // Start with dimensions from props or defaults
  const propWidth = widthProp ?? DEFAULT_WIDTH;
  const propHeight = heightProp ?? DEFAULT_HEIGHT;

  let calculatedWidth = propWidth;
  let calculatedHeight = propWidth / CONTENT_ASPECT_RATIO;

  if (calculatedHeight > propHeight) {
    calculatedHeight = propHeight;
    calculatedWidth = calculatedHeight * CONTENT_ASPECT_RATIO;
  }

  // Ensure minimum dimensions
  const ABSOLUTE_MIN_RENDER_WIDTH = 50;
  const ABSOLUTE_MIN_RENDER_HEIGHT = 50;
  calculatedWidth = Math.max(ABSOLUTE_MIN_RENDER_WIDTH, calculatedWidth);
  calculatedHeight = Math.max(ABSOLUTE_MIN_RENDER_HEIGHT, calculatedHeight);

  const diagramWidth = calculatedWidth;
  const diagramHeight = calculatedHeight;

  // Calculate dimensions and padding
  const sidePadding = 80;
  const topPadding = 80;
  const bottomPadding = 80;

  const horizontalOffset = -Math.min(diagramWidth * 0.5, 0);
  const paddedWidth = diagramWidth - sidePadding * 1.7;
  const paddedHeight = diagramHeight - topPadding - bottomPadding;
  
  const actualNumFrets = numFretsProp ?? DEFAULT_NUM_FRETS;

  // barresForLayer needs to be defined before the return, and after positionToDisplay might be null
  const barresForLayer = positionToDisplay?.barres || [];

  // Early return if positionToDisplay is null. This is AFTER all hooks.
  if (!positionToDisplay) {
    console.error("ChordDiagram: No valid position data to display for index.", positionIndex);
    return <svg ref={ref} width={widthProp ?? DEFAULT_WIDTH} height={heightProp ?? DEFAULT_HEIGHT} className={className}><text x="10" y="20">No position data</text></svg>;
  }

  return (
    <div className="relative flex flex-col items-center w-full"> {/* Added relative for positioning export button */}
    {/* Action Buttons Container */}
    <div className="absolute top-2 right-2 z-20 flex space-x-2">
      {/* Copy Button */}
      <button
        onClick={copyImageToClipboard}
        title="Copy Image to Clipboard"
        className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      </button>
      {/* Export Button */}
      <button
        onClick={exportToPng}
        title="Export as PNG"
        className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 shadow"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>
    </div>
    {/* Toggle buttons for bottom labels, only if using local state (propBottomLabels not provided) */}
    {propBottomLabels === undefined && (
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => toggleBottomLabel('showFingers')} className={`px-2 py-1 border rounded ${effectiveBottomLabels.showFingers ? 'bg-blue-200' : ''}`}>Fingers</button>
        <button type="button" onClick={() => toggleBottomLabel('showTones')} className={`px-2 py-1 border rounded ${effectiveBottomLabels.showTones ? 'bg-blue-200' : ''}`}>Tones</button>
        <button type="button" onClick={() => toggleBottomLabel('showIntervals')} className={`px-2 py-1 border rounded ${effectiveBottomLabels.showIntervals ? 'bg-blue-200' : ''}`}>Intervals</button>
      </div>
    )}
      <div
        className="flex flex-col items-center w-full" // Added w-full here
        style={{
          marginLeft: `${horizontalOffset}px`,
          transition: 'margin-left 0.2s ease-in-out'
        }}
      >
        {/* Area to be exported to PNG - assign ref here */}
        <div ref={diagramRef} className="w-full flex flex-col items-center bg-white rounded-lg shadow-md"> {/* Removed p-4, Added bg-white for defined export background */}
          {/* Chord Info Section - Moved inside export area */}
          <div className="w-full flex justify-start mt-4 mb-2">
            <div className="w-full max-w-[600px] px-4">
              <ChordInfo
              name={data.name}
              intervals={data.theory?.formula?.split(' ') || []}
              playedNotes={data.theory?.chordTones || []}
              showFormula={true}
              className=""
              instrument={data.instrument || ''}
              tuning={derivedActualTuning}
              showInstrument={props.chordInfoVisibility?.showInstrument}
              showTuning={props.chordInfoVisibility?.showTuning}
              showChordTones={props.chordInfoVisibility?.showChordTones}
              showIntervals={props.chordInfoVisibility?.showIntervals}
            />
          </div>
        </div>
          {/* Diagram Section - Now directly inside the diagramRef div */}
          <div
            className={`chord-diagram-svg-container relative ${className || ''}`}
            style={{
              width: diagramWidth,
              height: diagramHeight,
              // marginLeft: '-25px' // Consider if this is still needed or handled by parent
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
                  bottomLabels={effectiveBottomLabels}
                  positionNotes={positionToDisplay.notes}
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
        </div> {/* Closes diagramRef div */}
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
