import React from 'react';
import { DEFAULT_WIDTH } from '../types';

export interface InfoLayerProps {
  name?: string;
  tones?: string[];
  intervals?: string[];
  width?: number;
  height?: number;
  className?: string;
}

export const InfoLayer: React.FC<InfoLayerProps> = ({
  name,
  tones = [],
  intervals = [],
  width = DEFAULT_WIDTH,
  height = 30,
  className = '',
}) => {
  const hasInfo = name || tones.length > 0 || intervals.length > 0;
  
  if (!hasInfo) return null;

  return (
    <foreignObject 
      x={0} 
      y={-height} 
      width={width} 
      height={height}
      className={`info-layer ${className}`}
    >
      <div className="text-center">
        {name && (
          <div className="text-base font-bold">{name}</div>
        )}
        {tones.length > 0 && (
          <div className="text-sm font-medium opacity-90">{tones.join(' ')}</div>
        )}
        {intervals.length > 0 && (
          <div className="text-sm opacity-80">{intervals.join(' ')}</div>
        )}
      </div>
    </foreignObject>
  );
};

export default InfoLayer;
