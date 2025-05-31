import React, { useState, useCallback, useEffect } from 'react';
import ChordDiagram from './components/ChordDiagram';
import type { ChordDiagramData } from './types';

const testChords: ChordDiagramData[] = [
  {
    name: 'C Major (Open) v2',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: [
      {
        baseFret: 1,
        notes: [
          { position: { string: 6, fret: -1 }, annotation: { finger: 'X', tone: null, interval: null } },
          { position: { string: 5, fret: 3 }, annotation: { finger: 3, tone: 'C', interval: 'R' } },
          { position: { string: 4, fret: 2 }, annotation: { finger: 2, tone: 'E', interval: '3' } },
          { position: { string: 3, fret: 0 }, annotation: { finger: 'O', tone: 'G', interval: '5' } },
          { position: { string: 2, fret: 1 }, annotation: { finger: 1, tone: 'C', interval: 'R' } },
          { position: { string: 1, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: '3' } }
        ],
        barres: []
      }
    ],
    theory: { chordTones: ['C', 'E', 'G'], formula: 'R 3 5' },
    display: { labelType: 'finger', showFretNumbers: true, showStringNames: true },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'F Major (Barre) v2',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: [
      {
        baseFret: 1,
        notes: [
          { position: { string: 6, fret: 1 }, annotation: { finger: 1, tone: 'F', interval: 'R' } },
          { position: { string: 5, fret: 3 }, annotation: { finger: 3, tone: 'C', interval: '5' } },
          { position: { string: 4, fret: 3 }, annotation: { finger: 4, tone: 'F', interval: 'R' } },
          { position: { string: 3, fret: 2 }, annotation: { finger: 2, tone: 'A', interval: '3' } },
          { position: { string: 2, fret: 1 }, annotation: { finger: 1, tone: 'C', interval: '5' } },
          { position: { string: 1, fret: 1 }, annotation: { finger: 1, tone: 'F', interval: 'R' } }
        ],
        barres: [{ fromString: 1, toString: 6, fret: 1, finger: 1 }]
      }
    ],
    theory: { chordTones: ['F', 'A', 'C'], formula: 'R 3 5' },
    display: { labelType: 'finger' },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'E7 (Open) v2',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: [
      {
        baseFret: 1,
        notes: [
          { position: { string: 6, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: 'R' } },
          { position: { string: 5, fret: 2 }, annotation: { finger: 2, tone: 'B', interval: '5' } },
          { position: { string: 4, fret: 0 }, annotation: { finger: 'O', tone: 'D', interval: 'm7' } },
          { position: { string: 3, fret: 1 }, annotation: { finger: 1, tone: 'G#', interval: '3' } },
          { position: { string: 2, fret: 0 }, annotation: { finger: 'O', tone: 'B', interval: '5' } },
          { position: { string: 1, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: 'R' } }
        ],
        barres: []
      }
    ],
    theory: { chordTones: ['E', 'G#', 'B', 'D'], formula: 'R 3 5 m7' },
    display: { labelType: 'interval' },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  }
];

