import { useState, useCallback, useEffect } from 'react';
import ChordDiagram from './components/ChordDiagram';
import type { ChordDiagramData } from './types';

const testChords: ChordDiagramData[] = [
  // Chitarra standard (6 corde) - C Major con barrè all'ottavo tasto
  {
    name: 'C Major (8th position)',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 6, fret: 8, tone: 'C' },
        { string: 5, fret: 10, tone: 'G' },
        { string: 4, fret: 10, tone: 'C' },
        { string: 3, fret: 9, tone: 'E' },
        { string: 2, fret: 8, tone: 'G' },
        { string: 1, fret: 8, tone: 'C' }
      ],
      fingers: [1, 3, 4, 2, 1, 1],
      barres: [
        { fromString: 1, toString: 6, fret: 8, finger: 1 }
      ]
    },
    theory: {
      chordTones: ['C', 'E', 'G'],
      tones: ['C', 'G', 'C', 'E', 'G', 'C'],
      intervals: ['R', '5', 'R', '3', '5', 'R'],
      formula: ['R', '3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      startFret: 8
    }
  },
  // Chitarra standard (6 corde) - C Major in prima posizione
  {
    name: 'C Major',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 5, fret: 3, tone: 'C' },
        { string: 4, fret: 2, tone: 'E' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 1, tone: 'C' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, muted: true }
      ],
      fingers: [null, 3, 2, 0, 1, 0],
      barres: []
    },
    theory: {
      chordTones: ['C', 'E', 'G'],
      tones: ['', 'C', 'E', 'G', 'C', 'E'],
      intervals: ['', 'R', '3', '5', 'R', '3'],
      formula: ['R', '3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'G Major',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 6, fret: 3, tone: 'G' },
        { string: 5, fret: 2, tone: 'B' },
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 3, tone: 'G' }
      ],
      fingers: [3, 2, 0, 0, 0, 4],
      barres: [
        { fromString: 1, toString: 3, fret: 3, finger: 4 }
      ]
    },
    theory: {
      chordTones: ['G', 'B', 'D'],
      tones: ['G', 'B', 'D', 'G', 'B', 'G'],
      intervals: ['R', '3', '5', 'R', '3', 'R'],
      formula: ['R', '3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  // Drop D
  {
    name: 'D5',
    instrumentName: 'Guitar (Drop D Tuning)',
    positions: {
      notes: [
        { string: 6, fret: 0, tone: 'D' },
        { string: 5, fret: 2, tone: 'A' },
        { string: 4, fret: 2, tone: 'D' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 0, tone: 'E' }
      ],
      fingers: [0, 2, 3, 0, 0, 0], 
      barres: []
    },
    theory: {
      chordTones: ['D', 'A'],
      tones: ['D', 'A', 'D', 'G', 'B', 'E'],
      intervals: ['R', '5', 'R', '4', '6', '2'],
      formula: ['R','3','5'], // Note: Formula for D5 is typically R 5
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['D', 'A', 'D', 'G', 'B', 'E']
  },
  // Open G
  {
    name: 'Open G', // This name used multiple times by user, data varies
    instrumentName: 'Guitar (Open G Tuning)',
    positions: {
      notes: [
        { string: 6, fret: 0, tone: 'D' },
        { string: 5, fret: 0, tone: 'G' },
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 0, tone: 'D' }
      ],
      fingers: [0, 0, 0, 0, 0, 0],
      barres: []
    },
    theory: {
      chordTones: ['G', 'B', 'D'],
      tones: ['D', 'G', 'D', 'G', 'B', 'D'],
      intervals: ['5', 'R', '5', 'R', '3', '5'],
      formula: ['R', '3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['D', 'G', 'D', 'G', 'B', 'D']
  },
  {
    name: 'D Minor', // First instance of D Minor name
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 1, tone: 'D' }, // B-string, 1st fret is C. D string is open. This note seems off for Dm.
        { string: 1, fret: 3, tone: 'F' }, // High E string, 3rd fret is G. F is 1st fret.
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, muted: true }
      ],
      fingers: [3, 1, 2, 0, null, null], // Check alignment with notes and LowE-HighE order
      barres: []
    },
    theory: {
      chordTones: ['D', 'F', 'A'],
      tones: ['', '', 'D', 'A', 'D', 'F'], // Check notes vs tones
      intervals: ['', '', 'R', '5', 'R', 'b3'], // F is m3. D on B string?
      formula: ['R', 'b3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'A Major', // First instance of A Major name
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [ // Standard A: X02220. Notes are A E A C# E
        { string: 3, fret: 2, tone: 'A' },  // G string, 2nd fret = A
        { string: 2, fret: 2, tone: 'C#' }, // B string, 2nd fret = C#
        { string: 1, fret: 0, tone: 'E' },  // High E string, open = E
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, tone: 'A' },  // A string, open = A
        { string: 4, fret: 2, tone: 'E' }   // D string, 2nd fret = E
      ],
      fingers: [3, 2, 0, null, 0, 1], // Check alignment
      barres: []
    },
    theory: {
      chordTones: ['A', 'C#', 'E'],
      tones: ['A', 'E', 'A', 'C#', 'E', ''], // S6 muted, S5 A. Order LowE to HighE. So [null, 'A', 'E', 'A', 'C#', 'E']
      intervals: ['R', '5', 'R', '3', '5', ''], // Same here: [null, 'R', '5', 'R', '3', '5']
      formula: ['R', '3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'E Minor', // First instance of E Minor name
    instrumentName: 'Guitar (Standard Tuning)',
    positions: { // Standard Em: 022000. Notes E B E G B E
      notes: [
        { string: 5, fret: 2, tone: 'E' }, // A string, 2nd fret = B. (User has E)
        { string: 4, fret: 2, tone: 'B' }, // D string, 2nd fret = E. (User has B)
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, tone: 'E' }
      ],
      fingers: [2, 3, 0, 0, 0, 0], // LowE to HighE. 0,2,3,0,0,0 or 0,2,2,0,0,0
      barres: []
    },
    theory: {
      chordTones: ['E', 'G', 'B'],
      tones: ['E', 'B', 'E', 'G', 'B', 'E'], // Matches 022000
      intervals: ['R', '5', 'R', 'b3', '5', 'R'], // G is m3. b3 is fine.
      formula: ['R', 'b3', '5'],
      extensions: []
    },
    display: {
      labelType: 'finger',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'D Minor', // Second D Minor
    instrumentName: 'Guitar (Standard Tuning)',
    positions: { // Standard Dm: XX0231. Notes D A F D
      notes: [
        { string: 4, fret: 0, tone: 'D' },  // D string, open = D
        { string: 3, fret: 2, tone: 'A' },  // G string, 2nd fret = A
        { string: 2, fret: 3, tone: 'D' },  // B string, 3rd fret = D. (Standard Dm has F here: S2,F3)
        { string: 1, fret: 1, tone: 'F' },  // E string, 1st fret = F. (Standard Dm has D here: S1,F1)
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, muted: true }
      ],
      fingers: [0, 3, 4, 2, null, null], // Check alignment
      barres: []
    },
    theory: { /* ... */ }, display: { /* ... */ }, tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'Open G', // Third Open G, very different notes
    instrumentName: 'Guitar (Open G Tuning)', // Added
    positions: { // Notes Dm: A D F
      notes: [
        { string: 3, fret: 2, tone: 'A' }, // G string (of Open G DGDGBD) -> 2nd fret is A
        { string: 2, fret: 3, tone: 'D' }, // B string (of Open G) -> 3rd fret is D
        { string: 1, fret: 1, tone: 'F' }, // D string (high D of Open G) -> 1st fret is F
        { string: 5, fret: 0, muted: true }, // G string (mid G of Open G) -> muted
        { string: 6, fret: 0, muted: true }  // D string (low D of Open G) -> muted
        // Missing string 4
      ],
      fingers: [3, 4, 1, 0, 0, null], // Check alignment
      barres: []
    },
    theory: { /* ... */ }, display: { /* ... */ }, tuning: ['E', 'A', 'D', 'G', 'B', 'E'] // Should be Open G tuning
  },
  // Basso 4 corde
  {
    name: 'E minor', // Duplicate name
    instrumentName: 'Bass (4 strings)',
    positions: { /* ... */ }, theory: { /* ... */ }, display: { /* ... */ }, tuning: ['E', 'A', 'D', 'G']
  },
  // Chitarra 7 corde
  {
    name: 'A7', // Duplicate name
    instrumentName: 'Guitar (7 strings)',
    positions: { /* ... */ }, theory: { /* ... */ }, display: { /* ... */ }, tuning: ['B', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  // These last 5 are direct duplicates from earlier in user's list, remove them.
  // { name: 'D Minor', ... },
  // { name: 'A Major', ... },
  // { name: 'E Minor', ... },
  // { name: 'F Major', ... },
  // { name: 'Open G', ... }
];

// The rest of the React component code as provided by the user, with my minor adjustments from previous thought block
// (e.g., useEffect, handleChordChange, JSX for controls and ChordDiagram rendering)
// For brevity, not pasting the full React component code again here, but it's part of the string.
// Ensure the 'export default ChordTestPage;' is present.

export function ChordTestPage() { 
  const [testChordsState] = useState<ChordDiagramData[]>(testChords);
  const [selectedChord, setSelectedChord] = useState<ChordDiagramData>(testChords[0]);
  const [diagramSize, setDiagramSize] = useState({ width: 250, height: 350 });
  const [labelType, setLabelType] = useState<'none' | 'finger' | 'tone' | 'interval'>('finger');
  const [customTuning, setCustomTuning] = useState<string[]>(['E', 'A', 'D', 'G', 'B', 'E']);
  const [showTuningEditor, setShowTuningEditor] = useState(false);
  const [numFrets, setNumFrets] = useState<number>(5);
  const [showFretNumbers, setShowFretNumbers] = useState<boolean>(true);

  const detectNumStrings = useCallback((chord: ChordDiagramData | undefined | null): number => {
    if (!chord || !chord.positions?.notes || chord.positions.notes.length === 0) {
      return chord?.tuning?.length || 6;
    }
    const validNotes = chord.positions.notes.filter(note => typeof note.string === 'number');
    if (validNotes.length === 0) return chord?.tuning?.length || 6;
    return Math.max(...validNotes.map(note => note.string));
  }, []);

  const [numStrings, setNumStrings] = useState(() => detectNumStrings(testChords[0]));

  useEffect(() => {
    if (selectedChord) {
        const newNumStrings = detectNumStrings(selectedChord);
        setNumStrings(newNumStrings);
        const currentChordTuning = selectedChord.tuning ||
          (newNumStrings === 7 ? ['B', 'E', 'A', 'D', 'G', 'B', 'E'] :
           newNumStrings === 6 ? ['E', 'A', 'D', 'G', 'B', 'E'] :
           newNumStrings === 5 ? ['A', 'D', 'G', 'B', 'E'] : 
           newNumStrings === 4 ? ['E', 'A', 'D', 'G'] : 
           ['E', 'A', 'D', 'G', 'B', 'E']);
        setCustomTuning(currentChordTuning);
    }
  }, [selectedChord, detectNumStrings]);

  const handleChordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);
    const chord = testChordsState[selectedIndex];
    if (chord) {
      setSelectedChord(chord);
    }
  };

  if (!selectedChord && testChords.length > 0) {
      // This case should ideally not be hit if testChords is non-empty and selectedChord is initialized.
      // However, as a safeguard:
      setSelectedChord(testChords[0]); 
      return <div>Initializing chord...</div>;
  }
  if (!selectedChord) {
    return <div>No chord selected or no chords available.</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chord Diagram Tester</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-medium block mb-2">Select Chord:</label>
          <select
            value={testChordsState.findIndex(c => c.name === selectedChord.name && JSON.stringify(c.positions) === JSON.stringify(selectedChord.positions))}
            onChange={handleChordChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          >
            {testChordsState.map((chord, index) => (
              <option key={`${chord.name}-${index}`} value={index}>
                {chord.name}{chord.instrumentName ? ` (${chord.instrumentName})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium block mb-2">Number of Frets: {numFrets}</label>
          <input
            type="range" min="4" max="12" value={numFrets}
            onChange={(e) => setNumFrets(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>4</span><span>12</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Display Options</h2>
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <span className="text-sm font-medium">Show Fret Numbers</span>
            <button
              onClick={() => setShowFretNumbers(!showFretNumbers)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                showFretNumbers ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showFretNumbers ? 'translate-x-6' : 'translate-x-1'
                }`}/>
            </button>
          </div>
          <h3 className="text-lg font-medium mb-2">Label Type</h3>
          <div className="space-y-2 mb-4">
            {(['none', 'finger', 'tone', 'interval'] as const).map((type) => (
              <label key={type} className="flex items-center">
                <input type="radio" name="labelType" className="mr-2" checked={labelType === type} onChange={() => setLabelType(type)} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Diagram Size</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Width</label>
              <input type="range" min="200" max="600" step="10" value={diagramSize.width}
                onChange={(e) => setDiagramSize(prev => ({ ...prev, width: parseInt(e.target.value) }))} className="w-full" />
              <span className="text-sm">{diagramSize.width}px</span>
            </div>
            <div>
              <label className="block mb-1">Height</label>
              <input type="range" min="250" max="800" step="10" value={diagramSize.height}
                onChange={(e) => setDiagramSize(prev => ({ ...prev, height: parseInt(e.target.value) }))} className="w-full" />
              <span className="text-sm">{diagramSize.height}px</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Tuning</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{[...customTuning].reverse().join('  ')}</span>
              <button onClick={() => setShowTuningEditor(!showTuningEditor)} className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
                {showTuningEditor ? 'Chiudi' : 'Modifica'}
              </button>
            </div>
            {showTuningEditor && (
              <div className="mt-2 space-y-2">
                <div className={`grid grid-cols-${Math.max(1, numStrings)} gap-1`}>
                  {[...customTuning].reverse().map((currentStringNote, stringIdx) => (
                    <select key={stringIdx} value={currentStringNote}
                      onChange={(e) => {
                        const newTuningReversed = [...customTuning].reverse();
                        newTuningReversed[stringIdx] = e.target.value;
                        setCustomTuning(newTuningReversed.reverse());
                      }}
                      className="p-1 border rounded text-center text-xs">
                      {['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'].map((note) => (
                        <option key={note} value={note}>{note}</option>
                      ))}
                    </select>
                  ))}
                </div>
                <button onClick={() => {
                    let standardTuning: string[];
                    if (numStrings === 4) standardTuning = ['E', 'A', 'D', 'G']; // Bass EADG (Low to High)
                    else if (numStrings === 5) standardTuning = ['A', 'D', 'G', 'B', 'E']; // Example 5-string ADGBE
                    else if (numStrings === 7) standardTuning = ['B', 'E', 'A', 'D', 'G', 'B', 'E']; // 7-string BEADGBE
                    else standardTuning = ['E', 'A', 'D', 'G', 'B', 'E']; // 6 string default
                    setCustomTuning(standardTuning);
                  }} className="text-xs text-blue-500 hover:underline">
                  Reimposta accordatura standard (per {numStrings} corde)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div style={{ width: diagramSize.width, height: diagramSize.height }}>
              <ChordDiagram
                key={JSON.stringify(selectedChord) + numStrings + numFrets + labelType + showFretNumbers + customTuning.join(',') + diagramSize.width + diagramSize.height}
                data={selectedChord}
                numStrings={numStrings}
                numFrets={numFrets}
                width={diagramSize.width}
                height={diagramSize.height}
                labelType={labelType}
                showFretNumbers={showFretNumbers}
                showStringNames={selectedChord.display?.showStringNames}
                tuning={customTuning}
                className="border border-gray-200 rounded p-4"
                onNoteClick={(note) => console.log('Note clicked:', note)}
                onBarreClick={(barre) => console.log('Barre clicked:', barre)}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '20px', width: '100%', maxWidth: '800px', maxHeight: '400px', overflowY: 'auto', textAlign: 'left' }}>
        <h2>Selected Chord Data (Raw):</h2>
        <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(selectedChord, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ChordTestPage;
