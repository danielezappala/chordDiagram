import React from 'react';

export type FretNumberPosition = 'left' | 'right' | 'none';

interface FretboardBaseProps extends React.PropsWithChildren {
  numStrings: number;
  numFrets: number;
  width: number;
  height: number;
  showFretNumbers?: boolean;
  fretNumberPosition?: FretNumberPosition;
  showStringNames?: boolean;
  className?: string;
  tuning?: string[];
  labelType?: 'none' | 'finger' | 'tone' | 'interval' | 'degree'; // Added 'degree'
  labels?: (string | number | null)[]; // These are the noteLabels from ChordDiagram
  // Updated theory type to match new ChordDiagramData.theory
  // theory?: { // Removed as per lint rule no-unused-vars
  //   formula?: string;
  //   intervals?: string[];
  //   chordTones?: string[];
  // };
  startFret?: number;
  theory?: {formula?: string, intervals?: string[], chordTones?: string[]};
}

const FretboardBase: React.FC<FretboardBaseProps> = ({
  children,
  numStrings,
  numFrets,
  width,
  height,
  showFretNumbers = true,
  fretNumberPosition = 'left',
  showStringNames = true, // This prop now primarily controls fallback to tuning notes
  className = '',
  tuning,
  labelType = 'finger', // labelType is used for styling text in current code, not for choosing content here.
  labels = [], // These are the pre-processed noteLabels from ChordDiagram
  // theory, // Removed as per lint rule no-unused-vars
  startFret = 1,
}) => {
  // Calculate dimensions with padding for labels
  const labelAreaHeight = 30; // Extra space for labels at the bottom
  const paddedHeight = height - labelAreaHeight;
  
  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = paddedHeight / (numFrets + 1); // +1 for the nut area

  // Calcola la spaziatura per i numeri dei tasti in base alla larghezza della tastiera
  const fretNumberSpacing = width * 0.1; // 10% della larghezza
  const fretNumberOffset = -5; // Offset per spostare i numeri leggermente più a sinistra
  
  // Calcola la dimensione del testo in base alla dimensione della tastiera
  const baseFontSize = Math.min(width, paddedHeight) * 0.05; // 5% della dimensione minore
  const fontSize = Math.max(12, Math.min(baseFontSize, 16)); // Tra 12px e 16px

  // Calculate string thickness based on the number of strings
  const getStringThickness = (index: number, totalStrings: number) => {
    if (totalStrings <= 4) return 1.5; // Thicker strings for bass
    // For guitars, make the outer strings (1st and 6th) slightly thicker
    return index === 0 || index === totalStrings - 1 ? 1.5 : 1.2;
  };

  // Get fret line style
  const getFretStyle = (fretIndex: number) => {
    const isNut = fretIndex === 0; // Solo il capotasto
    
    if (isNut) {
      return {
        stroke: 'currentColor',
        strokeWidth: 4,
        strokeLinecap: 'square' as const,
        opacity: 1,
        filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))'
      };
    }
    return {
      stroke: 'currentColor',
      strokeWidth: 1.5,
      strokeLinecap: 'round' as const
    };
  };
  
  // Calculate fret number to display
  // Get the label for a specific string.
  // stringVisualIndex: 0 for leftmost string (e.g., Low E on guitar, which is string N)
  //                    N-1 for rightmost string (e.g., High E on guitar, which is string 1)
  const getStringLabel = (stringVisualIndex: number, totalStrings: number): string => {
    // For muted strings (X), always return X
    const stringIndex = totalStrings - 1 - stringVisualIndex;
    const labelFromNoteLabel = labels?.[stringIndex];
    if (labelFromNoteLabel === 'X') {
      return 'X';
    }

    // If it's a regular playing position (not an X), we need to look through the notes array
    // to find complementary information based on the labelType
    
    // Get complementary info based on labelType
    // If circles show finger numbers (labelType=finger), show tones at the bottom
    // If circles show tones (labelType=tone), show finger numbers at the bottom
    // If circles show intervals (labelType=interval), show tones at the bottom
    
    if (labelType === 'finger') {
      // If showing finger numbers in circles, complement with tones at bottom (if available)
      if (showStringNames && tuning && tuning.length === totalStrings) {
        return tuning[stringVisualIndex] || '';
      }
    } 
    else if (labelType === 'tone') {
      // If showing tones in circles, show finger numbers at bottom
      // Return the index+1 as a finger number for simplicity, if it's not a muted string
      if (labelFromNoteLabel && labelFromNoteLabel !== ' ') {
        return (stringIndex + 1).toString(); // Simple approximation
      }
    } 
    else if (labelType === 'interval') {
      // If showing intervals in circles, show tones at bottom if available
      if (showStringNames && tuning && tuning.length === totalStrings) {
        return tuning[stringVisualIndex] || '';
      }
    }

    // Default fallback if no complementary info available
    if (showStringNames && tuning && tuning.length === totalStrings) {
      return tuning[stringVisualIndex] || '';
    }
    return '';
  };

  return (
    <g className={`fretboard-base ${className}`}>
      {/* Strings */}
      {Array.from({ length: numStrings }).map((_, i) => {
        // i is the visual index from left (0) to right (numStrings - 1)
        // 0 = Low E string (string N), numStrings - 1 = High E string (string 1)
        const x = i * stringSpacing;
        
        let labelText = getStringLabel(i, numStrings); // Get label from props.labels or tuning
        labelText = labelText || ' '; // Ensure it's at least a space if empty string was returned

        const displayMutedX = labelText === 'X'; // If 'X' was passed in labels, treat as muted for display
        // Show label if showStringNames is true and there's content, OR if it's an X (muted marker)
        const shouldShowLabel = (showStringNames && !!labelText.trim()) || displayMutedX;
        
        return (
          <g key={`string-group-${i}`}>
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={paddedHeight}
              stroke="currentColor"
              strokeWidth={getStringThickness(i, numStrings)}
              strokeLinecap="round"
              className="text-gray-700 dark:text-gray-300"
            />
            
            {shouldShowLabel && (
              <text
                x={x}
                y={paddedHeight + 20} // Position below the fretboard
                textAnchor="middle"
                dominantBaseline="middle" // Better for vertical centering
                // Styling for labels (X for muted, or tuning notes)
                // labelType prop is still passed, can be used for more specific styling if needed
                className={`fill-current ${
                  displayMutedX
                    ? 'text-gray-500 dark:text-gray-400' // Style for 'X'
                    : (labelType === 'finger')
                        ? 'text-blue-600 dark:text-blue-400 font-semibold' // Style for theory labels when showing finger numbers in circles
                        : (labelType === 'tone')
                          ? 'text-gray-700 dark:text-gray-300' // Style for finger positions when showing tones in circles
                          : 'text-blue-600 dark:text-blue-400 font-semibold' // Style for theory labels when showing intervals in circles
                }`}
                style={{
                  fontSize: '14px', // Slightly smaller for string names/tuning
                  fontFamily: 'Arial, sans-serif',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {labelText}
              </text>
            )}
          </g>
        );
      })}

      {/* Frets */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => {
        const style = getFretStyle(i);
        return (
          <line
            key={`fret-${i}`}
            x1={0}
            y1={i * fretSpacing}
            x2={width}
            y2={i * fretSpacing}
            {...style}
          />
        );
      })}

      {/* Fret numbers (revised logic) */}
      {fretNumberPosition !== 'none' && ( // Outer check for position still valid
        (showFretNumbers || (startFret > 1)) ? ( // Only render if showFretNumbers is true OR (it's false AND startFret > 1)
          <g className="fret-numbers">
            {Array.from({ length: numFrets + 1 }).map((_, i) => {
              // i is the visual fret line index. 0 is the nut/top line.
              // Fret numbers are typically for the space *after* the line.
              // So, i=1 means the first fret space.
              if (i === 0) return null; // Never label the nut line itself.

              let fretLabelToShow: string | null = null;

              if (showFretNumbers) {
                // If showing all numbers, calculate based on startFret
                fretLabelToShow = (startFret + i - 1).toString();
              } else {
                // If showFretNumbers is false, only show startFret if startFret > 1 and it's the first fret position
                if (startFret > 1 && i === 1) {
                  fretLabelToShow = startFret.toString();
                  // Optional: add "fr." suffix, e.g., `${startFret}fr.`
                  // For now, just the number as per user's initial example.
                }
              }

              if (!fretLabelToShow) return null; // Don't render if no label determined for this fret index

              const y = (i - 0.5) * fretSpacing; // Position in the middle of the fret space
              const x = fretNumberPosition === 'left'
                ? -fretNumberSpacing + fretNumberOffset
                : width + fretNumberSpacing;

              return (
                <text
                  key={`fret-number-${i}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-current text-gray-700 dark:text-gray-300 font-medium"
                  style={{ fontSize: `${fontSize}px` }} // fontSize is already defined in the component
                >
                  {fretLabelToShow}
                </text>
              );
            })}
          </g>
        ) : null // If not showFretNumbers AND startFret is 1 (or less), render nothing
      )}

      {/* Nut (capotasto) solo se startFret === 1 */}
      {startFret === 1 && (
        <rect
          x={0}
          y={0}
          width={width}
          height={fretSpacing * 0.3}
          fill="currentColor"
          className="text-gray-700 dark:text-gray-300"
          opacity="0.5"
        />
      )}
      
      {/* Children elements (like NotesLayer) */}
      {children}
    </g>
  );
};

const MemoizedFretboardBase = React.memo(FretboardBase);
export { MemoizedFretboardBase as FretboardBase };
export default MemoizedFretboardBase;
