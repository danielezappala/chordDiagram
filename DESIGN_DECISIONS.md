# Decisioni di Progettazione

Questo documento registra le decisioni di progettazione chiave prese durante lo sviluppo della libreria di diagrammi per chitarra.

## Struttura del Progetto

### Organizzazione dei File
- `src/components/ChordDiagram`: Contiene il componente principale per la visualizzazione degli accordi
- `src/types`: Definizioni TypeScript per i tipi pubblici
- `src/utils`: Funzioni di utilità e helper
- `src/index.ts`: Punto di ingresso principale della libreria

### Convenzioni API
1. **Numerazione delle Corde (String Numbering)**:
   - La **Corda 1** (`string: 1` in `NotePosition`) si riferisce alla corda con il pitch più alto (es. Mi cantino / High E su una chitarra standard). Nel diagramma, questa corda è visualizzata come la più **a destra**.
   - La **Corda N** (dove N è il numero totale di corde, es. `string: 6` per una chitarra standard) si riferisce alla corda con il pitch più basso (es. Mi basso / Low E). Nel diagramma, questa corda è visualizzata come la più **a sinistra**.
   - Le etichette testuali delle corde (se mostrate) seguono questa convenzione visiva (da sinistra a destra: Low E, A, D, G, B, High E per una chitarra standard).
   - Questa convenzione si applica a `FretPosition.string` e `Barre.fromString/toString`.

2. **Gestione dei Tasti (v2)**:
   - `FretPosition.fret`: Rappresenta sempre il numero **assoluto** del tasto sul manico. `0` indica una corda a vuoto. `-1` indica una corda muta o non suonata, che sarà marcata con 'X' nel diagramma.
   - `ChordPositionData.baseFret`: Determina quale tasto appare in cima al diagramma per una specifica diteggiatura/posizione. Se `1`, viene mostrato il capotasto (o il primo tasto). Se maggiore di `1`, la numerazione dei tasti si adegua di conseguenza.

3. **Convenzioni per Dati Strutturati (v2)**:
   - **`Tuning.notes`**: Questo array di stringhe (nomi delle note) per l'accordatura deve essere fornito con gli elementi ordinati dalla corda con il **pitch più basso** (es. Low E, corda N) alla corda con il **pitch più alto** (es. High E, corda 1). Esempio per chitarra standard: `['E', 'A', 'D', 'G', 'B', 'E']`.
   - **`ChordPositionData.notes`**: Questo è un array di oggetti `PositionedNote`. Per una completa annotazione, si raccomanda di fornire un elemento `PositionedNote` per ogni corda dello strumento. L'ordine di questi elementi nell'array non è strettamente imposto per la logica di base, ma per chiarezza e processamento completo, è consigliabile ordinarli per numero di corda (da 1, high-pitch, a N, low-pitch). Ogni `PositionedNote` contiene `position.string` che definisce a quale corda si riferisce.
   - La precedente gestione interna di inversione di array separati per `fingers`, `tones`, `intervals` non è più necessaria in `ChordDiagram.tsx`, poiché queste informazioni sono ora incapsulate per ciascuna nota in `PositionedNote.annotation`.

4. **`FingerDesignator` (Nuovo Tipo)**:
   - Per specificare la diteggiatura in `NoteAnnotation.finger`, si usa il tipo `FingerDesignator`.
   - Valori possibili:
     - Numeri `1, 2, 3, 4`: Dita della mano (indice, medio, anulare, mignolo).
     - `'T'` o `'P'`: Pollice (Thumb).
     - `'O'`: Corda suonata a vuoto (Open), quando si vuole indicare esplicitamente che è aperta nel contesto di una diteggiatura.
     - `'X'`: Corda non suonata o muta, nel contesto di una diteggiatura specifica (complementare a `FretPosition.fret = -1`).
     - `null`: Nessuna diteggiatura specifica fornita per quella nota.

5. **Validazione**:
   - Tutte le props vengono validate utilizzando Zod (Nota: le definizioni Zod dovranno essere aggiornate per i nuovi tipi v2).
   - I messaggi di errore sono descrittivi e utili per il debugging.

## Struttura dei Dati degli Accordi (v2)

La struttura `ChordDiagramData` è stata significativamente rivista per migliorare la separazione delle responsabilità, supportare diteggiature multiple per accordo, e standardizzare la rappresentazione dell'accordatura. Questa evoluzione si basa sul feedback degli utenti e sull'obiettivo di una maggiore flessibilità.

