import React, { useMemo } from 'react'; // Added useMemo
import type { ChordDiagramData, ChordPositionData } from '../types';



interface ChordInfoProps {
  data: ChordDiagramData; // This is now ChordDiagramData v2
  className?: string;
  positionIndex?: number; // Optional: to specify which position's info to show, defaults to 0
  instrument?: string;
  tuning?: string[];
}

// Mappa degli stili per ogni tipo di intervallo
const getIntervalStyle = (interval: string) => {
  const styleMap: Record<string, { bg: string; text: string; shape: string }> = {
    'R': { bg: 'bg-red-100', text: 'text-red-700', shape: 'rounded-full' },
    'b2': { bg: 'bg-orange-100', text: 'text-orange-700', shape: 'rounded' },
    '2': { bg: 'bg-orange-100', text: 'text-orange-700', shape: 'rounded' },
    'b3': { bg: 'bg-yellow-100', text: 'text-yellow-700', shape: 'rounded' },
    '3': { bg: 'bg-yellow-100', text: 'text-yellow-700', shape: 'rounded' },
    '4': { bg: 'bg-green-100', text: 'text-green-700', shape: 'rounded' },
    'b5': { bg: 'bg-blue-100', text: 'text-blue-700', shape: 'rounded' },
    '5': { bg: 'bg-blue-100', text: 'text-blue-700', shape: 'rounded' },
    '#5': { bg: 'bg-blue-100', text: 'text-blue-700', shape: 'rounded' },
    'b6': { bg: 'bg-indigo-100', text: 'text-indigo-700', shape: 'rounded' },
    '6': { bg: 'bg-indigo-100', text: 'text-indigo-700', shape: 'rounded' },
    'bb7': { bg: 'bg-purple-100', text: 'text-purple-700', shape: 'rounded' },
    'b7': { bg: 'bg-purple-100', text: 'text-purple-700', shape: 'rounded' },
    '7': { bg: 'bg-purple-100', text: 'text-purple-700', shape: 'rounded' },
    'maj7': { bg: 'bg-purple-100', text: 'text-purple-700', shape: 'rounded' },
    'b9': { bg: 'bg-pink-100', text: 'text-pink-700', shape: 'rounded' },
    '9': { bg: 'bg-pink-100', text: 'text-pink-700', shape: 'rounded' },
    '#9': { bg: 'bg-pink-100', text: 'text-pink-700', shape: 'rounded' },
    '11': { bg: 'bg-amber-100', text: 'text-amber-700', shape: 'rounded' },
    '#11': { bg: 'bg-amber-100', text: 'text-amber-700', shape: 'rounded' },
    'b13': { bg: 'bg-teal-100', text: 'text-teal-700', shape: 'rounded' },
    '13': { bg: 'bg-teal-100', text: 'text-teal-700', shape: 'rounded' },
  };

  return styleMap[interval] || { bg: 'bg-gray-100', text: 'text-gray-700', shape: 'rounded' };
};

interface ChordInfoProps {
  name: string;
  instrumentLabel?: string;
  intervals: string[];
  playedNotes: string[];
  showFormula: boolean;
  className?: string;
  instrument?: string;
  tuning?: string[];
}

const ChordInfo: React.FC<ChordInfoProps> = ({ 
  name,
  instrumentLabel = '',
  intervals = [],
  playedNotes = [],
  showFormula = true,
  className = '',
  instrument,
  tuning,
}) => {
  // No need for complex data processing since we receive the data directly
  
  return (
    <div className={`chord-info ${className} flex flex-col items-center pb-6`}>
      {/* Nome accordo e strumento */}
      <h2 className="text-2xl font-bold text-center my-2 whitespace-nowrap">{name}</h2>
      {/* Instrument row */}
      {instrument && (
        <div className="text-center mb-1">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Instrument:</span>
          <span className="inline-block text-gray-700 text-sm font-medium">{instrument}</span>
        </div>
      )}
      {/* Tuning row */}
      {tuning && tuning.length > 0 && (
        <div className="flex flex-row items-center justify-center text-center">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Tuning:</span>
          {tuning.map((note, i) => (
            <span key={i} className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 mr-1">
              {note}
            </span>
          ))}
        </div>
      )}

      {instrumentLabel && instrumentLabel.trim() !== '' && (
        <div className="text-gray-600 text-center text-sm mb-2">
          {instrumentLabel}
        </div>
      )}
      
      {/* Played Notes */}
      {playedNotes.length > 0 && (
        <div className="mt-2">
          <div className="text-center space-x-2 whitespace-nowrap flex items-center justify-center">
            <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Chord tones:</span>
            {playedNotes.map((tone, i) => (
              <span 
                key={`played-note-${i}`} 
                className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
              >
                {tone}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Formula */}
      {showFormula && intervals.length > 0 && (
        <div className="mt-2">
          <div className="text-center space-x-2 whitespace-nowrap flex items-center justify-center">
            <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Intervals:</span>
            {intervals.map((interval, i) => (
              <span 
                key={`formula-${i}`}
                className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200"
                title={`${interval} (${interval === 'R' ? 'Root' : `Interval ${interval}`})`}
              >
                {interval}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MemoizedChordInfo = React.memo(ChordInfo);
export { MemoizedChordInfo as ChordInfo };
export default MemoizedChordInfo;