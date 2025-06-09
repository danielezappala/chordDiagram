import React, { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type FretNumberPosition = 'left' | 'right' | 'none';

interface FretboardBaseProps extends CSSProperties {
  children?: ReactNode;
  numStrings: number;
  numFrets: number;
  width: number;
  height: number;
  showFretNumbers?: boolean;
  fretNumberPosition?: FretNumberPosition;
  showStringNames?: boolean;
  className?: string;
  tuning?: string[];
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  labels?: (string | number | null)[]; // These are the noteLabels from ChordDiagram
  // Bottom labels display settings
  bottomLabels?: {
    showFingers?: boolean;
    showTones?: boolean;
    showIntervals?: boolean;
  };

  startFret?: number;
  theory?: {formula?: string, intervals?: string[], chordTones?: string[]};
  // Data needed for multiple bottom label rows
  positionNotes?: import('../types').PositionedNote[];
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


  bottomLabels = { showFingers: false, showTones: true, showIntervals: false },

  positionNotes = [],
  startFret = 1,
}) => {
  // Calculate dimensions with padding for labels
  // Bottom label row calculations - determine how many rows to show
  const bottomRowsCount = useMemo(() => {
    return [
      bottomLabels?.showFingers, 
      bottomLabels?.showTones, 
      bottomLabels?.showIntervals
    ].filter(Boolean).length;
  }, [bottomLabels]);

  // Calculate height needed for bottom labels
  const bottomLabelsHeight = useMemo(() => {
    return bottomRowsCount > 0 ? bottomRowsCount * 20 + 8 : 0; // 20px per row plus padding
  }, [bottomRowsCount]);

  // Allocate space for bottom labels
  const labelAreaHeight = bottomLabelsHeight > 0 ? bottomLabelsHeight : 30; // Minimum 30px even with no rows
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
  
  // Get information for multiple bottom label rows
  const getStringInfo = (stringVisualIndex: number, totalStrings: number) => {
    const stringIndex = totalStrings - 1 - stringVisualIndex;

    const note = positionNotes.find(n => n.position.string === stringIndex + 1);
    
    return {
      finger: note?.annotation?.finger ? String(note.annotation.finger) : '',
      tone: note?.annotation?.tone || '',
      interval: note?.annotation?.interval || '',
      tuningNote: (showStringNames && tuning && tuning.length === totalStrings) ? tuning[stringVisualIndex] || '' : '',
      isMuted: !note || note.position == null || note.position.fret == null, // General check if note data is valid
      isExplicitlyMuted: note ? (note.position.fret === -1 || note.annotation?.finger?.toString().toLowerCase() === 'x') : false // Specific check for muted strings (X or fret -1)
    };
  };

  return (
    <g className={`fretboard-base ${className}`}>
      {/* Strings */}
      {Array.from({ length: numStrings }).map((_, i) => {
        // i is the visual index from left (0) to right (numStrings - 1)
        // 0 = Low E string (string N), numStrings - 1 = High E string (string 1)
        const x = i * stringSpacing;

        
        // Get the position note data for this string (if it exists)

        
        // Check if string is muted

        // Draw the string line
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
            
            {/* --- PATCH: Dynamic bottom label rows --- */}
            {/* Calcola dinamicamente le righe da mostrare e la posizione verticale di ciascuna */}
            {(() => {
              // DEBUG LOG
              console.log('bottomLabels:', bottomLabels);
              console.log('positionNotes:', positionNotes);
              // Usa la prop bottomLabels per la sincronizzazione reale
              const bottomLabelRows: Array<{
                key: string;
                getValue: (info: ReturnType<typeof getStringInfo>) => string;
                colorClass: string;
              }> = [];
              if (bottomLabels.showFingers) {
                bottomLabelRows.push({
                  key: 'finger',
                  getValue: info => info.isExplicitlyMuted ? 'X' : (info.finger || ''),
                  colorClass: 'text-blue-600 font-medium'
                });
              }
              if (bottomLabels.showTones) {
                bottomLabelRows.push({
                  key: 'tone',
                  getValue: info => info.isExplicitlyMuted ? '' : (info.tone || info.tuningNote || ''),
                  colorClass: 'text-gray-900 font-semibold'
                });
              }
              if (bottomLabels.showIntervals) {
                bottomLabelRows.push({
                  key: 'interval',
                  getValue: info => info.isExplicitlyMuted ? '' : (info.interval || ''),
                  colorClass: 'text-purple-700 font-medium'
                });
              }
              return bottomLabelRows.map((row, rowIdx) => {
  // Determina la label a sinistra
  let leftLabel = '';
  if (row.key === 'finger') leftLabel = 'Fingers';
  if (row.key === 'tone') leftLabel = 'Tones';
  if (row.key === 'interval') leftLabel = 'Intervals';
  // Posizione label a sinistra
  const labelX = -80; // Allineato più a sinistra
  const y = paddedHeight + 16 + rowIdx * 24;
  return (
    <g key={`bottom-label-row-${row.key}`}>
      {/* Label a sinistra stile badge - Commentato per migliorare l'eleganza */}
      {/* <foreignObject
        x={labelX}
        y={y - 15}
        width={60}
        height={18}
        style={{overflow: 'visible'}}
      >
        <div
        >
          <div
            className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs font-semibold mr-2 align-middle select-none"
            style={{lineHeight: '16px', minWidth: '32px', textAlign: 'left'}}
          >
            {leftLabel}
          </div>
        </foreignObject>
      */}
      {/* Celle della riga */}
      {Array.from({ length: numStrings }, (_, j) => {
        const stringIndex = j;
        const stringX = j * stringSpacing;
        const info = getStringInfo(stringIndex, numStrings);
        const displayValue = row.getValue(info);
        return (
          <text
            key={`bottom-label-${row.key}-${j}`}
            x={stringX}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            className={info.isMuted ? 'text-gray-400' : row.colorClass}
          >
            {displayValue || ''}
          </text>
        );
      })}
    </g>
  );
});
            })()}
            {/* --- END PATCH --- */}
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
