import React from 'react';
import type { MouseEvent, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { Barre, PositionedNote } from '../types'; // Barre is v2. PositionedNote replaces ProcessedLayerNote.

interface NotesLayerProps {
  notes: PositionedNote[]; // Changed from ProcessedLayerNote[]
  barres?: Barre[];
  numStrings: number; // Should be required
  numFrets: number;   // Should be required
  width: number;      // Should be required
  height: number;     // Should be required
  startFret?: number;
  labelType?: 'none' | 'finger' | 'tone' | 'interval';
  labels?: (string | number | null)[]; // This is the noteLabels array from ChordDiagram
  onNoteClick?: (note: PositionedNote, event: MouseEvent<SVGGElement, globalThis.MouseEvent>) => void; // Changed, added event
  onBarreClick?: (barre: Barre, event: MouseEvent<SVGGElement, globalThis.MouseEvent>) => void; // Added event
  className?: string;
  style?: CSSProperties;
}

// Local defaults if numStrings/numFrets/width/height were not guaranteed
// const LOCAL_DEFAULT_NUM_STRINGS = 6;
// const LOCAL_DEFAULT_NUM_FRETS = 5;
// const LOCAL_DEFAULT_WIDTH = 200;
// const LOCAL_DEFAULT_HEIGHT = 250;

const NotesLayer: React.FC<NotesLayerProps> = (props) => {
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
  // Aumenta la larghezza dei tasti del 15%
  const fretSpacing = (paddedHeight / (numFrets + 1)) * 0.8;
  const noteRadius = Math.min(stringSpacing, fretSpacing) * 0.4;

  const handleNoteClick = (e: MouseEvent<SVGGElement, globalThis.MouseEvent>, note: PositionedNote) => {
    e.stopPropagation();
    onNoteClick?.(note, e); // Pass event
  };

  const handleBarreClick = (e: MouseEvent<SVGGElement, globalThis.MouseEvent>, barre: Barre) => {
    e.stopPropagation();
    onBarreClick?.(barre, e); // Pass event
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
  const getFretY = (fret: number): number => {
    // Per le corde a vuoto (fret === 0), posiziona il pallino sopra il capotasto
    if (fret === 0) return -fretSpacing * 0.75;

    // Per tasti premuti (fret > 0):
    // Posiziona il centro del pallino ben all'interno dello spazio del tasto,
    // lasciando un margine pari a noteRadius sia sopra che sotto.
    // Lo spazio del tasto va da (fret-1)*fretSpacing a fret*fretSpacing.
    // Il centro ideale è:
    //   y = (fret-1)*fretSpacing + noteRadius + (fretSpacing-2*noteRadius)/2
    //     = (fret-1)*fretSpacing + fretSpacing/2
    // (Se noteRadius è piccolo rispetto a fretSpacing, coincide col centro del tasto)
    let y = (fret - 1) * fretSpacing + noteRadius + (fretSpacing - 2 * noteRadius) / 2;

    // Se il diagramma parte da startFret > 1, correggi la posizione
    if (startFret > 1) {
      y -= (startFret - 1) * fretSpacing;
    }

    return y;
  };

  // console.log('Rendering barres:', barres); // Keep for debugging if necessary
  
  // Create a map of note positions for quick lookup (for animations)
  // This map should probably only contain non-muted notes that are rendered as circles.
  // const notePositions = React.useMemo(() => { // Removed as notePositions is unused
  //   const positions = new Map<string, {x: number, y: number}>();
  //   notes.forEach((note) => { // Removed index from forEach
  //     if (note.muted) return; // Don't include muted notes in animation map

  //     const x = getStringX(note.string);
  //     const y = note.fret === 0 ? -fretSpacing * 0.75 : getFretY(note.fret);
  //     // Use a unique key, e.g., combining string and original fret if available, or index.
  //     positions.set(`note-${note.string}-${note.fret_original_or_index}`, { x, y }); // Placeholder for key
  //   });
  //   return positions;
  // }, [notes, numStrings, startFret, fretSpacing, getStringX, getFretY]); // Added getFretY for exhaustive-deps if it were still used

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
        // Estendi la barra in modo che le curvature arrivino al centro dei pallini estremi
        const barreWidth = endX - startX + noteRadius * 2;
        const y = getFretY(barre.fret);
        
        return (
          <g key={`barre-${index}`}>
            <motion.rect
              x={startX - noteRadius}
              y={y - noteRadius}
              width={barreWidth}
              height={noteRadius * 2}
              rx={noteRadius}
              ry={noteRadius}
              fill="currentColor"
              className="cursor-pointer"
              whileHover={{ opacity: 0.8 }}
              onClick={(e: MouseEvent<SVGGElement, globalThis.MouseEvent>) => handleBarreClick(e, barre)}
            />
            {(() => {
              if (props.labelType === 'finger' && barre.finger) {
                // Comportamento attuale: mostra solo il dito centrato sulla barra
                return (
                  <text
                    x={(startX + endX) / 2}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={noteRadius * 1.2}
                    fontWeight="bold"
                    fill="#fff"
                    stroke="#222"
                    strokeWidth="1.2"
                    style={{ paintOrder: 'stroke', userSelect: 'none' }}
                  >
                    {barre.finger}
                  </text>
                );
              }
              if ((props.labelType === 'tone' || props.labelType === 'interval') && props.labels && props.notes) {
  // Per ogni corda sotto la barre, se c'è una nota suonata su questo fret, mostra il cerchio + label
  const labelsToShow = [];
  for (let string = startString; string <= endString; string++) {
    // Trova la nota corrispondente (PositionedNote) su questa corda e fret
    const note = props.notes.find(n => n.position.string === string && n.position.fret === barre.fret);
    if (note) {
      const x = getStringX(string);
      // La label da mostrare dipende dal tipo
      let label = null;
      if (props.labelType === 'tone') label = note.annotation?.tone;
      if (props.labelType === 'interval') label = note.annotation?.interval;
      if (label) {
        labelsToShow.push(
          <g key={`barre-label-${barre.fret}-${string}`}>
            {/* Cerchio nero sopra la barre, come per una nota normale */}
            <circle
              cx={x}
              cy={y}
              r={noteRadius * 1.0}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth={1}
            />
            {/* Lettera sopra il cerchio */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={noteRadius * 1.1}
              fontWeight="bold"
              fill="#fff"
              stroke="#222"
              strokeWidth="1.2"
              style={{ paintOrder: 'stroke', userSelect: 'none' }}
            >
              {label}
            </text>
          </g>
        );
      }
    }
  }
  return labelsToShow;
}
              // Se labelType è none o non ci sono label, non mostrare nulla
              return null;
            })()}

          </g>
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
      {notes.filter(note => !barres.some(b =>
        b.fret > 0 && // Barres are not on open strings
        note.position.fret === b.fret && // Note is on the same fret as the barre
        note.position.string >= b.fromString &&
        note.position.string <= b.toString
      )).map((note, index) => {
        const isMuted = note.position.fret === -1;
        // Render 'X' for muted strings
        if (isMuted) {
          const x = getStringX(note.position.string);
          const y = -fretSpacing * 0.75; // Position at the top of the neck (nut area)
          
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

        const isOpenString = note.position.fret === 0; // Not muted, fret is 0
        const x = getStringX(note.position.string);
        const y = isOpenString ? -fretSpacing * 0.75 : getFretY(note.position.fret);
        
        const noteCircleStyle = {
          fill: note.annotation?.highlight ? 'gold' : (isOpenString ? 'white' : 'currentColor'),
          stroke: 'currentColor',
          strokeWidth: isOpenString ? 1.5 : 1,
        };

        const noteCircle = (
          <circle
            cx={x}
            cy={y}
            r={noteRadius * 1.0}
            {...noteCircleStyle}
            key={`circle-${index}`}
          />
        );
        
        // Use the label text directly from props.labels (prepared by ChordDiagram)
        // This labelText is what appears *inside* the note circle.
        const labelText = props.labels?.[note.position.string - 1]?.toString() ?? '';
        const labelColor = isOpenString ? 'black' : 'white';
        // const labelColor = note.annotation?.highlight ? 'black' : (isOpenString ? 'black' : 'white');

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
            style={{ fontFamily: 'Arial, sans-serif', userSelect: 'none', pointerEvents: 'none' }}
          >
            {labelText}
          </text>
        ) : null;

        // Use index for animation key if notes array is stable, otherwise a unique ID from note if available.
        const animationKey = `note-${index}`;

        return (
          <motion.g 
            key={animationKey}
            className="cursor-pointer"
            onClick={(e: MouseEvent<SVGGElement, globalThis.MouseEvent>) => handleNoteClick(e, note)}
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

const MemoizedNotesLayer = React.memo(NotesLayer);
export { MemoizedNotesLayer as NotesLayer };
export default MemoizedNotesLayer;
