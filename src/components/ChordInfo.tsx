import React, { useMemo } from 'react'; // Added useMemo
// import type { ChordDiagramData } from '../types'; // This line is duplicated below
import type { ChordDiagramData, ChordPositionData } from '../types';

interface ChordInfoProps {
  data: ChordDiagramData; // This is now ChordDiagramData v2
  className?: string;
  positionIndex?: number; // Optional: to specify which position's info to show, defaults to 0
}

const ChordInfo: React.FC<ChordInfoProps> = ({ data, className = '', positionIndex = 0 }) => {
  const { name, theory, instrumentName } = data; // instrumentName was called instrument before

  // Select the current position to display, defaulting to the first one
  const currentPosition: ChordPositionData | null =
    data.positions && data.positions.length > positionIndex
      ? data.positions[positionIndex]
      : null;
  
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

  // Estrai la formula e crea gli elementi con le forme
  const hasFormula = theory?.formula && 
    (Array.isArray(theory.formula) 
      ? theory.formula.length > 0 
      : typeof theory.formula === 'string' && theory.formula.length > 0);
      
  const formulaParts = hasFormula && theory?.formula
    ? (Array.isArray(theory.formula) 
        ? theory.formula 
        : theory.formula.split('-'))
    : [];
  
  const instrument = instrumentName || ''; // Use the destructured instrumentName
  const showFormula = formulaParts.length > 0;
  
  const playedNotes = useMemo(() => {
    if (!currentPosition || !currentPosition.notes) {
      return [];
    }
    const tones: string[] = [];
    for (const pn of currentPosition.notes) {
      // Ensure all parts exist and tone is a non-empty string
      if (pn &&
          pn.position &&
          pn.position.fret !== -1 && // Note is not muted
          pn.annotation &&
          typeof pn.annotation.tone === 'string' &&
          pn.annotation.tone.length > 0) {
        if (!tones.includes(pn.annotation.tone)) {
          tones.push(pn.annotation.tone);
        }
      }
    }
    return tones;
  }, [currentPosition]);

  return (
    <div className={`chord-info ${className} flex flex-col items-center`}>


      {/* Nome accordo e strumento */}
      <h2 className="text-2xl font-bold text-center my-2">{name}</h2>
      
      {instrument && instrument.trim() !== '' && (
        <div className="text-gray-600 text-center text-sm mb-2">
          {instrument}
        </div>
      )}

      {/* Played Notes - Display unique tones from the current position */}
      {playedNotes.length > 0 && (
        <div className="mt-2">
          <div className="text-center space-x-2">
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
      
      {showFormula && (
        <div className="mt-4 flex justify-center items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2">
            {formulaParts.map((interval, i) => {
              const { bg, text, shape } = getIntervalStyle(interval);
              return (
                <span 
                  key={`formula-${i}`}
                  className={`flex items-center justify-center w-8 h-8 ${bg} ${text} ${shape} font-bold text-sm shadow-sm`}
                  title={`${interval} (${interval === 'R' ? 'Root' : `Interval ${interval}`})`}
                >
                  {interval}
                </span>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export { ChordInfo };
export default ChordInfo;
