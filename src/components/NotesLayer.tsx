import React from 'react';
import { motion } from 'framer-motion';
import type { NotePosition, Barre } from '../types';
import { DEFAULT_NUM_STRINGS, DEFAULT_NUM_FRETS } from '../types';

interface NotesLayerProps {
  notes: NotePosition[];
  barres?: Barre[];
  numStrings?: number;
  numFrets?: number;
  width?: number;
  height?: number;
  onNoteClick?: (note: NotePosition) => void;
  onBarreClick?: (barre: Barre) => void;
  className?: string;
}

export const NotesLayer: React.FC<NotesLayerProps> = ({
  notes = [],
  barres = [],
  numStrings = DEFAULT_NUM_STRINGS,
  numFrets = DEFAULT_NUM_FRETS,
  width = 200,
  height = 300,
  onNoteClick,
  onBarreClick,
  className = '',
}) => {
  const stringSpacing = width / (numStrings - 1);
  const fretSpacing = height / (numFrets + 1);
  const noteRadius = Math.min(stringSpacing, fretSpacing) * 0.4;

  const handleNoteClick = (e: React.MouseEvent, note: NotePosition) => {
    e.stopPropagation();
    onNoteClick?.(note);
  };

  const handleBarreClick = (e: React.MouseEvent, barre: Barre) => {
    e.stopPropagation();
    onBarreClick?.(barre);
  };

  // Calculate the x position for a given string number (1-based, with 1 being the highest string)
  const getStringX = (stringNumber: number) => {
    // Convert from 1-based string number to 0-based index and reverse the order
    const stringIndex = numStrings - stringNumber; // This will reverse the order
    return stringIndex * stringSpacing;
  };

  return (
    <g className={`notes-layer ${className}`}>
      {/* Barres */}
      {barres.map((barre, index) => {
        if (barre.fret === 0) return null; // Skip barres at fret 0 (open strings)
        
        const startX = getStringX(barre.toString);
        const y = (barre.fret - 0.5) * fretSpacing;
        
        // Calculate width based on number of strings spanned
        const numStringsSpanned = barre.fromString - barre.toString + 1;
        const barreWidth = (numStringsSpanned - 1) * stringSpacing;
        
        return (
          <motion.rect
            key={`barre-${index}`}
            x={startX - noteRadius * 1.5}
            y={y - noteRadius * 0.5}
            width={barreWidth + noteRadius * 3}
            height={noteRadius}
            rx={noteRadius * 0.5}
            ry={noteRadius * 0.5}
            fill="currentColor"
            className="cursor-pointer"
            whileHover={{ opacity: 0.8 }}
            onClick={(e) => handleBarreClick(e, barre)}
          />
        );
      })}

      {/* Notes - First render notes without barres */}
      {notes.filter(note => !barres.some(barre => {
        const noteFret = typeof note.fret === 'string' ? parseInt(note.fret, 10) : note.fret;
        return barre.fret > 0 && 
          note.string >= barre.toString && 
          note.string <= barre.fromString &&
          noteFret === barre.fret;
      })).map((note, index) => {
        // Always show 'X' for muted strings
        if (note.muted) {
          const x = getStringX(note.string);
          const y = -fretSpacing * 0.5; // Position at the top of the neck
          
          return (
            <g key={`muted-${index}`}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={noteRadius * 1.4}
                fill="currentColor"
                fontWeight="bold"
                style={{
                  pointerEvents: 'none',
                  userSelect: 'none',
                  fontFamily: 'Arial, sans-serif',
                  opacity: 0.8
                }}
              >
                X
              </text>
            </g>
          );
        }
        
        if (note.fret === 'x') {
          // Muted string (legacy format)
          return (
            <g key={`muted-${index}`}>
              <line
                x1={getStringX(note.string) - noteRadius}
                y1={-noteRadius}
                x2={getStringX(note.string) + noteRadius}
                y2={noteRadius}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
              <line
                x1={getStringX(note.string) - noteRadius}
                y1={noteRadius}
                x2={getStringX(note.string) + noteRadius}
                y2={-noteRadius}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </g>
          );
        }

        const isOpenString = note.fret === 0;
        const x = getStringX(note.string);
        const y = isOpenString ? -fretSpacing * 0.5 : (note.fret - 0.5) * fretSpacing;
        
        return (
          <g key={`note-${index}`}>
            <motion.g
              className="cursor-pointer"
              onClick={(e) => handleNoteClick(e, note)}
            >
              {isOpenString ? (
                // Open string (fret 0) - Single white circle with black border (same size as black dots)
                <circle
                  cx={x}
                  cy={y}
                  r={noteRadius * 1.0}
                  fill="white"
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
              ) : (
                // Fingered note - Single black circle
                <circle
                  cx={x}
                  cy={y}
                  r={noteRadius * 1.0}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={1}
                />
              )}
            </motion.g>
            {note.finger && (
              <text
                x={x}
                y={y + noteRadius * 0.35}
                textAnchor="middle"
                fill={isOpenString ? "black" : "white"}
                fontSize={noteRadius * 1.2}
                className="pointer-events-none select-none font-medium"
              >
                {note.finger}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default NotesLayer;
