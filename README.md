# Published on npm as `music-chords-diagrams` on date `2025-06-05`
## test workflow

# music-chords-diagrams

[![Deploy Test App](https://github.com/danielezappala/chordDiagram/actions/workflows/deploy-demo.yml/badge.svg?branch=main)](https://github.com/danielezappala/chordDiagram/actions/workflows/deploy-demo.yml)
[![CI on dev](https://github.com/danielezappala/chordDiagram/actions/workflows/ci-dev.yml/badge.svg?branch=dev)](https://github.com/danielezappala/chordDiagram/actions/workflows/ci-dev.yml)
[![npm version](https://img.shields.io/npm/v/music-chords-diagrams?label=npm)](https://www.npmjs.com/package/music-chords-diagrams)
[![npm downloads](https://img.shields.io/npm/dm/music-chords-diagrams.svg)](https://www.npmjs.com/package/music-chords-diagrams)

**Latest version published on npm: `0.1.0`**

A customizable and interactive React library for rendering chord diagrams for guitar, bass, ukulele, and other stringed instruments. Built with TypeScript, Tailwind CSS, and Framer Motion.
## Features

- 🎸 Render beautiful, responsive chord diagrams
- 🎨 Customizable appearance with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 🎮 Interactive editor for creating and editing chords
- 🌓 Dark mode support
- 📱 Touch and mouse support
- 🎨 Customizable colors, sizes, and labels

## Installation

### Peer Dependencies

This library requires the following peer dependencies in your project:

- react (>=18)
- react-dom (>=18)
- framer-motion (>=7)
- tailwindcss (optional, only if you want to customize styles)
- tailwindcss (if you want to customize styles, otherwise the built CSS is included)


```bash
npm install chord-diagram-library@beta
# or
yarn add chord-diagram-library@beta
```

> **Note:** Use `@beta` to install the latest published version if you want to test the latest features before the stable release.

Current version: `0.1.15` (beta)

---

## What’s New

---

## 🚀 Quick Start

```tsx
import React from "react";
import { ChordDiagram } from "music-chords-diagrams";

const chordData = {
  name: "C Major",
  positions: [
    {
      baseFret: 1,
      notes: [
        { position: { string: 6, fret: -1 } }, // Low E muted
        { position: { string: 5, fret: 3 } },
        { position: { string: 4, fret: 2 } },
        { position: { string: 3, fret: 0 } },
        { position: { string: 2, fret: 1 } },
        { position: { string: 1, fret: 0 } }
      ],
      barres: []
    }
  ]
};

export default function App() {
  return <ChordDiagram data={chordData} />;
}
```

---

## 🤝 Contributing

We welcome contributions! To get started:

1. **Fork** this repository and clone it locally.
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Run tests:**
   ```sh
   npm run test
   ```
4. **Build the library:**
   ```sh
   npm run build
   ```
5. **Lint your code:**
   ```sh
   npm run lint
   ```
6. **Open a Pull Request** targeting the `dev` branch.

### CI/CD Workflow

- Every push to `dev` triggers tests and build via GitHub Actions.
- If successful, an automated Pull Request from `dev` to `main` is created.
- Review and merge the PR to release new versions or trigger deploys.

---

- **Instrument and Tuning Info:**
  - The chord info area now displays the instrument name and tuning (as badge-style notes) directly under the chord name, if provided in the data or via props.
  - The tuning notes are shown in a single horizontal row with the label `Tuning:`.
- **Bottom Label Toggles & Badges:**
  - Bottom label rows (Fingers, Tones, Intervals) can be toggled on/off and are always synchronized with their left-side label badges.
  - Left-side badges for each bottom label row are styled consistently and aligned for clarity.
- **TypeScript & API:**
  - New props: `instrument` and `tuning` can be passed to `ChordInfo` and will be displayed if present.
  - `tuning` can be a `string[]` or derived from `ChordDiagramData`.

---

---

## Quick Start

1. **Install the library and peer dependencies:**
   ```bash
   npm install chord-diagram-library@beta react@^18 react-dom@^18 framer-motion@^7
   # tailwindcss only if you want to customize styles
   ```

2. **Importa il componente e il CSS:**
   ```tsx
   import { ChordDiagram } from 'chord-diagram-library';
   import type { ChordDiagramData } from 'chord-diagram-library';
   import 'chord-diagram-library/chord-diagram-library.css'; // Always import the CSS
   ```

3. **Usa il componente in React:**
   ```tsx
   // Example with instrument and tuning info
   import { ChordDiagram } from 'chord-diagram-library';
   import type { ChordDiagramData } from 'chord-diagram-library';

   const cMajorData: ChordDiagramData = {
     name: 'C Major (Open)',
     instrument: 'guitar',
     positions: [ /* ... */ ],
     tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
   };

   <ChordDiagram
     data={cMajorData}
     width={250}
     height={300}
   />
   // The diagram will show the instrument and tuning badges below the chord name.
   ```
   const cMajorData: ChordDiagramData = {
     name: 'C Major (Open)',
     instrument: 'guitar',
     positions: [
       {
         baseFret: 1,
         notes: [
           { position: { string: 6, fret: -1 }, annotation: { finger: 'X', tone: undefined, interval: undefined } },
           { position: { string: 5, fret: 3 }, annotation: { finger: 3, tone: 'C', interval: 'R' } },
           { position: { string: 4, fret: 2 }, annotation: { finger: 2, tone: 'E', interval: '3' } },
           { position: { string: 3, fret: 0 }, annotation: { finger: 'O', tone: 'G', interval: '5' } },
           { position: { string: 1, fret: 0 }, annotation: { finger: 'O', tone: 'E', interval: '3' } }
         ],
         barres: []
       }
     ],
     theory: { chordTones: ['C', 'E', 'G'], formula: 'R 3 5' },
     display: { labelType: 'finger', showFretNumbers: true, showStringNames: true },
     tuning: ['E', 'A', 'D', 'G', 'B', 'E']
   };
        { position: { string: 4, fret: 2 }, annotation: { tone: 'E', finger: '2' } }, // D string, 2nd fret = E
        { position: { string: 5, fret: 3 }, annotation: { tone: 'C', finger: '3' } }, // A string, 3rd fret = C
{{ ... }}
        { position: { string: 6, fret: -1 } }, // Low E string muted
      ],
      // Optional barres for this position
      // barres: [{ fromString: 1, toString: 5, fret: 3, finger: '1' }]
    }
  ],
  tuning: {
    name: 'Standard Guitar',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'] // Low E to High E
  }
};

function App() {
  return (
    <ChordDiagram
      data={cMajorData}
      width={250} // Example width
      height={300} // Example height
    />
  );
}
```

## Interactive Editor

Use the `InteractiveChordEditor` component to let users create and edit chord diagrams:

```tsx
import { InteractiveChordEditor } from '@yourusername/chord-diagram-lib';

function App() {
  return (
    <div className="p-8">
      <h1>Chord Diagram Editor</h1>
      <InteractiveChordEditor />
    </div>
  );
}
```

## API Reference

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

## Usage in Another Project (Local Test)

To test your library before publishing:

1. Build the library:
   ```bash
   npm run build
   ```
2. Pack it:
   ```bash
   npm pack
   ```
   This will generate a file like `chord-diagram-library-0.1.0.tgz`.
3. In your test project, run:
   ```bash
   npm install /path/to/chord-diagram-library-0.1.0.tgz
   ```
4. Import in your React app:
   ```tsx
   import { ChordDiagram } from 'chord-diagram-library';
   import 'chord-diagram-library/dist/style.css';
   ```

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

### InteractiveChordEditor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialStrings` | `number` | `6` | Initial number of strings |
| `initialFrets` | `number` | `5` | Initial number of frets |
| `width` | `number \| string` | `300` | Width of the editor |
| `height` | `number \| string` | `350` | Height of the editor |
| `className` | `string` | `''` | Additional CSS class names |

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

## Styling Customization

The library uses Tailwind CSS for styling. You can customize the appearance by overriding the default styles:

```css
/* In your global CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .chord-note {
    @apply fill-current text-blue-600 dark:text-blue-400;
  }
  
  .chord-barre {
    @apply fill-current text-purple-600 dark:text-purple-400;
  }
  
  .chord-string {
    @apply stroke-current text-gray-800 dark:text-gray-200;
  }
}
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open http://localhost:5173 in your browser

## Building for Production

```bash
npm run build
# or
yarn build
```

## Contributing

Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

---

## License

MIT

# trigger deploy-demo again

