# Decisioni di Progettazione

Questo documento registra le decisioni di progettazione chiave prese durante lo sviluppo della libreria di diagrammi per chitarra.

## Struttura dei Dati degli Accordi

### Formato dell'oggetto accordo
```typescript
{
  name: string;                    // Nome dell'accordo (es. 'C major')
  positions: {
    notes: Array<{
      string: number;              // Numero della corda (1-based)
      fret: number;                // Tasto (0 per corde aperte)
      tone?: string;               // Nome della nota (opzionale)
      muted?: boolean;             // Se true, la corda è muta
    }>;
    fingers?: (number | null)[];   // Diteggiature (0 per corde aperte, null per mute)
    barres?: Barre[];             // Barre (se presenti)
  };
  theory?: {
    tones: string[];              // Nomi delle note per ogni corda
    intervals: string[];           // Intervalli armonici per ogni corda
    description?: string;          // Descrizione opzionale dell'accordo
  };
  display?: {
    labelType?: 'none' | 'finger' | 'tone' | 'interval';
    showFretNumbers?: boolean;
    showStringNames?: boolean;
    width?: number;
    height?: number;
  };
  tuning?: string[];              // Accordatura personalizzata (es. ['E', 'A', 'D', 'G', 'B', 'E'])
}
```

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
2. Le corde mute mostrano sempre una 'X' in colore grigio scuro
3. Le corde aperte hanno testo nero su sfondo bianco
4. Le corde premute hanno testo bianco su sfondo nero
5. Le etichette vengono mostrate solo se presenti nell'array `labels`
6. I valori null/undefined vengono gestiti correttamente

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
