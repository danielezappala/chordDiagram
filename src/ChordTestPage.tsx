import React, { useState, useCallback, useEffect } from 'react';
import ReactJson from 'react-json-view';
import type { ChangeEvent } from 'react';
import ChordDiagram from './components/ChordDiagram';
import type { ChordDiagramData } from './types';
import chordExamples from './data/chord_examples.json';


const ChordTestPage = (): JSX.Element => {
  const [selectedChord, setSelectedChord] = useState<ChordDiagramData>((chordExamples as ChordDiagramData[])[0]);
  // Stato per JSON editor
  const [jsonEditorData, setJsonEditorData] = useState<ChordDiagramData>((chordExamples as ChordDiagramData[])[0]);
  const [labelType, setLabelType] = useState<'none' | 'finger' | 'tone' | 'interval'>('finger');
  const [numFrets, ] = useState<number>(5);
  const [showFretNumbers, setShowFretNumbers] = useState<boolean>(true);
  const [chordInfoVisibility, setChordInfoVisibility] = useState({
    showInstrument: true,
    showTuning: true,
    showChordTones: true,
    showIntervals: true,
  });
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

  const handleToggleChordInfoVisibility = (key: keyof typeof chordInfoVisibility) => {
    setChordInfoVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const detectNumStrings = useCallback((chord: ChordDiagramData | undefined | null): number => {
    if (!chord || !chord.positions || chord.positions.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
        (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const currentPositionNotes: Array<{ position: { string: number } }> = chord.positions[0].notes;
    if (!currentPositionNotes || currentPositionNotes.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
        (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    const validNotes = currentPositionNotes.filter((note: { position: { string: number } }) => typeof note.position.string === 'number');
    if (validNotes.length === 0) {
      return chord?.tuning && typeof chord.tuning === 'object' && 'notes' in chord.tuning ? chord.tuning.notes.length :
        (Array.isArray(chord?.tuning) ? chord.tuning.length : 6);
    }
    return Math.max(...validNotes.map((note: { position: { string: number } }) => note.position.string));
  }, []);

  const [numStrings, setNumStrings] = useState(() => detectNumStrings((chordExamples as ChordDiagramData[])[0]));

  useEffect(() => {
    if (selectedChord) {
      const newNumStrings = detectNumStrings(selectedChord);
      setNumStrings(newNumStrings);
    }
  }, [selectedChord, detectNumStrings]);

  const handleChordChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(event.target.value, 10);
    const chord = (chordExamples as ChordDiagramData[])[selectedIndex];
    if (chord) {
      setSelectedChord(chord);
      setJsonEditorData(chord); // Aggiorna anche l'editor JSON
    }
  };

  if (!selectedChord) {
    return <div>No chord selected or no chords available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-3xl font-extrabold mb-8 text-center">Chord Diagram Tester</h1>

      {/* Main layout using CSS Grid: Left UI (2/4) | Diagram (1/4) | Raw Data (1/4) --> total 4 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch h-full">

        {/* Left Section: All UI Controls (Chord Settings, Display & Tuning) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 lg:col-span-2 h-full">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Chord & Fret</h3>
              <div className="mb-6">
                <label htmlFor="chord-select" className="font-medium block mb-2">Select Chord:</label>
                <select
                  id="chord-select"
                  value={(chordExamples as ChordDiagramData[]).findIndex(c => c.name === selectedChord.name && JSON.stringify(c.positions) === JSON.stringify(selectedChord.positions))}
                  onChange={handleChordChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                >
                  {(chordExamples as ChordDiagramData[]).map((chord, index) => (
                    <option key={`${chord.name}-${index}`} value={index}>
                      {chord.name}{chord.instrument ? ` (${chord.instrument})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                
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

              {/* Moved Note Label Type Here */}
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
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Display Options</h3>
              {/* Note Label Type was here, now moved to the first column */}

              <div className="mb-6">
                <h4 className="font-medium mb-2">Chord Info Details</h4>
                <div className="flex flex-col gap-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-inner">
                  {(Object.keys(chordInfoVisibility) as Array<keyof typeof chordInfoVisibility>).map((key) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={chordInfoVisibility[key]}
                        onChange={() => handleToggleChordInfoVisibility(key)}
                        className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="font-medium">{key.replace('show', '')}</span>
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

              {/* Tuning UI section removed as per request - Lines 326-367 */}
            </div>
          </div>
        </div>

        {/* Center Section: Chord Diagram (Occupies 1 column) */}
        <div className="flex flex-col justify-start items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 lg:col-span-1 min-h-[350px] h-full">
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
              key={JSON.stringify(jsonEditorData) + numStrings + numFrets + labelType + showFretNumbers + JSON.stringify(bottomLabels) + (Array.isArray(jsonEditorData.tuning) ? jsonEditorData.tuning.join(',') : (typeof jsonEditorData.tuning === 'object' && jsonEditorData.tuning && 'notes' in jsonEditorData.tuning && Array.isArray(jsonEditorData.tuning.notes) ? jsonEditorData.tuning.notes.join(',') : ''))}
              data={jsonEditorData}
              width={300}
              height={700}
              labelType={labelType}
              showFretNumbers={showFretNumbers}
              bottomLabels={bottomLabels}
              chordInfoVisibility={chordInfoVisibility}
              className=""
              onCopyJson={(json) => {
                navigator.clipboard.writeText(JSON.stringify(json, null, 2));
                alert('JSON copiato negli appunti!');
              }}
            />
          </div>
        </div>
        {/* Right Section: Raw Data (Occupies 1 column) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 lg:col-span-1 overflow-auto max-h-[calc(100vh-12rem)] relative h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Raw Chord Data</h2>
          </div>
          <ReactJson
            src={jsonEditorData}
            onEdit={(e: { updated_src?: unknown }) => {
              if (e.updated_src && typeof e.updated_src === 'object') {
                setJsonEditorData(e.updated_src as ChordDiagramData);
                setSelectedChord(e.updated_src as ChordDiagramData);
              }
            }}
            onAdd={(e: { updated_src?: unknown }) => {
              if (e.updated_src && typeof e.updated_src === 'object') {
                setJsonEditorData(e.updated_src as ChordDiagramData);
                setSelectedChord(e.updated_src as ChordDiagramData);
              }
            }}
            onDelete={(e: { updated_src?: unknown }) => {
              if (e.updated_src && typeof e.updated_src === 'object') {
                setJsonEditorData(e.updated_src as ChordDiagramData);
                setSelectedChord(e.updated_src as ChordDiagramData);
              }
            }}
            name={false}
            collapsed={false}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{ fontSize: '14px', background: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
};
export default ChordTestPage;