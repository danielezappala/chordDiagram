import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ChordNote, Barre } from '../types';
import { DEFAULT_NUM_STRINGS, DEFAULT_NUM_FRETS } from '../types';
import ChordDiagram from './ChordDiagram';

interface InteractiveChordEditorProps {
  initialData: {
    name?: string;
    notes: ChordNote[];
    barres: Barre[];
    tones?: string[];
    intervals?: string[];
  };
  className?: string;
  onChordChange?: (data: { notes: ChordNote[]; barres: Barre[] }) => void;
}

export function InteractiveChordEditor({
  initialData,
  className = '',
  onChordChange,
}: InteractiveChordEditorProps) {
  const [notes, setNotes] = useState<ChordNote[]>(initialData.notes || []);
  const [barres, setBarres] = useState<Barre[]>(initialData.barres || []);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Handle note click (toggle note on/off)
  const handleNoteClick = useCallback((note: { string: number; fret: number | 'x' }) => {
    setNotes(prevNotes => {
      const existingNoteIndex = prevNotes.findIndex(
        n => n.string === note.string && n.fret === note.fret
      );
      
      let newNotes;
      if (existingNoteIndex >= 0) {
        // Remove note
        newNotes = [
          ...prevNotes.slice(0, existingNoteIndex),
          ...prevNotes.slice(existingNoteIndex + 1)
        ];
      } else {
        // Add note
        newNotes = [...prevNotes, { ...note, interval: '' }];
      }
      
      onChordChange?.({ notes: newNotes, barres });
      return newNotes;
    });
  }, [barres, onChordChange]);
  
  // Handle barre click (toggle barre on/off)
  const handleBarreClick = useCallback((barre: { fromString: number; toString: number; fret: number }) => {
    setBarres(prevBarres => {
      const existingBarreIndex = prevBarres.findIndex(
        b => b.fromString === barre.fromString && b.toString === barre.toString && b.fret === barre.fret
      );
      
      let newBarres;
      if (existingBarreIndex >= 0) {
        // Remove barre
        newBarres = [
          ...prevBarres.slice(0, existingBarreIndex),
          ...prevBarres.slice(existingBarreIndex + 1)
        ];
      } else {
        // Add barre
        newBarres = [...prevBarres, { ...barre }];
      }
      
      onChordChange?.({ notes, barres: newBarres });
      return newBarres;
    });
  }, [notes, onChordChange]);

  // Ensure we have the required data structure
  const chordData = useMemo(() => ({
    name: initialData.name || 'Custom Chord',
    notes: notes,
    barres: barres,
    tones: initialData.tones || [],
    intervals: initialData.intervals || [],
  }), [initialData, notes, barres]);

  // Update internal state when initialData changes
  useEffect(() => {
    if (initialData.notes) setNotes(initialData.notes);
    if (initialData.barres) setBarres(initialData.barres);
  }, [initialData]);

  // Reset to initial data
  const reset = useCallback(() => {
    setNotes(initialData.notes || []);
    setBarres(initialData.barres || []);
    onChordChange?.({ notes: initialData.notes || [], barres: initialData.barres || [] });
  }, [initialData, onChordChange]);

  // Get note position from mouse coordinates
  const getNotePosition = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return null;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = clientX - svgRect.left;
    const y = clientY - svgRect.top;
    
    const stringSpacing = svgRect.width / (DEFAULT_NUM_STRINGS - 1);
    const fretSpacing = svgRect.height / (DEFAULT_NUM_FRETS + 1);
    
    // Find the closest string and fret
    let string = Math.round(x / stringSpacing) + 1;
    let fret = Math.round(y / fretSpacing);
    
    // Clamp values to valid ranges
    string = Math.max(1, Math.min(string, DEFAULT_NUM_STRINGS));
    fret = Math.max(0, Math.min(fret, DEFAULT_NUM_FRETS));
    
    return { string, fret };
  }, []);

  // Handle pointer events for interactions
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const position = getNotePosition(e.clientX, e.clientY);
    if (!position) return;
    
    const { string, fret } = position;
    handleNoteClick({ string, fret });
  }, [getNotePosition, handleNoteClick]);

  return (
    <div 
      className={`interactive-chord-editor ${className}`}
      onPointerDown={handlePointerDown}
    >
      <div className="mb-4">
        <ChordDiagram
          data={chordData}
          width={300}
          height={400}
          showLabels={true}
          showInfo={true}
          ref={svgRef}
          onNoteClick={handleNoteClick}
          onBarreClick={handleBarreClick}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Export the props type for external use
export type { InteractiveChordEditorProps };
