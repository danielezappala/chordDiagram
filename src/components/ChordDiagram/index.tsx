import React from 'react';
import { motion } from 'framer-motion';

export type NotePosition = {
  string: number;
  fret: number | 'x';
  label?: string;
  interval?: string;
  color?: string;
};

export type BarrePosition = {
  fromString: number;
  toString: number;
  fret: number;
  label?: string;
  color?: string;
};

type ChordDiagramProps = {
  strings?: number;
  frets?: number;
  startFret?: number;
  notes?: NotePosition[];
  barres?: BarrePosition[];
  width?: number | string;
  height?: number | string;
  className?: string;
  onNoteClick?: (note: NotePosition) => void;
  onBarreClick?: (barre: BarrePosition) => void;
};

export const ChordDiagram: React.FC<ChordDiagramProps> = ({
  strings = 6,
  frets = 5,
  startFret = 0,
  notes = [],
  barres = [],
  width = 200,
  height = 250,
  className = '',
}) => {
  const stringSpacing = 100 / (strings - 1);
  const fretSpacing = 100 / (frets + 1);

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg 
        viewBox={`0 0 100 ${100 + fretSpacing * startFret}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fretboard */}
        <g className="stroke-current text-gray-700 dark:text-gray-300">
          {/* Strings */}
          {Array.from({ length: strings }).map((_, i) => (
            <line
              key={`string-${i}`}
              x1={i * stringSpacing}
              y1={fretSpacing * startFret}
              x2={i * stringSpacing}
              y2="100"
              strokeWidth={i === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          ))}

          {/* Frets */}
          {Array.from({ length: frets + 1 }).map((_, i) => (
            <line
              key={`fret-${i}`}
              x1="0"
              y1={fretSpacing * i + fretSpacing * startFret}
              x2="100"
              y2={fretSpacing * i + fretSpacing * startFret}
              strokeWidth={i === 0 ? 4 : 2}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Barres */}
        {barres.map((barre, i) => {
          const y = (barre.fret - 0.5) * fretSpacing + fretSpacing * startFret;
          const x1 = (strings - barre.fromString) * stringSpacing;
          const x2 = (strings - barre.toString) * stringSpacing;
          
          return (
            <motion.rect
              key={`barre-${i}`}
              x={Math.min(x1, x2)}
              y={y - 12}
              width={Math.abs(x2 - x1)}
              height={24}
              rx={12}
              ry={12}
              fill={barre.color || 'currentColor'}
              className="text-gray-700 dark:text-gray-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.1 }}
            />
          );
        })}

        {/* Notes */}
        {notes.map((note, i) => {
          // Skip rendering if fret is 'x' (muted string)
          if (note.fret === 'x') return null;
          
          const x = (strings - note.string) * stringSpacing;
          const y = (note.fret - 0.5) * fretSpacing + fretSpacing * startFret;
          
          return (
            <motion.g
              key={`note-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: 'spring',
                damping: 10,
                stiffness: 100,
                delay: 0.1 * i
              }}
            >
              <circle
                cx={x}
                cy={y}
                r="12"
                fill={note.color || 'currentColor'}
                className="text-gray-800 dark:text-white"
              />
              {note.label && (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-current text-white"
                >
                  {note.label}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
};

export default ChordDiagram;
