import React, { useState, useCallback, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import ChordDiagram from './components/ChordDiagram';
import type { ChordDiagramData } from './types';

function getStandardTuning(numStrings: number): string[] {
  if (numStrings === 4) return ['E', 'A', 'D', 'G'];
  if (numStrings === 5) return ['A', 'D', 'G', 'B', 'E'];
  if (numStrings === 7) return ['B', 'E', 'A', 'D', 'G', 'B', 'E'];
  return ['E', 'A', 'D', 'G', 'B', 'E'];
}

const testChords: ChordDiagramData[] = [
  {
    name: 'C Major (Open) v2',
    instrument: 'guitar',
    positions: [
      {
        baseFret: 1,
        notes: [
          { position: { string: 6, fret: -1 }, annotation: { finger: 'X', tone: undefined, interval: undefined } },
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
    instrument: 'guitar',
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
    instrument: 'guitar',
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
  },
  {
    name: 'G Major (Barre @3rd)',
    instrument: 'guitar',
    positions: [
      {
        baseFret: 3,
        notes: [
          // String numbers are 1 (highest pitch) to 6 (lowest pitch)
          { position: { string: 1, fret: 3 }, annotation: { finger: 1, tone: 'G', interval: 'R' } }, // High E string
          { position: { string: 2, fret: 3 }, annotation: { finger: 1, tone: 'D', interval: '5' } }, // B string
          { position: { string: 3, fret: 4 }, annotation: { finger: 2, tone: 'B', interval: '3' } }, // G string
          { position: { string: 4, fret: 5 }, annotation: { finger: 4, tone: 'G', interval: 'R' } }, // D string
          { position: { string: 5, fret: 5 }, annotation: { finger: 3, tone: 'D', interval: '5' } }, // A string
          { position: { string: 6, fret: 3 }, annotation: { finger: 1, tone: 'G', interval: 'R' } }  // Low E string
        ],
        barres: [{ fromString: 1, toString: 6, fret: 3, finger: 1 }]
      }
    ],
    theory: { chordTones: ['G', 'B', 'D'], formula: 'R 3 5' },
    display: { labelType: 'finger' },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'] // Low E to High E
  },
  {
    name: 'C Major (Ukulele)',
    instrument: 'ukulele',
    positions: [
      {
        baseFret: 1,
        notes: [
          // Ukulele strings: GCEA. String 1 is A (highest pitch), String 4 is G.
          { position: { string: 1, fret: 3 }, annotation: { finger: 3, tone: 'C', interval: 'R' } }, // A string, 3rd fret
          { position: { string: 2, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: '3' } }, // E string, open
          { position: { string: 3, fret: 0 }, annotation: { finger: 'O', tone: 'C', interval: 'R' } }, // C string, open
          { position: { string: 4, fret: 0 }, annotation: { finger: 'O', tone: 'G', interval: '5' } }  // G string, open
        ],
        barres: []
      }
    ],
    theory: { chordTones: ['C', 'E', 'G'], formula: 'R 3 5' },
    display: { labelType: 'tone' },
    tuning: ['G', 'C', 'E', 'A'] // GCEA standard Ukulele tuning (string 4 to string 1)
  }
];

const ChordTestPage = (): JSX.Element => {
  const [testChordsState] = useState<ChordDiagramData[]>(testChords);
  const [selectedChord, setSelectedChord] = useState<ChordDiagramData>(testChords[0]);
  const [diagramSize, setDiagramSize] = useState({ width: 300, height: 700 });
  const [labelType, setLabelType] = useState<'none' | 'finger' | 'tone' | 'interval'>('finger');
  const [customTuning, setCustomTuning] = useState<string[]>(['E', 'A', 'D', 'G', 'B', 'E']);
  const [showTuningEditor, setShowTuningEditor] = useState(false);
  const [numFrets, setNumFrets] = useState<number>(5);
  const [showFretNumbers, setShowFretNumbers] = useState<boolean>(true);
  const [bottomLabels, setBottomLabels] = useState({
    showFingers: false,
    showTones: true,
    showIntervals: false
  });

  const handleToggleBottomLabel = (key: 'showFingers' | 'showTones' | 'showIntervals') => {
    setBottomLabels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const detectNumStrings = useCallback((chord: ChordDiagramData | undefined | null): number => {
    if (!chord || !chord.positions || chord.positions.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
        (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const currentPositionNotes = chord.positions[0].notes;
    if (!currentPositionNotes || currentPositionNotes.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
        (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const validNotes = currentPositionNotes.filter(note => typeof note.position.string === 'number');
    if (validNotes.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
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
      if (typeof selectedChord.tuning === 'object' && selectedChord.tuning !== null && !Array.isArray(selectedChord.tuning) && 'notes' in selectedChord.tuning) {
        defaultTuningForStrings = selectedChord.tuning.notes;
      } else if (Array.isArray(selectedChord.tuning)) {
        defaultTuningForStrings = selectedChord.tuning;
      } else {
        defaultTuningForStrings = getStandardTuning(newNumStrings);
      }
      setCustomTuning(defaultTuningForStrings);
    }
  }, [selectedChord, detectNumStrings]);

  const handleChordChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);
    const chord = testChordsState[selectedIndex];
    if (chord) {
      setSelectedChord(chord);
    }
  };

  if (!selectedChord) {
    return <div>No chord selected or no chords available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Chord Diagram Tester</h1>

      {/* Main layout using CSS Grid: Left UI (2) | Diagram (2) | Raw Data (1) --> total 5 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch h-full">

        {/* Left Section: All UI Controls (Chord Settings, Display & Tuning) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Chord & Fret</h3>
              <div className="mb-6">
                <label htmlFor="chord-select" className="font-medium block mb-2">Select Chord:</label>
                <select
                  id="chord-select"
                  value={testChordsState.findIndex(c => c.name === selectedChord.name && JSON.stringify(c.positions) === JSON.stringify(selectedChord.positions))}
                  onChange={handleChordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {testChordsState.map((chord, index) => (
                    <option key={`${chord.name}-${index}`} value={index}>
                      {chord.name}{chord.instrument ? ` (${chord.instrument})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="num-frets" className="font-medium block mb-2">Number of Frets: <span className="font-bold">{numFrets}</span></label>
                <input
                  type="range"
                  id="num-frets"
                  min="3"
                  max="15"
                  value={numFrets}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNumFrets(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-700 accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1 dark:text-gray-400"><span>3</span><span>15</span></div>
              </div>
              <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                <span className="text-sm font-medium">Show Fret Numbers</span>
                <button
                  onClick={() => setShowFretNumbers(!showFretNumbers)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showFretNumbers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`
                  }
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${showFretNumbers ? 'translate-x-6' : 'translate-x-1'}`}/>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Display Options</h3>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Note Label Type</h4>
                <div className="space-y-2">
                  {(['none', 'finger', 'tone', 'interval'] as const).map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="labelType"
                        className="mr-3 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={labelType === type}
                        onChange={() => setLabelType(type)}
                      />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Bottom Labels</h4>
                <div className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bottomLabels.showFingers}
                      onChange={() => handleToggleBottomLabel('showFingers')}
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="font-medium">Fingers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bottomLabels.showTones}
                      onChange={() => handleToggleBottomLabel('showTones')}
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="font-medium">Tones</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bottomLabels.showIntervals}
                      onChange={() => handleToggleBottomLabel('showIntervals')}
                      className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="font-medium">Intervals</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Diagram Size</h3>
                <div className="space-y-4 w-full">
                  <div>
                    <label className="block mb-1">Width (max 350px)</label>
                    <input type="range" min="150" max="350" step="5" value={diagramSize.width}
                      onChange={(e) => {
                        const newWidth = parseInt(e.target.value);
                        setDiagramSize({ width: newWidth, height: newWidth * 2 });
                      }} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-700 accent-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{diagramSize.width}px</span>
                  </div>
                  <div>
                    <label className="block mb-1">Height (auto: 2× width)</label>
                    <input type="range" min="200" max="700" step="10"
                      value={diagramSize.width * 2}
                      onChange={(e) => {
                        const newHeight = parseInt(e.target.value);
                        setDiagramSize({ width: Math.round(newHeight / 2), height: newHeight });
                      }}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-700 accent-blue-500"
                      disabled
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{diagramSize.width * 2}px (auto)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Tuning</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg">{[...customTuning].reverse().join(' ')}</span>
                    <button
                      onClick={() => setShowTuningEditor(!showTuningEditor)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-200"
                    >
                      {showTuningEditor ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  {showTuningEditor && (
                    <div className="mt-3 space-y-3">
                      <div className={`grid grid-cols-${Math.max(1, numStrings)} gap-2`}>
                        {[...customTuning].reverse().map((currentStringNote, stringIdx) => (
                          <select
                            key={stringIdx}
                            value={currentStringNote}
                            onChange={(e) => {
                              const newTuningReversed = [...customTuning].reverse();
                              newTuningReversed[stringIdx] = e.target.value;
                              setCustomTuning(newTuningReversed.reverse());
                            }}
                            className="p-2 border border-gray-300 rounded-md text-center text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          >
                            {['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'].map((note) => (
                              <option key={note} value={note}>{note}</option>
                            ))}
                          </select>
                        ))}
                      </div>
                      <button
                        onClick={() => setCustomTuning(getStandardTuning(numStrings))}
                        className="text-sm text-blue-500 hover:text-blue-700 transition duration-200"
                      >
                        Reset to Standard Tuning ({numStrings} strings)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section: Chord Diagram (Occupies 2 columns) */}
        <div className="flex flex-col justify-start items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 lg:col-span-2 min-h-[350px]">
          <h2 className="text-xl font-semibold mb-4 text-center">Chord Diagram</h2>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: '348px',
            maxHeight: '748px',
            minWidth: '150px',
            minHeight: '300px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem'
          }}>
            <ChordDiagram
              key={JSON.stringify(selectedChord) + numStrings + numFrets + labelType + showFretNumbers + customTuning.join(',') + diagramSize.width + diagramSize.height + JSON.stringify(bottomLabels)}
              data={selectedChord}
              numFrets={numFrets}
              width={diagramSize.width}
              height={diagramSize.height}
              labelType={labelType}
              showFretNumbers={showFretNumbers}
              tuning={customTuning}
              bottomLabels={bottomLabels}
              className="border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-inner flex-none"
            />
          </div> {/* Closes inner styled div for ChordDiagram */}
        </div> {/* Closes center section div containing ChordDiagram */}
        {/* Right Section: Raw Data (Occupies 1 column) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Selected Chord Data (Raw):</h2>
          <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md overflow-x-auto text-sm border border-gray-200 dark:border-gray-600 flex-grow">
            {JSON.stringify(selectedChord, null, 2)}
          </pre>
      </div>
    </div>
    </div>
  );
};
export default ChordTestPage;