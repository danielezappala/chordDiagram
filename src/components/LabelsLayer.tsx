import React from 'react';
import type { NotePosition } from '../types';

interface LabelsLayerProps {
  width: number;
  height: number;
  numStrings: number;
  numFrets: number;
  notes: NotePosition[];
  labels: (string | number | null)[];
  className?: string;
}

export const LabelsLayer: React.FC<LabelsLayerProps> = ({
  notes,
  labels,
  numStrings,
  numFrets,
  width,
  height,
  className = '',
}) => {
  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = height / (numFrets + 1);
  const noteRadius = Math.min(stringSpacing, fretSpacing) * 0.4;
  
  // Stili di testo costanti per tutte le etichette
  const textStyle = {
    fontSize: `${noteRadius * 1.2}px`, // Stessa dimensione della 'X' delle corde mute
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold' as const,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
  };

  // Don't render if no labels provided
  if (!labels.length) return null;

  // Calculate the x position for a given string number (1-based, with 1 being the highest string)
  const getStringX = (stringNumber: number) => {
    // Convert from 1-based string number to 0-based index and reverse the order
    const stringIndex = numStrings - stringNumber;
    return stringIndex * stringSpacing;
  };
  
  return (
    <g className={`labels-layer ${className}`}>
      {notes.map((note, index) => {
        // Always show 'X' for muted strings

        
        // Skip if no label for this note or label is null/undefined/empty string
        if (index >= labels.length || !labels[index] && labels[index] !== 0) {
          return null;
        }
        
        const isOpenString = note.fret === 0;
        const y = isOpenString ? -fretSpacing * 0.5 : (note.fret - 0.5) * fretSpacing;
        const x = getStringX(note.string);
        
        // Determina il colore del testo in base al tipo di nota (aperta o chiusa)
        const textColor = isOpenString ? 'black' : 'white';
        
        return (
          <g key={`label-${index}`}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={textColor}
              style={{
                ...textStyle,
                paintOrder: 'stroke',
                stroke: textColor === 'white' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                strokeWidth: '2px',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              }}
            >
              {String(labels[index])}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default LabelsLayer;
