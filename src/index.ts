// src/index.ts

// === Componenti Principali ===
// Esporta ChordDiagram (che è ChordDiagramWithErrorBoundary) come default export del pacchetto
export { default as ChordDiagram } from './components/ChordDiagram'; 

// Esporta ChordInfo come default export. 
// Se preferisci un export nominato (es. import { ChordInfo } from '...'), 
// dovresti modificare l'export in ChordInfo.tsx o aggiungere un export nominato qui.
export { default as ChordInfo } from './components/ChordInfo';

// Quando InteractiveChordEditor sarà pronto per essere esposto, potrai aggiungerlo qui:
// export { default as InteractiveChordEditor } from './components/InteractiveChordEditor'; 

// === Tipi Essenziali ===
// Riesportati da src/types.ts per comodità dell'utente della libreria
export type {
    NotePosition,
    Barre,
    FretNumberPosition,
    ChordDiagramData,
    ChordDiagramProps // Le props specifiche per il componente ChordDiagram
} from './types';

// === Funzioni di Utilità o Valori Esposti (Opzionale) ===
// Se ritieni che queste possano essere utili per gli utenti della tua libreria,
// puoi decidere di esportarle. Altrimenti, puoi omettere questa sezione.

// Esempio di esportazione di una funzione di validazione:
export { isValidChordData } from './types';

// Esempio di esportazione di costanti di default:
export {
    DEFAULT_TUNING,
    DEFAULT_NUM_FRETS,
    DEFAULT_NUM_STRINGS,
    DEFAULT_WIDTH,
    DEFAULT_HEIGHT
} from './types';