// VersionBadge.tsx
import React from 'react';
import pkg from '../../package.json';

export const VersionBadge: React.FC = () => (
  <span
    style={{
      display: 'inline-block',
      padding: '0.25em 0.7em',
      borderRadius: '1em',
      background: '#2563eb',
      color: 'white',
      fontWeight: 600,
      fontSize: '0.95em',
      marginLeft: '0.5em',
      letterSpacing: '0.03em'
    }}
    title={`Test App Version: v${pkg.version}`}
  >
    v{pkg.version}
  </span>
);