### Formato Principale: `ChordDiagramData` (v2)
```typescript
// Riepilogo della struttura v2. Fare riferimento a src/types.ts per i dettagli completi.
interface ChordDiagramData {
  name: string;                 // Nome primario dell'accordo (es. "Am7")
  fullName?: string;            // Nome descrittivo completo (opzionale)
  aliases?: string[];           // Nomi alternativi (opzionale)

  positions: ChordPositionData[]; // Array di diteggiature/posizioni

  theory?: { /* ... info teoriche globali ... */ };
  tuning?: Tuning | string[];   // Accordatura (oggetto Tuning o array di stringhe)
  display?: { /* ... impostazioni di visualizzazione globali ... */ };
  instrument?: InstrumentType;
  comments?: string;
}
```

### Sotto-Strutture Chiave:
-   **`ChordPositionData`**: Rappresenta una singola diteggiatura o posizione.
    -   `baseFret: number`: Tasto visualizzato in cima al diagramma per questa posizione.
    -   `notes: PositionedNote[]`: Array delle note in questa posizione.
    -   `barres?: Barre[]`: Array di barrè.
-   **`PositionedNote`**: Una nota specifica sulla tastiera.
    -   `position: FretPosition`: Definisce la corda e il tasto.
    -   `annotation?: NoteAnnotation`: Dettagli opzionali (dito, tono, intervallo).
-   **`FretPosition`**:
    -   `string: number`: Numero della corda (1 = più acuta).
    -   `fret: number`: Tasto assoluto (`0` = corda a vuoto, `-1` = muta/non suonata).
-   **`NoteAnnotation`**:
    -   `finger?: FingerDesignator`: Diteggiatura.
    -   `tone?: string`: Nota (es. 'C#').
    -   `interval?: string`: Intervallo (es. 'm3').
    -   `degree?: string`: Grado della scala.
    -   `highlight?: boolean`.
-   **`FingerDesignator`**: `1 | 2 | 3 | 4 | 'T' | 'P' | 'O' | 'X' | null`. Vedi spiegazione in "Convenzioni API".
-   **`Tuning`**: Oggetto `{ name: string; notes: string[] }` o semplice array `string[]` (note da corda più grave a più acuta).
-   **`Barre`**: (v2) Include `fromString` (corda più acuta, es. 1), `toString` (corda più grave, es. 6), `fret`, e `finger?` opzionale.

