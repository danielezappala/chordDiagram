# React Chord Diagram Library

A customizable and interactive chord diagram library for React, built with TypeScript, Tailwind CSS, and Framer Motion. Perfect for displaying guitar, bass, ukulele, and other stringed instrument chord diagrams in your web applications.

## Features

- 🎸 Render beautiful, responsive chord diagrams
- 🎨 Customizable appearance with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 🎮 Interactive editor for creating and editing chords
- 🌓 Dark mode support
- 📱 Touch and mouse support
- 🎨 Customizable colors, sizes, and labels

## Installation

```bash
npm install @yourusername/chord-diagram-lib
# or
yarn add @yourusername/chord-diagram-lib
```

## Quick Start

```tsx
import { ChordDiagram } from '@yourusername/chord-diagram-lib';

function App() {
  return (
    <ChordDiagram
      strings={6}
      frets={5}
      notes={[
        { string: 5, fret: 3, label: '1' },
        { string: 4, fret: 2, label: '2' },
        { string: 3, fret: 0, label: '3' },
      ]}
      barres={[
        { fromString: 2, toString: 1, fret: 1 }
      ]}
      width={300}
      height={400}
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
<<<<<<< HEAD
| `strings` | `number` | `6` | Number of strings on the instrument |
| `frets` | `number` | `5` | Number of frets to display |
| `startFret` | `number` | `1` | Starting fret number (1 for first fret) |
| `notes` | `NotePosition[]` | `[]` | Array of notes to display |
| `barres` | `Barre[]` | `[]` | Array of barres to display |
| `width` | `number \| string` | `200` | Width of the diagram |
| `height` | `number \| string` | `250` | Height of the diagram |
| `className` | `string` | `''` | Additional CSS class names |
=======
| `data` | `ChordDiagramData` | (required) | The main data object for the chord. See "Data Conventions" and `src/types.ts` for the new v2 structure. Key changes: `data.positions` is now an array, each with `baseFret`, `notes` (as `PositionedNote[]`), and `barres`. |
| `positionIndex` | `number` | `0` | Index of the position in `data.positions` to display. |
| `labelType` | `'none' \| 'finger' \| 'tone' \| 'interval' \| 'degree'` | `'finger'` | Type of label to display on notes. Overrides `data.display.labelType`. |
| `showFretNumbers` | `boolean` | `true` | Whether to display fret numbers. If `false` and the position's `baseFret > 1`, the `baseFret` value is still shown. Overrides `data.display.showFretNumbers`. |
| `fretNumberPosition` | `'left' \| 'right' \| 'none'` | `'left'` | Position of fret numbers. Overrides `data.display.fretNumberPosition`. |
| `showStringNames` | `boolean` | `true` | Whether to display string names/tuning notes below the diagram. Overrides `data.display.showStringNames`. |
| `numStrings` | `number` | (derived) | Override for the number of strings. If not provided, derived from `data.tuning` or `data.positions[positionIndex].notes`. |
| `numFrets` | `number` | `5` | Number of frets to draw on the diagram. |
| `tuning` | `string[]` | (derived) | Override for instrument tuning (array of notes from lowest to highest pitch string). If not provided, derived from `data.tuning`. |
| `width` | `number` | `200` | Width of the diagram in pixels. |
| `height` | `number` | `250` | Height of the diagram in pixels. |
| `className` | `string` | `''` | Additional CSS class names for the main SVG container. |

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
>>>>>>> 7ce2340662a65011446821003aea60254626e7d0

## Data Conventions

### String Numbering
The library uses a consistent convention for numbering strings in `NotePosition.string`, `Barre.fromString`, and `Barre.toString` fields:
*   **String 1:** Represents the string with the highest pitch (e.g., the high 'E' string on a standard-tuned guitar). In the diagram, this string is rendered as the **rightmost** string.
*   **String N:** Represents the string with the lowest pitch (e.g., the low 'E' string on a 6-string guitar, so N=6). In the diagram, this string is rendered as the **leftmost** string.

This means that visually, the strings are ordered from lowest pitch (left) to highest pitch (right).

### Fret Numbering and `startFret`
Understanding how fret positions are determined is key to providing correct data:
*   **`NotePosition.fret`**: This field should always represent the **absolute fret number** on the instrument's neck. For example, an open string is `fret: 0`, a note on the first fret is `fret: 1`, and so on.
*   **`ChordDiagramData.display.startFret`** (or the `startFret` prop on the `ChordDiagram` component): This setting determines which fret is displayed at the **top** of the chord diagram. The default is `1`.
    *   If `startFret` is `1`, the diagram shows the instrument from the nut (or first fret) upwards.
    *   If `startFret` is, for example, `3`, the diagram will start by showing the 3rd fret at the top. Notes played on frets 1 and 2 would typically not be visible unless they are open strings (which are handled slightly differently).
*   **Fret Number Display**: When `showFretNumbers` is enabled, the numbers displayed next to the diagram (e.g., "3", "4", "5") will correspond to the actual fret numbers of the instrument, starting with the `startFret` value. For instance, if `startFret` is 3, the first fret shown will be labeled "3".

### Barre Chords and `Barre.finger`
The `Barre` type, used in `ChordDiagramData.positions.barres`, includes an optional `finger` field:
*   **`Barre.finger?: number | 'T';`**: This field allows you to specify the finger used to play the barre (e.g., `1` for the index finger, `T` for the thumb).
*   **Current Behavior**: While this data can be provided, the library does **not** currently render this finger information visually on the chord diagram. It is stored for potential future use or for other consumers of the data structure.

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

## Styling

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

## License

MIT
