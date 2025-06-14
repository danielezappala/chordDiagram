// LibraryVersionBadge.tsx
import React from 'react';

export const LibraryVersionBadge: React.FC = () => (
  <a
    href="https://www.npmjs.com/package/music-chords-diagrams"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.15em 0.5em',
      borderRadius: '1em',
      background: '#059669',
      color: 'white',
      fontWeight: 500,
      fontSize: '0.92em',
      marginLeft: '0.5em',
      letterSpacing: '0.02em',
      textDecoration: 'none',
      lineHeight: 1.2
    }}
    title="Vai alla pagina npm della libreria"
  >
    <img
      src="https://img.shields.io/npm/v/music-chords-diagrams?label=lib"
      alt="Libreria npm version"
      style={{ verticalAlign: 'middle', height: '1.15em', marginRight: '0.3em' }}
    />
    <span style={{ verticalAlign: 'middle' }}>music-chords-diagrams</span>
  </a>
);
