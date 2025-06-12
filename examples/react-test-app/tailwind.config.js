/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.css",
  ],

  theme: {
    extend: {
      colors: {
        // Custom colors for chord diagrams
        chord: {
          nut: '#4b5563', // gray-600
          fret: '#6b7280', // gray-500
          string: '#1f2937', // gray-800
          'string-muted': '#9ca3af', // gray-400
          'fret-marker': '#9ca3af', // gray-400
          'note-default': '#3b82f6', // blue-500
          'note-muted': '#93c5fd', // blue-300
          'barre': '#6366f1', // indigo-500
          'finger-label': '#ffffff',
          'fretboard': '#f9fafb', // gray-50
          'fretboard-dark': '#111827', // gray-900
        },
      },
      boxShadow: {
        'note': '0 2px 4px rgba(0, 0, 0, 0.2)',
        'note-hover': '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [forms],
};
