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
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  labels?: (string | number | null)[];
  theory?: {
    tones?: (string | null)[];
    intervals?: (string | null)[];
  };
  startFret?: number;
}

export const FretboardBase: React.FC<FretboardBaseProps> = ({
  children,
  numStrings,
  numFrets,
  width,
  height,
  showFretNumbers = true,
  fretNumberPosition = 'left',
  showStringNames = true,
  className = '',
  tuning,
  labelType = 'finger',
  labels = [],
  theory,
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
  const getFretNumber = (fretIndex: number): string => {
    if (!showFretNumbers) return '';
    if (fretIndex === 0) return ''; // Skip nut
    return (startFret + fretIndex - 1).toString();
  };

  // Get the label for a specific string based on labelType
  const getStringLabel = (index: number, totalStrings: number) => {
    if (labels && index >= 0 && index < labels.length) {
      return String(labels[labels.length - 1 - index] || '');
    }
    if (tuning && tuning.length === totalStrings) {
      return tuning[totalStrings - 1 - index];
    }
    return '';
  };

  return (
    <g className={`fretboard-base ${className}`}>
      {/* Strings */}
      {Array.from({ length: numStrings }).map((_, i) => {
        const stringNumber = i + 1;
        const x = i * stringSpacing;
        const noteForString = labels[i];
        const isMuted = noteForString === 'x' || noteForString === 'X';
        
        let labelText = '';
        if (isMuted) {
          labelText = 'X';
        } else {
          const mutedStringsBefore = labels.slice(0, i).filter(n => n === 'x' || n === 'X').length;
          const noteIndex = i - mutedStringsBefore;
          
          if (labelType === 'tone') {
            labelText = (theory?.intervals?.[noteIndex] || '') as string;
          } else if (['interval', 'finger', 'none'].includes(labelType)) {
            labelText = (theory?.tones?.[noteIndex] || '') as string;
          } else {
            labelText = getStringLabel(i, numStrings);
          }
        }
        
        const shouldShowLabel = (!!labelText && !isMuted) || isMuted;
        
        return (
          <g key={`string-${stringNumber}`}>
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
                y={paddedHeight + 20}
                textAnchor="middle"
                className={`fill-current ${
                  labelType === 'finger' 
                    ? 'text-gray-600 dark:text-gray-300' 
                    : 'text-blue-600 dark:text-blue-400 font-bold'
                }`}
                style={{
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  fontWeight: labelType === 'tone' || labelType === 'interval' ? 'bold' : 'normal'
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

      {/* Fret numbers */}
      {showFretNumbers && fretNumberPosition !== 'none' && (
        <g className="fret-numbers">
          {Array.from({ length: numFrets + 1 }).map((_, i) => {
            if (i === 0) return null;
            const fretNumber = getFretNumber(i);
            if (!fretNumber) return null;
            
            const y = (i - 0.5) * fretSpacing;
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
                style={{ fontSize: `${fontSize}px` }}
              >
                {fretNumber}
              </text>
            );
          })}
        </g>
      )}

      {/* Nut */}
      <rect
        x={0}
        y={0}
        width={width}
        height={fretSpacing * 0.3}
        fill="currentColor"
        className="text-gray-700 dark:text-gray-300"
        opacity="0.5"
      />
      
      {/* Children elements (like NotesLayer) */}
      {children}
    </g>
  );
};

export default FretboardBase;
