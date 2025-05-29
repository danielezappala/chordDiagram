# Roadmap per il Refactoring della Libreria

## 🚀 Priorità Alta (Aspetti Strutturali e API Core)

### 1. Consolidamento Componente ChordDiagram

**Azione:** 
Verifica se `src/components/ChordDiagram.tsx` e `src/components/ChordDiagram/index.tsx` sono duplicati o versioni diverse. Unifica in un'unica versione autorevole del componente ChordDiagram. Questo è fondamentale per avere una base di codice chiara.

**File da modificare:** 
- Decidere quale versione tenere e rimuovere/integrare l'altra.

---

### 2. Definizione e Esportazione Tipi Pubblici

**Azione:** 
Sposta le definizioni dei tipi usati nell'API pubblica (es. `NotePosition`, `BarrePosition`, ed eventualmente la `ChordDiagramData` usata da `ChordInfo`) in un file centrale di tipi (es. `src/types.ts` o `src/index.types.ts`). 

Esporta questi tipi dal punto di ingresso principale della libreria (solitamente `src/index.ts` o `src/main.ts` che dovresti creare se non esiste).

**File da modificare:** 
- `src/components/ChordDiagram/index.tsx` (o la sua versione consolidata)
- `src/types.ts`
- Creare `src/index.ts` (o simile) se non esiste

---

### 3. Chiarimento Convenzioni API ChordDiagram

**Azione:** 
Documentare chiaramente nel `README.md` e nei commenti del codice:

1. **Numerazione Corde:** 
   - Es: "Stringa 1 è il Mi cantino, visualizzata come la più a destra"
   - Aggiornare i commenti vicino alle definizioni dei tipi

2. **Comportamento startFret:** 
   - Spiegare come `note.fret` (assoluto) e `startFret` (offset) interagiscono
   - Aggiungere esempi nel README.md

3. **BarrePosition.label:**
   - Decidere se mantenerla (e documentarne l'uso) o rimuoverla per semplificare l'API

**File da modificare:** 
- `README.md`
- Commenti in `src/components/ChordDiagram/index.tsx`
- File dei tipi

---

### 4. Validazione Props per ChordDiagram con Zod

**Azione:**
Implementare la validazione per le props di `ChordDiagram` usando Zod per migliorare la robustezza strutturale dell'interfaccia del componente.

**File da modificare:** 
- `src/components/ChordDiagram/index.tsx` (o consolidato)
- Creare uno schema Zod per la validazione delle props

---

## 📊 Priorità Media (Miglioramenti Strutturali e Preparazione alla Pubblicazione)

### 1. Configurazione package.json per Pubblicazione

**Azione:**
Modificare `package.json` per la pubblicazione:

```json
{
  "private": false,
  "main": "dist/index.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "description": "Libreria per la visualizzazione di diagrammi di accordi per chitarra",
  "keywords": ["chords", "guitar", "react", "music", "diagrams"],
  "author": "Il tuo Nome",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tuoutente/chord-diagram-library"
  },
  "homepage": "https://github.com/tuoutente/chord-diagram-library#readme"
}
```

**File da modificare:** 
- `package.json`

---

### 2. Configurazione Build di Libreria con Vite

**Azione:**
Creare o modificare `vite.config.ts` per includere la configurazione di build per la libreria.

**File da modificare:** 
- `vite.config.ts`

---

## 📝 Priorità Bassa (Pulizia e Funzionalità Aggiuntive)

### 1. Lingua dei Commenti

**Azione:**
Rivedere i file (specialmente `ChordInfo.tsx`) e tradurre tutti i commenti in inglese per coerenza con `DESIGN_DECISIONS.md`.

**File da modificare:** 
- `src/components/ChordInfo.tsx`
- Altri file con commenti in italiano

---

### 2. Considerare Props Aggiuntive per ChordDiagram

**Azione:**
Valutare se aggiungere props come:
- `showFretNumberLabel`
- `tuning`
- `showTuning`
- `chordName`

oppure documentare un pattern di composizione con `ChordInfo` o altri componenti.

**File da modificare:** 
- `src/components/ChordDiagram/index.tsx`
- `README.md`