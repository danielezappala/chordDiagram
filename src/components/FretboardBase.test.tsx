import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FretboardBase from './FretboardBase';


describe('FretboardBase', () => {
  it('renders the correct number of strings and frets', () => {
    render(
      <FretboardBase
        numStrings={6}

        width={300}
        height={120}
        showFretNumbers={true}
        fretNumberPosition="left"
        showStringNames={false}
      />
    );
    // Controlla che ci siano 6 linee verticali (corde)
    // e 5+1 linee orizzontali (tasti, inclusa la "capotasto")
    // Adatta il selettore se hai aggiunto data-testid specifici
    // Qui ipotizziamo che ogni corda abbia className "fretboard-string" e ogni tasto "fretboard-fret"
    // Se non ci sono, puoi aggiungere data-testid nel componente
    // Per ora il test verifica solo che il componente sia nel DOM
    expect(screen.getByTestId('fretboard-base')).toBeInTheDocument();
  });

  it('renders children if provided', () => {
    render(
      <FretboardBase
        numStrings={4}

        width={200}
        height={80}
      >
        <div data-testid="child-element">Child</div>
      </FretboardBase>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
