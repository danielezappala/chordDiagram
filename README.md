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
| `startFret` | `number` | `0` | Starting fret number (0 for open position) |
| `notes` | `NotePosition[]` | `[]` | Array of notes to display |
| `barres` | `Barre[]` | `[]` | Array of barres to display |
| `width` | `number \| string` | `200` | Width of the diagram |
| `height` | `number \| string` | `250` | Height of the diagram |
| `className` | `string` | `''` | Additional CSS class names |

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
