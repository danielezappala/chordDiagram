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
| `strings` | `number` | `6` | Number of strings on the instrument |
| `frets` | `number` | `5` | Number of frets to display |
| `startFret` | `number` | `1` | Starting fret number (1 for first fret) |
| `notes` | `NotePosition[]` | `[]` | Array of notes to display |
| `barres` | `Barre[]` | `[]` | Array of barres to display |
| `width` | `number \| string` | `200` | Width of the diagram |
| `height` | `number \| string` | `250` | Height of the diagram |
| `className` | `string` | `''` | Additional CSS class names |

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
type NotePosition = {
  string: number;      // String number (1 = highest string)
  fret: number;       // Fret number (0 = open string)
  label?: string;     // Optional label to display on the note
  color?: string;      // Optional custom color for the note
};

type Barre = {
  fromString: number;  // Starting string (higher number = lower pitch)
  toString: number;    // Ending string (lower number = higher pitch)
  fret: number;        // Fret number
  color?: string;      // Optional custom color for the barre
};
```

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
