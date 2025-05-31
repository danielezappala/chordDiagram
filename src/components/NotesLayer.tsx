import React from 'react';
import { motion } from 'framer-motion';
import type { Barre, FingerDesignator, Finger } from '../types'; // Barre is v2, Finger types are new

// Define the structure of the notes prop based on ChordDiagram's processedNotesForLayer
interface ProcessedLayerNote {
  string: number;
  fret: number;   // -1 means muted
  muted: boolean; // true if fret === -1
  finger: FingerDesignator | null;
  tone: string;
  interval: string;
  degree: string;
  highlight: boolean;
}

interface NotesLayerProps {
  notes: ProcessedLayerNote[];
  barres?: Barre[];
  numStrings: number; // Should be required
  numFrets: number;   // Should be required
  width: number;      // Should be required
  height: number;     // Should be required
  startFret?: number;
  labelType?: 'none' | 'finger' | 'tone' | 'interval' | 'degree'; // Added 'degree'
  labels?: (string | number | null)[]; // This is the noteLabels array from ChordDiagram
  onNoteClick?: (note: ProcessedLayerNote) => void;
  onBarreClick?: (barre: Barre) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Local defaults if numStrings/numFrets/width/height were not guaranteed
// const LOCAL_DEFAULT_NUM_STRINGS = 6;
// const LOCAL_DEFAULT_NUM_FRETS = 5;
// const LOCAL_DEFAULT_WIDTH = 200;
// const LOCAL_DEFAULT_HEIGHT = 250;

export const NotesLayer: React.FC<NotesLayerProps> = (props) => {
  const {
    notes = [],
    barres = [],
    numStrings, // Assuming ChordDiagram provides this (derivedNumStrings)
    numFrets,   // Assuming ChordDiagram provides this (actualNumFrets)
    width,      // Assuming ChordDiagram provides this (paddedWidth)
    height,     // Assuming ChordDiagram provides this (paddedHeight)
    startFret = 1,
    // labelType is used for note styling (open/closed circle color), not text selection here
    // labelType = 'finger',
    style,
    onNoteClick,
    onBarreClick,
    className = '',
  } = props;

  const labelAreaHeight = 30; // This should ideally be managed by a higher layout component or theme
  const paddedHeight = height - labelAreaHeight; // height here is paddedHeight from ChordDiagram
  
  const stringSpacing = numStrings > 1 ? width / (numStrings - 1) : width; // Avoid division by zero if numStrings is 1
  const fretSpacing = paddedHeight / (numFrets + 1);
  const noteRadius = Math.min(stringSpacing, fretSpacing) * 0.4;

  const handleNoteClick = (e: React.MouseEvent, note: ProcessedLayerNote) => {
    e.stopPropagation();
    onNoteClick?.(note);
  };

  const handleBarreClick = (e: React.MouseEvent, barre: Barre) => {
    e.stopPropagation();
    onBarreClick?.(barre);
  };

  // Calculate the x position for a given string number.
  // Convention: String 1 is the highest pitch (e.g., high E on a guitar) and is rendered on the right.
  // String N (where N is numStrings) is the lowest pitch and is rendered on the left.
  const getStringX = (stringNumber: number) => {
    // Convert from 1-based string number to 0-based index and reverse the order
    // For example, on a 6-string guitar:
    // String 1 (high E) becomes index 5 (numStrings - 1)
    // String 6 (low E) becomes index 0
    const stringIndex = numStrings - stringNumber; // This will reverse the order
    return stringIndex * stringSpacing;
  };
  
  // Calculate the y position for a given fret number
  const getFretY = (fret: number): number => { // fret is always number
    // For open strings (fret === 0)
    if (fret === 0) return -fretSpacing * 0.75; // Positioned higher
    
    // For fingered frets (fret > 0)
    const fretNum = fret;
    
    // Calculate the y position for a given fret number.
    // Notes are typically centered between fret lines.
    // The fret lines are at 0, fretSpacing, 2*fretSpacing, etc.
    // - For fretNum = 1 (first fret), the note is centered at 0.5 * fretSpacing.
    // - For fretNum = 2 (second fret), the note is centered at 1.5 * fretSpacing.
    // And so on. This is achieved by (fretNum - 0.5) * fretSpacing.
    let y = (fretNum - 0.5) * fretSpacing;
    
    // Adjust for startFret > 1.
    if (startFret > 1) {
      y -= (startFret - 1) * fretSpacing;
    }
    
    return y;
  };

  // console.log('Rendering barres:', barres); // Keep for debugging if necessary
  
  // Create a map of note positions for quick lookup (for animations)
  // This map should probably only contain non-muted notes that are rendered as circles.
  const notePositions = React.useMemo(() => {
    const positions = new Map<string, {x: number, y: number}>();
    notes.forEach((note, index) => {
      if (note.muted) return; // Don't include muted notes in animation map

      const x = getStringX(note.string);
      const y = note.fret === 0 ? -fretSpacing * 0.75 : getFretY(note.fret);
      // Use a unique key, e.g., combining string and original fret if available, or index.
      positions.set(`note-${note.string}-${note.fret_original_or_index}`, { x, y }); // Placeholder for key
    });
    return positions;
  }, [notes, numStrings, startFret, fretSpacing, getStringX]); // getFretY removed as it's stable if its inputs are stable

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
      {/* Corrected barre filtering logic: note.string should be between barre.fromString and barre.toString (inclusive)
          Assuming barre.fromString is the numerically smaller string number (e.g. 1 for High E)
          and barre.toString is the numerically larger string number (e.g. 6 for Low E) for a barre.
          The type definition for Barre: fromString (high E, e.g.1), toString (low E, e.g.6)
          So, fromString <= toString.
          A note is under barre if note.string >= barre.fromString AND note.string <= barre.toString.
       */}
      {notes.filter(note => !barres.some(barre =>
        barre.fret > 0 && // Barres are not on open strings
        note.fret === barre.fret && // Note is on the same fret as the barre
        note.string >= barre.fromString &&
        note.string <= barre.toString
      )).map((note, index) => {
        // Render 'X' for muted strings
        if (note.muted) {
          const x = getStringX(note.string);
          const y = -fretSpacing * 0.5; // Position at the top of the neck (nut area)
          
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
        // Legacy note.fret === 'x' block removed as note.muted handles this.

        const isOpenString = note.fret === 0; // Not muted, fret is 0
        const x = getStringX(note.string);
        const y = isOpenString ? -fretSpacing * 0.75 : getFretY(note.fret);
        
        const noteCircleStyle = {
          fill: note.highlight ? 'gold' : (isOpenString ? 'white' : 'currentColor'), // Example highlight
          stroke: 'currentColor',
          strokeWidth: isOpenString ? 1.5 : 1,
        };

        const noteCircle = (
          <circle
            cx={x}
            cy={y}
            r={noteRadius * 1.0}
            {...noteCircleStyle}
            key={`circle-${index}`} // Consider a more stable key if possible
          />
        );
        
        // Use the label text directly from props.labels (prepared by ChordDiagram)
        const labelText = props.labels?.[note.string - 1]?.toString() ?? '';
        const labelColor = isOpenString ? 'black' : 'white';
        // If note.highlight, labelColor could also change, e.g., to black if on gold.
        // const labelColor = note.highlight ? 'black' : (isOpenString ? 'black' : 'white');


        const noteLabel = labelText ? (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={labelColor}
            fontSize={noteRadius * 1.2}
            fontWeight="bold"
            className="pointer-events-none select-none" // Keep class for potential global styling
            key={`label-${index}`} // Consider a more stable key
            style={{ fontFamily: 'Arial, sans-serif', userSelect: 'none', pointerEvents: 'none' }}
          >
            {labelText}
          </text>
        ) : null;

        // Key for motion.g needs to be stable. Using string and original fret/index.
        // The note object itself might be stable if it's from a useMemo in parent.
        const animationKey = `note-${note.string}-${note.fret_original_or_index_placeholder}`;


        return (
          <motion.g 
            key={animationKey} // Use a stable key
            className="cursor-pointer"
            onClick={(e) => handleNoteClick(e, note)}
            // Animation logic might need adjustment if notePositions map keys changed significantly
            // For now, assume notePositions map is keyed in a way that can be retrieved.
            // The example key for notePositions was: `note-${note.string}-${note.fret_original_or_index}`
            // If that's the case, we need to reconstruct that key here or pass a unique ID on the note object.
            // For simplicity, if notePositions map is just for initial render positions,
            // and notes array order is stable, index-based key might work for retrieval.
            // However, the `notePositions.get(`note-${index}`)` in the original implies index-based.
            // Let's try to keep that if `notes` array itself is stable in order for non-muted.
            initial={{ opacity: 0, scale: 0.5 }} // Example initial animation
            animate={{
              opacity: 1,
              scale: 1,
              // x: getStringX(note.string) - (notePositions.get(`note-${index}`)?.x || getStringX(note.string)),
              // y: (isOpenString ? -fretSpacing * 0.75 : getFretY(note.fret)) - (notePositions.get(`note-${index}`)?.y || (isOpenString ? -fretSpacing * 0.75 : getFretY(note.fret)))
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.02 }}
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
