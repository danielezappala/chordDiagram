# music-chords-diagrams

[![CI on dev](https://github.com/danielezappala/chordDiagram/actions/workflows/ci-dev.yml/badge.svg?branch=dev)](https://github.com/danielezappala/chordDiagram/actions/workflows/ci-dev.yml)
[![Auto PR dev→main](https://github.com/danielezappala/chordDiagram/actions/workflows/create_pr_to_main.yml/badge.svg?branch=dev)](https://github.com/danielezappala/chordDiagram/actions/workflows/create_pr_to_main.yml)
[![Deploy Test App](https://github.com/danielezappala/chordDiagram/actions/workflows/deploy-demo.yml/badge.svg?branch=main)](https://github.com/danielezappala/chordDiagram/actions/workflows/deploy-demo.yml)
[![Publish to npm](https://github.com/danielezappala/chordDiagram/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/danielezappala/chordDiagram/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/music-chords-diagrams?label=npm)](https://www.npmjs.com/package/music-chords-diagrams)
[![npm downloads](https://img.shields.io/npm/dm/music-chords-diagrams.svg)](https://www.npmjs.com/package/music-chords-diagrams)

A customizable and interactive React library for rendering chord diagrams for guitar, bass, ukulele, and other stringed instruments. Built with TypeScript, Tailwind CSS, and Framer Motion.

---

## Features

- 🎸 Render beautiful, responsive chord diagrams
- 🎨 Customizable appearance with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 🏷️ Customizable info, sizes, and label

---

## Installation

```bash
npm install music-chords-diagrams
# or
yarn add music-chords-diagrams
```

**Peer dependencies:**
- react (>=18)
- react-dom (>=18)
- framer-motion (>=7)
- tailwindcss (optional, for custom styles)

---

## Quick Start

```tsx
import { ChordDiagram } from 'music-chords-diagrams';
import 'music-chords-diagrams/dist/style.css';

// Minimal example - see "Chord Data Format" for full options
const chordData = {
  name: 'C Major',
  positions: [{
    baseFret: 1,
    notes: [
      { position: { string: 6, fret: -1 } }, // muted string
      { position: { string: 5, fret: 3 } },
      { position: { string: 4, fret: 2 } },
      { position: { string: 3, fret: 0 } },
      { position: { string: 2, fret: 1 } },
      { position: { string: 1, fret: 0 } }
    ],
    barres: []
  }]
};

export default function App() {
  return <ChordDiagram data={chordData} />;
}
```

---

## Chord Data Format

The `ChordDiagram` component expects a data object with this structure:

```js
{
  name: "C Major (Open)",
  instrument: "guitar",
  theory: { chordTones: ["C", "E", "G"], formula: "R 3 5" },
  display: { labelType: "finger", showFretNumbers: true, showStringNames: true },
  positions: [
    {
      baseFret: 1,
      notes: [
        { position: { string: 6, fret: -1 }, annotation: { finger: null, tone: null, interval: null } },
        { position: { string: 5, fret: 3 }, annotation: { finger: 3, tone: "C", interval: "R" } },
        { position: { string: 4, fret: 2 }, annotation: { finger: 2, tone: "E", interval: "3" } },
        { position: { string: 3, fret: 0 }, annotation: { finger: "O", tone: "G", interval: "5" } },
        { position: { string: 2, fret: 1 }, annotation: { finger: 1, tone: "C", interval: "R" } },
        { position: { string: 1, fret: 0 }, annotation: { finger: "O", tone: "E", interval: "3" } }
      ],
      barres: []
    }
  ],
  tuning: ["E", "A", "D", "G", "B", "E"]
}
```

- **name**: Chord name (string, required)
- **positions**: Array of positions (at least one required)
  - **baseFret**: Fret number shown at the top of the diagram
  - **notes**: Array of note objects, one per string
    - **position.string**: String number (1 = highest pitch)
    - **position.fret**: Fret number (`-1` for muted, `0` for open)
    - **annotation**: (optional) `{ finger, tone, interval }`
  - **barres**: (optional) Array of barre objects `{ fret, fromString, toString, finger }`
- **instrument**: (optional) Instrument name
- **theory**: (optional) Chord tones and formula
- **display**: (optional) Display preferences
- **tuning**: (optional) Array of string notes, lowest to highest

---

## API Overview

- `<ChordDiagram />` is the main component. Pass your chord data as the `data` prop.
- The main API is the `<ChordDiagram />` React component, which takes a chord data object as shown above.
- For advanced usage, TypeScript type definitions are available in `src/types.ts`.
- Supports custom tunings, multiple positions, fingerings, intervals, and more.

---

## Contributing

We welcome contributions! To get started:

1. Fork this repository and clone it locally.
2. Install dependencies: `npm install`
3. Run tests: `npm run test`
4. Build the library: `npm run build`
5. Lint your code: `npm run lint`
6. Open a Pull Request targeting the `dev` branch.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## License

MIT


### ChordDiagram Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChordDiagramData` | (required) | The main data object for the chord. See "Data Conventions" and `src/types.ts` for the new v2 structure. Key changes: `data.positions` is now an array, each with `baseFret`, `notes` (as `PositionedNote[]`), and `barres`. |
| `positionIndex` | `number` | `0` | Index of the position in `data.positions` to display. |
| `labelType` | `'none' \| 'finger' \| 'tone' \| 'interval'` | `'finger'` | Type of label to display on notes. Overrides `data.display.labelType`. |
| `showFretNumbers` | `boolean` | `true` | Whether to display fret numbers. If `false` and the position's `baseFret > 1`, the `baseFret` value is still shown. Overrides `data.display.showFretNumbers`. |
| `fretNumberPosition` | `'left' \| 'right' \| 'none'` | `'left'` | Position of fret numbers. Overrides `data.display.fretNumberPosition`. |
| `showStringNames` | `boolean` | `true` | Whether to display string names/tuning notes below the diagram. Overrides `data.display.showStringNames`. (NB: The tuning notes are also shown as badges under the chord name in the info area.) |
| `numStrings` | `number` | (derived) | Override for the number of strings. If not provided, derived from `data.tuning` or `data.positions[positionIndex].notes`. |
| `numFrets` | `number` | `5` | Number of frets to draw on the diagram. |
| `tuning` | `string[]` | (derived) | Override for instrument tuning (array of notes from lowest to highest pitch string). If not provided, derived from `data.tuning`. Displayed as badges in a single row below the chord name with label `Tuning:`. |
| `width` | `number` | `250` | Width of the diagram in pixels. |
| `height` | `number` | `300` | Height of the diagram in pixels. |
| `onNoteClick`    | `(note: PositionedNote, posData: ChordPositionData, event: MouseEvent) => void` | `undefined` | Callback for when a note (dot) is clicked.                                  |
| `onBarreClick`   | `(barre: Barre, posData: ChordPositionData, event: MouseEvent) => void`       | `undefined` | Callback for when a barre is clicked.                                       |
| `style`          | `React.CSSProperties`                                                         | `undefined` | Custom inline styles for the main container.                                |
| `className` | `string` | `''` | Additional CSS class names for the main SVG container. |

---

## Chord Info Display

By default, the chord info area below the diagram shows:
- The chord name (large)
- The instrument (if provided), as a badge
- The tuning (as a row of badges for each string), labeled `Tuning:`

Example:
```
C Major (Open)
Instrument: [guitar]
Tuning: [E] [A] [D] [G] [B] [E]
```

## Data Conventions (v2 Structure)

The `ChordDiagramData` v2 structure provides more flexibility. Refer to `src/types.ts` for complete definitions.

### Core Concepts:
*   **`ChordDiagramData`**: The main object. Contains `name`, an array of `positions`, optional global `theory`, `tuning`, and `display` settings.
*   **`ChordPositionData`**: Each element in `ChordDiagramData.positions`. Represents a specific voicing or fingering. Contains:
    *   `baseFret: number`: The fret number displayed at the top of this position's diagram (e.g., 1 for open, 3 if starting at 3rd fret).
    *   `notes: PositionedNote[]`: Array of notes for this position.
    *   `barres?: Barre[]`: Optional array of barres for this position.
*   **`PositionedNote`**: Defines a note on the fretboard.
    *   `position: FretPosition`: Specifies the string and fret.
        *   `string: number`: String number (1 is highest pitch, e.g., high E on guitar).
        *   `fret: number`: Absolute fret number. `0` for open string, `-1` for a muted/unplayed string (will be marked 'X').
    *   `annotation?: NoteAnnotation`: Optional details about the note.
        *   `finger?: FingerDesignator`: Finger to use (e.g., `1`, `'T'`, `'P'`). Can also be `'O'` (open) or `'X'` (muted/not played in fingering context). `null` for unspecified.
        *   `tone?: string`: e.g., 'C', 'Db'.
        *   `interval?: string`: e.g., 'R', 'm3', 'P5'.
        *   `degree?: string`: e.g., '1', 'b3'.
        *   `highlight?: boolean`.
*   **`FingerDesignator`**: A type for finger assignments: `1 | 2 | 3 | 4 | 'T' | 'P' | 'O' | 'X' | null`.
*   **`Barre`**: Defines a barre chord.
    *   `fromString: number`: Highest pitch string number (e.g., 1 for High E).
    *   `toString: number`: Lowest pitch string number (e.g., 6 for Low E).
    *   `fret: number`: Absolute fret where barre is placed.
    *   `finger?: Finger`: Finger used for the barre.
*   **`Tuning`**: Can be a `Tuning` object (`{ name: string; notes: string[] }`) or a simple `string[]` of note names.
    *   `notes: string[]`: Open string notes, ordered from **lowest pitch string to highest pitch string** (e.g., `['E', 'A', 'D', 'G', 'B', 'E']` for standard guitar).

### String Numbering
*   **String 1:** Represents the string with the highest pitch (e.g., high 'E' on a standard guitar). Rendered as the **rightmost** string.
*   **String N:** Represents the string with the lowest pitch (e.g., low 'E' on a 6-string guitar, N=6). Rendered as the **leftmost** string.
This convention applies to `FretPosition.string` and `Barre.fromString/toString`.

### Fret Numbering and `baseFret`
*   `FretPosition.fret` is always the **absolute fret number** on the neck (`0` for open, `-1` for muted/unplayed).
*   `ChordPositionData.baseFret` determines the fret shown at the top of the diagram for that specific position.
*   **Fret Number Display**: If `showFretNumbers` is true (or conditionally for `baseFret > 1`), displayed numbers correspond to actual fret numbers, starting with `baseFret`.

## Types

```typescript
type NotePosition = { ... }; // V1 type, deprecated
type Barre = { ... }; // V1 type, deprecated
```
The type definitions have been significantly refactored in v2. Please refer to `src/types.ts` for the new `ChordDiagramData`, `ChordPositionData`, `PositionedNote`, `FretPosition`, `NoteAnnotation`, `Barre` (v2), and `Tuning` types.

## Importing Styles

The library includes a base stylesheet that you'll need to import for default styling. How you import it depends on your project setup:

**Using a bundler (like Vite, Webpack with CSS loaders):**
```javascript
// In your main application file (e.g., App.tsx or main.tsx)
import 'chord-diagram-library/dist/style.css';
```

**Using a traditional CSS include:**
If you're not using a bundler that handles CSS imports in JavaScript, you might need to include the CSS file via a `<link>` tag in your HTML:
```html
<link rel="stylesheet" href="node_modules/chord-diagram-library/dist/style.css">
```
(Adjust path as necessary depending on how `node_modules` are served).
