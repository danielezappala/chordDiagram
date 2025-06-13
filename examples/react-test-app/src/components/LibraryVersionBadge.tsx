// LibraryVersionBadge.tsx
import React from 'react';

export const LibraryVersionBadge: React.FC = () => (
  <a
    href="https://www.npmjs.com/package/music-chords-diagrams"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-block',
      padding: '0.25em 0.7em',
      borderRadius: '1em',
      background: '#059669',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.95em',
      marginLeft: '0.5em',
      letterSpacing: '0.03em',
      textDecoration: 'none'
    }}
    title="Vai alla pagina npm della libreria"
  >
    <img
      src="https://img.shields.io/npm/v/music-chords-diagrams?label=lib"
      alt="Libreria npm version"
      style={{ verticalAlign: 'middle', height: '1.25em', marginRight: '0.3em' }}
    />
    <span style={{ verticalAlign: 'middle' }}>music-chords-diagrams</span>
  </a>
);
