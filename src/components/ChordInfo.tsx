import React from 'react';
import type { ChordDiagramData } from '../types';



interface ChordInfoProps {
  data: ChordDiagramData; // This is now ChordDiagramData v2
  className?: string;
  positionIndex?: number; // Optional: to specify which position's info to show, defaults to 0
  instrument?: string;
  tuning?: string[];
}



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
    <div className={`chord-info ${className} flex flex-col pb-6`}>
      {/* Nome accordo e strumento */}
      <h2 className="text-2xl font-bold text-left my-2 whitespace-nowrap">{name}</h2>
      {/* Instrument row */}
      {instrument && (
        <div className="flex justify-start items-center mb-1 w-full">
          <span className="inline-block px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 mr-2">Instrument:</span>
          <span className="inline-block text-gray-700 text-sm font-medium">{instrument}</span>
        </div>
      )}
      {/* Tuning row */}
      {tuning && tuning.length > 0 && (
        <div className="flex flex-row items-center justify-start w-full">
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
          <div className="space-x-2 whitespace-nowrap flex items-center justify-start w-full">
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
      {showFormula && intervals.length > 0 && (
        <div className="mt-2">
          <div className="space-x-2 whitespace-nowrap flex items-center justify-start w-full">
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