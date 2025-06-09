import React from 'react';
import type { ChordDiagramData } from '../types';



interface ChordInfoProps {
  name: string;
  instrumentLabel?: string;
  intervals: string[];
  playedNotes: string[];
  showFormula: boolean;
  className?: string;
  instrument?: string;
  tuning?: string[];
  showInstrument?: boolean;
  showTuning?: boolean;
  showChordTones?: boolean;
  showIntervals?: boolean;
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
  showInstrument = true,
  showTuning = true,
  showChordTones = true,
  showIntervals = true,
}) => {
  // No need for complex data processing since we receive the data directly
  
  return (
    <div className={`chord-info ${className} flex flex-col pb-6`}>
      {/* Nome accordo e strumento */}
      <h2 className="text-2xl font-bold text-left mt-4 mb-3 whitespace-nowrap">{name}</h2>
      {/* Instrument row */}
      {showInstrument && instrument && (
        <div className="flex justify-start items-baseline mb-2 w-full">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Instrument:</span>
          <span className="inline-block text-gray-700 text-xs font-medium">{instrument}</span>
        </div>
      )}
      {/* Tuning row */}
      {showTuning && tuning && tuning.length > 0 && (
        <div className="flex flex-row items-baseline justify-start w-full mb-2">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Tuning:</span>
          {tuning.map((note, i) => (
            <span key={`tuning-note-${i}`} className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 mr-1">
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
      {showChordTones && playedNotes.length > 0 && (
        <div className="mb-2">
          <div className="space-x-2 whitespace-nowrap flex items-baseline justify-start w-full">
            <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300">Chord tones:</span>
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
      {showIntervals && showFormula && intervals.length > 0 && (
        <div className="mb-2">
          <div className="space-x-2 whitespace-nowrap flex items-baseline justify-start w-full">
            <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300">Intervals:</span>
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