const ChordTestPage: React.FC = () => {
  const [testChordsState] = useState<ChordDiagramData[]>(testChords);
  const [selectedChord, setSelectedChord] = useState<ChordDiagramData>(testChords[0]);
  const [diagramSize, setDiagramSize] = useState({ width: 250, height: 350 });
  const [labelType, setLabelType] = useState<'none' | 'finger' | 'tone' | 'interval' | 'degree'>('finger');
  const [customTuning, setCustomTuning] = useState<string[]>(['E', 'A', 'D', 'G', 'B', 'E']);
  const [showTuningEditor, setShowTuningEditor] = useState(false);
  const [numFrets, setNumFrets] = useState<number>(5);
  const [showFretNumbers, setShowFretNumbers] = useState<boolean>(true);

  const detectNumStrings = useCallback((chord: ChordDiagramData | undefined | null): number => {
    if (!chord || !chord.positions || chord.positions.length === 0 ) {
      return chord?.tuning && !Array.isArray(chord.tuning) ? chord.tuning.notes.length :
             (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const currentPositionNotes = chord.positions[0].notes;
    if (!currentPositionNotes || currentPositionNotes.length === 0) {
        return chord?.tuning && !Array.isArray(chord.tuning) ? chord.tuning.notes.length :
               (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const validNotes = currentPositionNotes.filter(note => typeof note.position.string === 'number');
    if (validNotes.length === 0) {
        return chord?.tuning && !Array.isArray(chord.tuning) ? chord.tuning.notes.length :
               (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    return Math.max(...validNotes.map(note => note.position.string));
  }, []);

  const [numStrings, setNumStrings] = useState(() => detectNumStrings(testChords[0]));

  useEffect(() => {
    if (selectedChord) {
        const newNumStrings = detectNumStrings(selectedChord);
        setNumStrings(newNumStrings);

        let defaultTuningForStrings: string[];
        if (typeof selectedChord.tuning === 'object' && selectedChord.tuning !== null && !Array.isArray(selectedChord.tuning) && selectedChord.tuning.notes) {
            defaultTuningForStrings = selectedChord.tuning.notes;
        } else if (Array.isArray(selectedChord.tuning)) {
            defaultTuningForStrings = selectedChord.tuning;
        } else {
            if (newNumStrings === 7) defaultTuningForStrings = ['B', 'E', 'A', 'D', 'G', 'B', 'E'];
            else if (newNumStrings === 6) defaultTuningForStrings = ['E', 'A', 'D', 'G', 'B', 'E'];
            else if (newNumStrings === 5) defaultTuningForStrings = ['A', 'D', 'G', 'B', 'E'];
            else if (newNumStrings === 4) defaultTuningForStrings = ['E', 'A', 'D', 'G'];
            else defaultTuningForStrings = ['E', 'A', 'D', 'G', 'B', 'E'];
        }
        setCustomTuning(defaultTuningForStrings);
    }
  }, [selectedChord, detectNumStrings]);

  const handleChordChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);
    const chord = testChordsState[selectedIndex];
    if (chord) {
      setSelectedChord(chord);
    }
  };

  if (!selectedChord && testChords.length > 0 && testChords[0]) { // Added testChords[0] check
      setSelectedChord(testChords[0]);
      return <div>Initializing chord...</div>; // Should not be hit if testChords is pre-filled
  }
  if (!selectedChord) { // If testChords is empty or selectedChord is somehow still null
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
            type="range" min="3" max="15" value={numFrets}
            onChange={(e) => setNumFrets(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>3</span><span>15</span></div>
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
            {(['none', 'finger', 'tone', 'interval', 'degree'] as const).map((type) => (
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
              <input type="range" min="150" max="600" step="10" value={diagramSize.width}
                onChange={(e) => setDiagramSize(prev => ({ ...prev, width: parseInt(e.target.value) }))} className="w-full" />
              <span className="text-sm">{diagramSize.width}px</span>
            </div>
            <div>
              <label className="block mb-1">Height</label>
              <input type="range" min="200" max="800" step="10" value={diagramSize.height}
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
                    if (numStrings === 4) standardTuning = ['E', 'A', 'D', 'G'];
                    else if (numStrings === 5) standardTuning = ['A', 'D', 'G', 'B', 'E'];
                    else if (numStrings === 7) standardTuning = ['B', 'E', 'A', 'D', 'G', 'B', 'E'];
                    else standardTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
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
            <div style={{ width: diagramSize.width, height: diagramSize.height, maxWidth: '100%', overflow: 'hidden' }}>
              <ChordDiagram
                key={JSON.stringify(selectedChord) + numStrings + numFrets + labelType + showFretNumbers + customTuning.join(',') + diagramSize.width + diagramSize.height}
                data={selectedChord}
                numFrets={numFrets}
                width={diagramSize.width}
                height={diagramSize.height}
                labelType={labelType}
                showFretNumbers={showFretNumbers}
                tuning={customTuning}
                className="border border-gray-200 rounded p-4"
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
};

export default ChordTestPage;
