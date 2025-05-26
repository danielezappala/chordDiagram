import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChordDiagram } from '../ChordDiagram';

type NotePosition = {
  string: number;
  fret: number;
  label?: string;
  color?: string;
};

type EditorMode = 'select' | 'addNote' | 'addBarre' | 'delete';
type Barre = {
  fromString: number;
  toString: number;
  fret: number;
  color?: string;
};

type InteractiveChordEditorProps = {
  initialStrings?: number;
  initialFrets?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
};

export const InteractiveChordEditor: React.FC<InteractiveChordEditorProps> = ({
  initialStrings = 6,
  initialFrets = 5,
  width = 300,
  height = 350,
  className = '',
}) => {
  const [mode, setMode] = useState<EditorMode>('select');
  const [notes, setNotes] = useState<NotePosition[]>([]);
  const [barres, setBarres] = useState<Barre[]>([]);
  const [barreStart, setBarreStart] = useState<{ string: number; fret: number } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const stringSpacing = 100 / (initialStrings - 1);
  const fretSpacing = 100 / (initialFrets + 1);

  const findNoteAtPosition = useCallback(
    (string: number, fret: number) => {
      return notes.findIndex(
        (note) => note.string === string && note.fret === fret
      );
    },
    [notes]
  );

  const handleFretClick = (string: number, fret: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (mode === 'addNote') {
      // Check if note already exists
      const noteIndex = findNoteAtPosition(string, fret);
      
      if (noteIndex === -1) {
        // Add new note
        setNotes([...notes, { string, fret, label: '1' }]);
      }
    } else if (mode === 'delete') {
      // Delete note if it exists
      const noteIndex = findNoteAtPosition(string, fret);
      if (noteIndex !== -1) {
        setNotes(notes.filter((_, i) => i !== noteIndex));
      }
      
      // Also check for barres at this position
      const newBarres = barres.filter(
        (barre) => !(barre.fret === fret && string >= barre.toString && string <= barre.fromString)
      );
      
      if (newBarres.length !== barres.length) {
        setBarres(newBarres);
      }
    } else if (mode === 'addBarre') {
      if (barreStart) {
        // Complete barre selection
        const newBarre: Barre = {
          fromString: Math.max(barreStart.string, string),
          toString: Math.min(barreStart.string, string),
          fret: barreStart.fret,
          color: '#3b82f6', // blue-500
        };
        
        // Only add if it spans at least 2 strings
        if (newBarre.fromString !== newBarre.toString) {
          setBarres([...barres, newBarre]);
        }
        
        setBarreStart(null);
      } else {
        // Start barre selection
        setBarreStart({ string, fret });
      }
    }
  };

  const getFretPosition = (fret: number) => {
    return (fret - 0.5) * fretSpacing;
  };

  const getStringPosition = (string: number) => {
    return (initialStrings - string) * stringSpacing;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!(e.target as SVGSVGElement).classList.contains('fretboard')) return;
    
    const rect = (e.target as SVGSVGElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Find the closest string and fret
    const string = Math.round((initialStrings - 1) * (x / 100));
    const fret = Math.round(y / fretSpacing - 0.5);
    
    if (fret >= 0 && fret <= initialFrets && string >= 0 && string < initialStrings) {
      setTooltip({
        x: e.clientX + 10,
        y: e.clientY - 10,
        text: `String ${initialStrings - string}, Fret ${fret}`,
      });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded-md ${
            mode === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setMode('select')}
        >
          Select
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            mode === 'addNote' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setMode('addNote')}
        >
          Add Note
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            mode === 'addBarre' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setMode('addBarre')}
        >
          Add Barre
        </button>
        <button
          className={`px-3 py-1 rounded-md ${
            mode === 'delete' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
          onClick={() => setMode('delete')}
        >
          Delete
        </button>
      </div>

      <div 
        className="relative"
        style={{ width, height }}
        onMouseLeave={() => setTooltip(null)}
      >
        <ChordDiagram
          strings={initialStrings}
          frets={initialFrets}
          notes={notes}
          barres={barres}
          width="100%"
          height="100%"
        />
        
        {/* Interactive overlay */}
        <svg
          className="absolute inset-0 w-full h-full cursor-pointer fretboard"
          viewBox={`0 0 100 ${100}`}
          onClick={() => {
            // Handle clicks on empty space to clear barre selection
            if (mode === 'addBarre' && barreStart) {
              setBarreStart(null);
            }
          }}
          onMouseMove={handleMouseMove}
        >
          {Array.from({ length: initialStrings }).map((_, string) =>
            Array.from({ length: initialFrets }).map((_, fret) => (
              <rect
                key={`cell-${string}-${fret}`}
                x={string * stringSpacing - stringSpacing / 2}
                y={getFretPosition(fret + 1) - fretSpacing / 2}
                width={stringSpacing}
                height={fretSpacing}
                fill="transparent"
                onClick={(e) => handleFretClick(initialStrings - string - 1, fret + 1, e)}
                className="hover:fill-blue-200 hover:opacity-30 transition-colors"
              />
            ))
          )}
          
          {/* Visual feedback for barre selection */}
          {mode === 'addBarre' && barreStart && (
            <rect
              x={getStringPosition(barreStart.string) - stringSpacing / 2}
              y={getFretPosition(barreStart.fret) - 12}
              width={stringSpacing}
              height={24}
              rx={12}
              ry={12}
              fill="rgba(147, 51, 234, 0.3)" // purple-700 with opacity
              className="pointer-events-none"
            />
          )}
        </svg>
        
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none z-10"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
              }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {tooltip.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {mode === 'select' && 'Click and drag to select notes'}
        {mode === 'addNote' && 'Click on a fret to add a note'}
        {mode === 'addBarre' && (
          barreStart 
            ? 'Click on another string to complete the barre'
            : 'Click on a fret to start a barre'
        )}
        {mode === 'delete' && 'Click on a note or barre to delete it'}
      </div>
    </div>
  );
};

export default InteractiveChordEditor;
