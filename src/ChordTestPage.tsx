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
        { string: 3, fret: 0, tone: 'G' },  // Corde aperte
        { string: 2, fret: 1, tone: 'C' },
        { string: 1, fret: 0, tone: 'E' },  // Corde aperte
        { string: 6, fret: 0, muted: true } // Sesta corda muta
      ],
      fingers: [3, 2, 0, 1, 0, null],
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
        { string: 6, fret: 3, tone: 'G' },  // Sesta corda (più spessa)
        { string: 5, fret: 2, tone: 'B' },
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 3, tone: 'G' }   // Prima corda (più sottile)
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
      fingers: [0, 2, 3, 0, 0, 0], // 0 per corde a vuoto
      barres: []
    },
    theory: {
      chordTones: ['D', 'A'],
      tones: ['D', 'A', 'D', 'G', 'B', 'E'],
      intervals: ['R', '5', 'R', '4', '6', '2'],
      formula: ['R','3','5'],
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
    name: 'Open G',
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
    name: 'D Minor',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 1, tone: 'D' },
        { string: 1, fret: 3, tone: 'F' },
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, muted: true }
      ],
      fingers: [3, 1, 2, 0, null, null],
      barres: []
    },
    theory: {
      chordTones: ['D', 'F', 'A'],
      tones: ['', '', 'D', 'A', 'D', 'F'],
      intervals: ['', '', 'R', '5', 'R', 'b3'],
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
    name: 'A Major',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 2, tone: 'C#' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, tone: 'A' },
        { string: 4, fret: 2, tone: 'E' }
      ],
      fingers: [3, 2, 0, null, 0, 1],
      barres: []
    },
    theory: {
      chordTones: ['A', 'C#', 'E'],
      tones: ['A', 'E', 'A', 'C#', 'E', ''],
      intervals: ['R', '5', 'R', '3', '5', ''],
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
    name: 'E Minor',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 5, fret: 2, tone: 'E' },
        { string: 4, fret: 2, tone: 'B' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, tone: 'E' }
      ],
      fingers: [2, 3, 0, 0, 0, 0],
      barres: []
    },
    theory: {
      chordTones: ['E', 'G', 'B'],
      tones: ['E', 'B', 'E', 'G', 'B', 'E'],
      intervals: ['R', '5', 'R', 'b3', '5', 'R'],
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
    name: 'D Minor',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 3, tone: 'D' },
        { string: 1, fret: 1, tone: 'F' },
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, muted: true }
      ],
      fingers: [0, 3, 4, 2, null, null],
      barres: []
    },
    theory: {
      chordTones: ['D', 'F', 'A'],
      tones: ['', '', 'D', 'A', 'D', 'F'],
      intervals: ['', '', 'R', '5', 'R', 'b3'],
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
    name: 'Open G',
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
      fingers: [0, 0, 0, 0, 0, 0], // Tutte le corde a vuoto
      barres: []
    },
    theory: {
      tones: ['D', 'G', 'D', 'G', 'B', 'D'], // Nomi delle note
      intervals: ['5', 'R', '5', 'R', '3', '5'], // Intervalli
      formula: ['R','5','5'],
      description: 'Open G tuning chord'
    },
    display: {
      labelType: 'interval',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['D', 'G', 'D', 'G', 'B', 'D']
  },
  
  // Basso 4 corde
  {
    name: 'E minor',
    positions: {
      notes: [
        { string: 4, fret: 2, tone: 'F#' },
        { string: 3, fret: 2, tone: 'B' },
        { string: 2, fret: 0, tone: 'E' },
        { string: 1, fret: 0, tone: 'G' }
      ],
      fingers: [2, 3, 0, 0], // 0 per corde a vuoto
      barres: []
    },
    theory: {
      tones: ['F#', 'B', 'E', 'G'], // Nomi delle note
      intervals: ['2', '5', 'R', 'm3'], // Intervalli
      formula: ['R','3m','5'],
      description: 'E minor chord on bass guitar'
    },
    display: {
      labelType: 'interval',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G']
  },
  
  // Chitarra 7 corde
  {
    name: 'A7',
    positions: {
      notes: [
        { string: 6, fret: 0, tone: 'A' },
        { string: 5, fret: 2, tone: 'E' },
        { string: 4, fret: 2, tone: 'A' },
        { string: 3, fret: 2, tone: 'C#' },
        { string: 2, fret: 2, tone: 'F#' },
        { string: 1, fret: 0, tone: 'E' }
      ],
      fingers: [0, 4, 3, 2, 0, 0], // 0 per corde a vuoto
      barres: []
    },
    theory: {
      tones: ['A', 'E', 'A', 'C#', 'F#', 'E'], // Nomi delle note
      intervals: ['R', '5', 'R', '3', '7', '6'], // Intervalli
      formula: ['R','3','5','7'],
      description: 'A7 chord on 7-string guitar'
    },
    display: {
      labelType: 'interval',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['B', 'E', 'A', 'D', 'G', 'B', 'E']
  },
  {
    name: 'D Minor',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 4, fret: 0, tone: 'D' },
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 1, tone: 'D' },
        { string: 1, fret: 3, tone: 'F' },
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, muted: true }
      ],
      fingers: [0, 3, 2, 4, null, null],
      barres: []
    },
    theory: {
      chordTones: ['D', 'F', 'A'],
      tones: ['', '', 'D', 'A', 'D', 'F'],
      intervals: ['', '', 'R', '5', 'R', 'b3'],
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
    name: 'A Major',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 2, tone: 'C#' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, muted: true },
        { string: 5, fret: 0, tone: 'A' },
        { string: 4, fret: 2, tone: 'E' }
      ],
      fingers: [3, 2, 0, null, 0, 1],
      barres: []
    },
    theory: {
      chordTones: ['A', 'C#', 'E'],
      tones: ['A', 'E', 'A', 'C#', 'E', ''],
      intervals: ['R', '5', 'R', '3', '5', ''],
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
    name: 'E Minor',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 5, fret: 2, tone: 'E' },
        { string: 4, fret: 2, tone: 'B' },
        { string: 3, fret: 0, tone: 'G' },
        { string: 2, fret: 0, tone: 'B' },
        { string: 1, fret: 0, tone: 'E' },
        { string: 6, fret: 0, tone: 'E' }
      ],
      fingers: [2, 3, 0, 0, 0, 0],
      barres: []
    },
    theory: {
      chordTones: ['E', 'G', 'B'],
      tones: ['E', 'B', 'E', 'G', 'B', 'E'],
      intervals: ['R', '5', 'R', 'b3', '5', 'R'],
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
    name: 'F Major',
    instrumentName: 'Guitar (Standard Tuning)',
    positions: {
      notes: [
        { string: 6, fret: 1, tone: 'F' },  // Barrè con il dito 1
        { string: 5, fret: 3, tone: 'C' },  // Dito 3
        { string: 4, fret: 3, tone: 'F' },  // Dito 4
        { string: 3, fret: 2, tone: 'A' },  // Dito 2
        { string: 2, fret: 1, tone: 'C' },  // Parte del barrè
        { string: 1, fret: 1, tone: 'F' }   // Parte del barrè
      ],
      fingers: [1, 3, 4, 2, 1, 1],  // 1 indica il barrè
      barres: [
        {
          fromString: 1,  // Prima corda
          toString: 6,    // Sesta corda
          fret: 1,        // Tasto del barrè
          finger: 1       // Dito che esegue il barrè
        }
      ]
    },
    theory: {
      chordTones: ['F', 'A', 'C'],
      tones: ['F', 'C', 'F', 'A', 'C', 'F'],
      intervals: ['R', '5', 'R', '3', '5', 'R'],
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
    name: 'Open G',
    positions: {
      notes: [
        { string: 3, fret: 2, tone: 'A' },
        { string: 2, fret: 3, tone: 'D' },
        { string: 1, fret: 1, tone: 'F' },
        { string: 5, fret: 0, muted: true },
        { string: 6, fret: 0, muted: true }
      ],
      fingers: [3, 4, 1, 0, 0, null],
      barres: []
    },
    theory: {
      tones: ['A', 'D', 'F'],
      intervals: ['5', 'R', 'm3'],
      chordTones: ['D', 'A', 'D'],
      formula: ['R','m3','5'],
      description: 'Open G chord',
    },
    display: {
      labelType: 'tone',
      showFretNumbers: true,
      showStringNames: true
    },
    tuning: ['E', 'A', 'D', 'G', 'B', 'E']
  }
];

