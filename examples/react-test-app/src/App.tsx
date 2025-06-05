// Optional: import './App.css'; if you have specific app styles
import { ChordDiagram } from 'chord-diagram-library';
import type { ChordDiagramData } from 'chord-diagram-library';
import 'chord-diagram-library/style.css'; // Correct CSS import path

const cMajorData: ChordDiagramData = {
  name: 'C Major (Open)',
  instrument: 'guitar',
  positions: [
    {
      baseFret: 1,
      notes: [
        { position: { string: 6, fret: -1 }, annotation: { finger: 'X' } },
        { position: { string: 5, fret: 3 }, annotation: { finger: 3, tone: 'C', interval: 'R' } },
        { position: { string: 4, fret: 2 }, annotation: { finger: 2, tone: 'E', interval: '3' } },
        { position: { string: 3, fret: 0 }, annotation: { finger: 'O', tone: 'G', interval: '5' } },
        { position: { string: 2, fret: 1 }, annotation: { finger: 1, tone: 'C', interval: 'R' } },
        { position: { string: 1, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: '3' } }
      ],
      barres: []
    }
  ],
  theory: { chordTones: ['C', 'E', 'G'], formula: 'R 3 5' },
  display: { labelType: 'finger', showFretNumbers: true, showStringNames: true },
  tuning: {
    name: 'Standard Guitar',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'] // Low E to High E
  }
};

function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', padding: 40 }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 32, minWidth: 340, maxWidth: 420, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#1e293b', letterSpacing: 0.5 }}>Chord Diagram Test App</h1>
        <p style={{ color: '#64748b', marginBottom: 24, fontSize: 16 }}>Visualizza e personalizza i tuoi accordi in modo moderno!</p>
        <ChordDiagram
          data={cMajorData}
          width={260}
          height={320}
        />
      </div>
    </div>
  );
}

export default App;
