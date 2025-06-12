import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChordDiagram from './ChordDiagram';

describe('ChordDiagram', () => {
  it('renders without crashing', () => {
    render(<ChordDiagram data={{
      name: 'Test Chord',
      positions: [
        {
          baseFret: 1,
          notes: [],
          barres: []
        }
      ]
    }} />);
    expect(screen.getByTestId('chord-diagram')).toBeInTheDocument();
  });
});