export function ChordTestPage() {
  const [testChordsState] = useState<ChordDiagramData[]>(testChords);
  const [selectedChord, setSelectedChord] = useState<ChordDiagramData>(testChords[0]);
  const [diagramSize, setDiagramSize] = useState({ width: 250, height: 350 }); // Aumentata l'altezza da 300 a 350
  const [labelType, setLabelType] = useState<'none' | 'finger' | 'tone' | 'interval'>('finger');
  const [customTuning, setCustomTuning] = useState<string[]>(['E', 'A', 'D', 'G', 'B', 'E']);
  const [showTuningEditor, setShowTuningEditor] = useState(false);
  const [numFrets, setNumFrets] = useState<number>(5); // Default to 5 frets
  const [showFretNumbers, setShowFretNumbers] = useState<boolean>(true);
  
  // Auto-detect number of strings from chord data
  const detectNumStrings = useCallback((chord: ChordDiagramData) => {
    if (!chord.positions.notes || chord.positions.notes.length === 0) return 6; // Default to 6 strings
    
    // Find the highest string number in the chord
    const maxString = Math.max(...chord.positions.notes.map(note => note.string));
    
    // Return the appropriate number of strings based on the highest string number
    if (maxString <= 4) return 4;
    if (maxString === 5) return 5;
    return 6; // Default to 6 strings
  }, []);
  
  const [numStrings, setNumStrings] = useState(() => detectNumStrings(testChords[0]));
  
  // Update numStrings when selected chord changes
  useEffect(() => {
    setNumStrings(detectNumStrings(selectedChord));
  }, [selectedChord, detectNumStrings]);


  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chord Diagram Tester</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="font-medium block mb-2">Select Chord:</label>
          <select
            value={testChordsState.findIndex(c => c.name === selectedChord.name)}
            onChange={(e) => setSelectedChord(testChordsState[parseInt(e.target.value)])}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          >
            {testChordsState.map((chord, index) => {
              const chordStrings = Math.max(...chord.positions.notes.map(n => n.string));
              const chordType = chordStrings <= 4 ? ' (4-string)' : chordStrings === 5 ? ' (5-string)' : ' (6-string)';
              return (
                <option key={`${chord.name}-${index}`} value={index}>
                  {chord.name}{chordType}
                </option>
              );
            })}
          </select>
        </div>
        
        <div>
          <label className="font-medium block mb-2">Number of Frets: {numFrets}</label>
          <input
            type="range"
            min="4"
            max="12"
            value={numFrets}
            onChange={(e) => setNumFrets(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>12</span>
          </div>
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
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  showFretNumbers ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <h3 className="text-lg font-medium mb-2">Label Type</h3>
          <div className="space-y-2 mb-4">
            {(['none', 'finger', 'tone', 'interval'] as const).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="labelType"
                  className="mr-2"
                  checked={labelType === type}
                  onChange={() => setLabelType(type)}
                />
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
              <input
                type="range"
                min="250"
                max="600"
                step="10"
                value={diagramSize.width}
                onChange={(e) => setDiagramSize(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm">{diagramSize.width}px</span>
            </div>
            <div>
              <label className="block mb-1">Height</label>
              <input
                type="range"
                min="300"
                max="800"
                step="10"
                value={diagramSize.height}
                onChange={(e) => setDiagramSize(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                className="w-full"
              />
              <span className="text-sm">{diagramSize.height}px</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Tuning</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">
                {customTuning.slice().reverse().join('  ')}
              </span>
              <button 
                onClick={() => setShowTuningEditor(!showTuningEditor)}
                className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
              >
                {showTuningEditor ? 'Chiudi' : 'Modifica'}
              </button>
            </div>
            
            {showTuningEditor && (
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(numStrings)].map((_, i) => (
                    <select
                      key={i}
                      value={customTuning[numStrings - 1 - i]}
                      onChange={(e) => {
                        const newTuning = [...customTuning];
                        newTuning[numStrings - 1 - i] = e.target.value;
                        setCustomTuning(newTuning);
                      }}
                      className="p-1 border rounded text-center"
                    >
                      {['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'].map((note) => (
                        <option key={note} value={note}>{note}</option>
                      ))}
                    </select>
                  ))}
                </div>
                <button 
                  onClick={() => setCustomTuning(
                    numStrings === 6 ? ['E', 'A', 'D', 'G', 'B', 'E'] :
                    numStrings === 5 ? ['B', 'E', 'A', 'D', 'G'] :
                    ['E', 'A', 'D', 'G']
                  )}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Reimposta accordatura standard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <ChordDiagram
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
    </div>
  );
}

export default ChordTestPage;