### Motivazioni per la Ristrutturazione v2:
-   **Supporto Multi-Posizione**: La modifica principale è l'introduzione di `positions: ChordPositionData[]`, che permette di definire più diteggiature o voicings per lo stesso accordo logico all'interno di un singolo oggetto `ChordDiagramData`.
-   **Chiarezza Dati Nota**: Separazione tra `FretPosition` (dove si trova la nota) e `NoteAnnotation` (cos'è la nota e come suonarla).
-   **Standardizzazione `baseFret`**: `baseFret` è ora per posizione, eliminando ambiguità con un `startFret` globale quando si hanno più diteggiature.
-   **Miglioramento Diteggiature**: Introduzione di `FingerDesignator` per una specifica più ricca delle dita e dello stato delle corde (aperta 'O', muta 'X').
-   **Definizione Accordatura Flessibile**: `tuning` può essere un oggetto `Tuning` completo o un semplice array di note.

## Componente LabelsLayer

### Specifiche di Stile
- **Font**: Arial, sans-serif
- **Dimensione**: `noteRadius * 1.2` (dove `noteRadius` è calcolato in base alle dimensioni del diagramma)
- **Peso**: bold
- **Allineamento**: Centrato orizzontalmente e verticalmente
- **Bordo**: 2px per migliorare la leggibilità
  - Testo bianco: bordo nero con opacità 0.8
  - Testo nero: bordo bianco con opacità 0.8

## Principi di Visualizzazione

### Filosofia dei Dati
La libreria si limita a visualizzare i dati forniti dall'utente senza eseguire calcoli o deduzioni. Questo principio si applica a:

1. **Intervalli**: Vengono mostrati solo gli intervalli esplicitamente forniti nell'oggetto `theory.intervals`
2. **Note e Tonalità**: Vengono mostrate solo le note e le tonalità specificate in `positions.notes.tone` e `theory.tones`
3. **Accordatura**: Viene utilizzata esclusivamente l'accordatura specificata in `tuning`
4. **Diteggiature**: Vengono mostrate solo le diteggiature fornite in `positions.fingers`

### Comportamento
1. Le etichette sono centrate perfettamente nei cerchi delle note
2. Le corde mute mostrano sempre una 'X' in colore grigio scuro (simbolo grafico sul tasto zero in `NotesLayer`)
3. Le corde aperte hanno testo nero su sfondo bianco
4. Le corde premute hanno testo bianco su sfondo nero
5. Le etichette vengono mostrate solo se presenti nell'array `labels` (passato a `FretboardBase`)
6. I valori null/undefined vengono gestiti correttamente per non visualizzare "null" o "undefined" come etichette.
7. **Etichettatura delle Corde Mute (Muted String Labeling)**:
   - Le corde contrassegnate come mute (`note.muted: true`) riceveranno un'etichetta 'X' nella riga delle etichette visualizzata sotto la tastiera (a condizione che `display.labelType` non sia `'none'` e venga generata tramite `noteLabels`).
   - Questa etichetta 'X' per le corde mute ha la precedenza su qualsiasi altra etichetta derivante da `finger`, `tone`, o `interval` per quella specifica corda quando si generano le `noteLabels`.
   - La visualizzazione del simbolo 'X' direttamente sulla corda all'altezza del capotasto (o al tasto zero) è gestita separatamente dal componente `NotesLayer` e non dipende da `noteLabels`.
8. **Visualizzazione Condizionale del `startFret`**:
   - Anche quando la prop `showFretNumbers` è impostata a `false`, se `startFret` è maggiore di 1 (ad esempio, il diagramma inizia dal 3° tasto), il numero di `startFret` (es. "3") verrà comunque visualizzato accanto al primo tasto visibile sul diagramma.
   - Questa decisione è stata presa per garantire che l'utente abbia sempre un riferimento di posizione sulla tastiera quando il diagramma non parte dal capotasto o dal primo tasto.
   - Se `showFretNumbers` è `false` e `startFret` è `1` (o un valore non maggiore di 1), nessun numero di tasto viene visualizzato.

## Convenzioni di Codice

1. **Nomi dei file**: PascalCase per i componenti React (es. `LabelsLayer.tsx`)
2. **Nomi delle variabili**: camelCase
3. **Tipi e interfacce**: PascalCase
4. **Costanti**: UPPER_SNAKE_CASE
5. **Commenti**: In inglese, con spiegazioni chiare del "perché" piuttosto che del "cosa"

## Gerarchia delle Informazioni

### Struttura delle informazioni sopra il diagramma

1. **Nome accordo**
   - Fornito da utente Esempio: "C major 7"
   - Stile: Testo più grande, evidenziato

2. **Nome Strumento 
   - fornito da utente es. "Bass (4 strings)" 
   - Stile: Sottotitolo, dimensione media

3. **Chord tones**
   - Fornito da utente Formato: "C E G B" (separati da spazi)
   - Opzionale: Colorazione delle singole note

4. **Intervalli**
   - Fornito da utente Formato: "R 3 5 7" o "1 3 5 b7" (separati da spazi)
   - Opzionale: Colorazione dei gradi della scala

### Linee guida di stile
- Usare un font leggibile e coerente
- Mantenere una spaziatura proporzionale all'importanza gerarchica
- Seguire lo schema cromatico dell'applicazione
- Mantenere un allineamento coerente con il diagramma sottostante

## Posizionamento dei Pallini e Spaziatura dei Tasti

### Calcolo della Spaziatura
- **Altezza totale**: L'altezza disponibile per la tastiera è calcolata sottraendo l'area delle etichette (30px) dall'altezza totale del diagramma
- **Spaziatura tasti**: La distanza tra i tasti è calcolata come `fretSpacing = (height - labelAreaHeight) / (numFrets + 1)`
  - Il `+1` è necessario per includere lo spazio per il capotasto
  - Questo calcolo è condiviso tra `FretboardBase` e `NotesLayer` per garantire consistenza

### Posizionamento Verticale dei Pallini
- I pallini sono centrati tra due tasti consecutivi
- La posizione Y di un pallino al tasto `n` è calcolata come: `y = (n - 0.5) * fretSpacing`
  - Per il primo tasto: `y = 0.5 * fretSpacing` (centrato tra capotasto e primo tasto)
  - Per il secondo tasto: `y = 1.5 * fretSpacing` (centrato tra primo e secondo tasto)
  - E così via...

### Gestione delle Corde Aperte/Mute
- Le corde aperte/mute sono posizionate a `-fretSpacing * 0.5` (appena sopra il capotasto)
- Viene mostrata una 'X' per le corde mute

### Supporto per `startFret > 1`
- Quando la tastiera inizia da un tasto superiore al primo, la posizione viene adattata sottraendo `(startFret - 1) * fretSpacing`
- Questo sposta correttamente l'intera griglia dei tasti verso l'alto

## Note di Sviluppo

- Il componente è stato progettato per essere il più generico possibile, permettendo la personalizzazione attraverso le props
- Le dimensioni e le posizioni sono calcolate in modo dinamico in base alle dimensioni del contenitore
- Il codice è stato ottimizzato per evitare ri-render non necessari utilizzando `useMemo` dove appropriato
