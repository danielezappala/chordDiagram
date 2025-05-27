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
  startFret?: number;
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  labels?: (string | number | null)[];
  onNoteClick?: (note: NotePosition) => void;
  onBarreClick?: (barre: Barre) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const NotesLayer: React.FC<NotesLayerProps> = (props) => {
  const {
    notes = [],
    barres = [],
    numStrings = DEFAULT_NUM_STRINGS,
    numFrets = DEFAULT_NUM_FRETS,
    width = 200,
    height = 300,
    startFret = 1,
    labelType = 'finger',
    style,
    onNoteClick,
    onBarreClick,
    className = '',
  } = props;

  const labelAreaHeight = 30; // Deve corrispondere al valore in FretboardBase
  const paddedHeight = height - labelAreaHeight;
  
  const stringSpacing = width / (numStrings - 1);
  // Allineato con il calcolo in FretboardBase
  // La spaziatura tra i tasti è calcolata dividendo l'altezza (esclusa l'area delle etichette) per (numFrets + 1)
  // per tenere conto dello spazio per il capotasto
  const fretSpacing = paddedHeight / (numFrets + 1);
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
  
  // Calculate the y position for a given fret number
  const getFretY = (fret: number | 'x'): number => {
    // For open strings or muted strings
    if (fret === 'x' || fret === 0) return -fretSpacing * 0.75; // Spostato più in alto per evitare sovrapposizione
    
    // Convert fret to number if it's a string
    const fretNum = typeof fret === 'number' ? fret : parseInt(fret, 10);
    
    // Calcola la posizione Y del tasto
    // I tasti sono posizionati a: 0, fretSpacing, 2*fretSpacing, 3*fretSpacing, ...
    // I pallini devono essere centrati tra i tasti, quindi:
    // - Per il primo tasto (fretNum = 1): y = (1 - 0.5) * fretSpacing = 0.5 * fretSpacing
    // - Per il secondo tasto (fretNum = 2): y = (2 - 0.5) * fretSpacing = 1.5 * fretSpacing
    // E così via...
    let y = (fretNum - 0.5) * fretSpacing;
    
    // Adjust for startFret > 1
    if (startFret > 1) {
      // Sottraiamo (startFret - 1) * fretSpacing per spostare l'inizio della tastiera
      y -= (startFret - 1) * fretSpacing;
    }
    
    // Note sono già centrate tra i tasti, nessun aggiustamento necessario
    
    return y;
  };

  // Debug: log dei barrè
  console.log('Rendering barres:', barres);
  
  // Create a map of note positions for quick lookup
  const notePositions = React.useMemo(() => {
    const positions = new Map<string, {x: number, y: number}>();
    
    notes.forEach((note, index) => {
      const x = getStringX(note.string);
      // For open strings, position at 1/4 of the first fret spacing
      const y = note.fret === 0 ? -fretSpacing * 0.75 : getFretY(note.fret);
      positions.set(`note-${index}`, { x, y });
    });
    
    return positions;
  }, [notes, numStrings, startFret, fretSpacing, getStringX, getFretY]);

  return (
    <g 
      className={`notes-layer ${className}`}
      style={style}
    >
      {/* Render barres first so they appear behind notes */}
      {barres.map((barre, index) => {
        if (barre.fret === 0) return null; // Skip barres at fret 0 (open strings)
        console.log(`Rendering barre ${index}:`, barre);
        
        
        // Ensure fromString is always less than toString for consistency
        const startString = Math.min(barre.fromString, barre.toString);
        const endString = Math.max(barre.fromString, barre.toString);
        
        // Get the x positions of the start and end strings
        const startX = getStringX(endString); // Use endString first since strings are right-to-left
        const endX = getStringX(startString);
        
        // Calculate width based on the actual x positions
        const barreWidth = endX - startX;
        const y = getFretY(barre.fret);
        
        return (
          <motion.rect
            key={`barre-${index}`}
            x={startX}
            y={y - noteRadius * 0.5}
            width={barreWidth}
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
        const y = isOpenString ? -fretSpacing * 0.75 : getFretY(note.fret); // Spostato più in alto per le corde a vuoto
        
        // First, render the note circle
        const noteCircle = isOpenString ? (
          // Open string (fret 0) - Single white circle with black border
          <circle
            cx={x}
            cy={y}
            r={noteRadius * 1.0}
            fill="white"
            stroke="currentColor"
            strokeWidth={1.5}
            key={`circle-${index}`}
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
            key={`circle-${index}`}
          />
        );

        // Then, render the label (finger, note, or interval)
        let labelText = '';
        let labelColor = isOpenString ? 'black' : 'white';
        
        // Determine what to show based on labelType
        if (labelType === 'finger' && note.finger !== undefined && note.finger !== null) {
          labelText = note.finger.toString();
        } else if (labelType === 'tone' && note.tone) {
          labelText = note.tone;
        } else if (labelType === 'interval' && note.interval) {
          labelText = note.interval;
          console.log(`Rendering interval ${labelText} for string ${note.string}`);
        } else if (props.labels && props.labels[note.string - 1] !== undefined && props.labels[note.string - 1] !== ' ') {
          // Fallback to provided labels if available, using string position (1-based)
          labelText = String(props.labels[note.string - 1]);
        }

        const noteLabel = labelText ? (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={labelColor}
            fontSize={noteRadius * 1.2}
            fontWeight="bold"
            className="pointer-events-none select-none"
            key={`label-${index}`}
            style={{
              fontFamily: 'Arial, sans-serif',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {labelText}
          </text>
        ) : null;

        return (
          <motion.g 
            key={`note-${index}`}
            className="cursor-pointer"
            onClick={(e) => handleNoteClick(e, note)}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: getStringX(note.string) - (notePositions.get(`note-${index}`)?.x || 0),
              y: (note.fret === 0 ? -fretSpacing * 0.5 : getFretY(note.fret)) - (notePositions.get(`note-${index}`)?.y || 0)
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            {noteCircle}
            {noteLabel}
          </motion.g>
        );
      })}
    </g>
  );
};

export default NotesLayer;
