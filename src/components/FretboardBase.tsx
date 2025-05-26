import React from 'react';
import { DEFAULT_NUM_FRETS, DEFAULT_NUM_STRINGS } from '../types';

interface FretboardBaseProps {
  numStrings: number;
  numFrets: number;
  width: number;
  height: number;
  showFretNumbers?: boolean;
  showStringNames?: boolean;
  className?: string;
  tuning?: string[];
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  labels?: (string | number | null)[];
  theory?: {
    tones?: (string | null)[];
    intervals?: (string | null)[];
  };
}

export const FretboardBase: React.FC<FretboardBaseProps> = ({
  numStrings,
  numFrets,
  width,
  height,
  showFretNumbers = true,
  showStringNames = true,
  className = '',
  tuning,
  labelType = 'finger',
  labels = [],
  theory,
}) => {
  // Calculate dimensions with padding for labels
  const labelAreaHeight = 30; // Extra space for labels at the bottom
  const paddedHeight = height - labelAreaHeight;
  
  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = paddedHeight / (numFrets + 1); // +1 for the nut area

  // Calculate string thickness based on the number of strings
  const getStringThickness = (index: number, totalStrings: number) => {
    if (totalStrings <= 4) return 1.5; // Thicker strings for bass
    // For guitars, make the outer strings (1st and 6th) slightly thicker
    return index === 0 || index === totalStrings - 1 ? 1.5 : 1.2;
  };

  // Get fret line style
  const getFretStyle = (index: number): React.SVGProps<SVGLineElement> => {
    if (index === 0) {
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

  // Get the label for a specific string based on labelType
  const getStringLabel = (index: number, totalStrings: number) => {
    // If we have labels and the index is valid, return the corresponding label
    if (labels && index >= 0 && index < labels.length) {
      return String(labels[labels.length - 1 - index] || ''); // Invert the order to show lowest string at bottom
    }
    
    // Fallback to tuning if no labels are available
    if (tuning && tuning.length === totalStrings) {
      return tuning[totalStrings - 1 - index];
    }
    
    // Default to empty string if no tuning is provided
    return '';
  };

  // Debug logs
  console.log('FretboardBase - labelType:', labelType);
  console.log('FretboardBase - theory:', theory);
  console.log('FretboardBase - labels:', labels);
  console.log('FretboardBase - showStringNames:', showStringNames);
  
  return (
    <g className={`fretboard-base ${className}`}>
      {/* Strings - String 1 (highest pitch) at the top */}
      {/* Mappatura delle corde per gestire correttamente le corde mute */}
      {Array.from({ length: numStrings }).map((_, i) => {
        const stringNumber = i + 1;
        const x = i * stringSpacing;
        
        // Ottieni la nota per questa corda
        const noteForString = labels[i];
        const isMuted = noteForString === 'x' || noteForString === 'X';
        
        // Determina il testo da mostrare in base al tipo di etichetta
        let labelText = '';
        
        if (isMuted) {
          // Per le corde mute, mostra 'X' indipendentemente dal labelType
          labelText = 'X';
        } else {
          // Conta quante corde mute ci sono prima di questa corda
          const mutedStringsBefore = labels.slice(0, i).filter(n => n === 'x' || n === 'X').length;
          // Calcola l'indice corretto per le note, saltando le corde mute
          const noteIndex = i - mutedStringsBefore;
          
          if (labelType === 'tone') {
            // Per 'tone', mostra gli intervalli
            labelText = (theory?.intervals?.[noteIndex] || '') as string;
          } else if (labelType === 'interval' || labelType === 'finger' || labelType === 'none') {
            // Per 'interval', 'finger' e 'none', mostra le note
            labelText = (theory?.tones?.[noteIndex] || '') as string;
          } else {
            // Default: mostra l'etichetta della corda (accordatura)
            labelText = getStringLabel(i, numStrings);
          }
        }
        
        // Mostra l'etichetta se abbiamo del testo da mostrare e non è una corda muta
        // oppure se è una corda muta e vogliamo mostrare le mute
        const shouldShowLabel = (!!labelText && !isMuted) || isMuted;
        
        return (
          <g key={`string-${stringNumber}`}>
            {/* String line */}
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
            
            {/* String label */}
            {shouldShowLabel && (
              <text
                x={x} // Spostamento di 10px a destra
                y={paddedHeight + 20} // Position below the fretboard
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
      
      {/* Add a subtle gradient under the nut for better visibility */}
      <defs>
        <linearGradient id="nutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width={width}
        height={fretSpacing * 0.3}
        fill="url(#nutGradient)"
        opacity="0.5"
      />
    </g>
  );
};

export default FretboardBase;
