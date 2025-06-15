# GitHub Actions Workflows – CI/CD Automation Guide

Questo file spiega come funzionano i workflow di automazione (GitHub Actions) nella libreria `music-chords-diagrams`.

---

## Panoramica Workflows

### 1. CI on dev (`ci-dev.yml`)
- **Quando si attiva:** Ogni push sul branch `dev`
- **Cosa fa:**
  - Installa dipendenze
  - Lint (`npm run lint`)
  - Build della libreria (`npm run build`)
  - Build della test-app (`examples/react-test-app`)
  - Test (`npm test`)

---

### 2. Auto-merge dev into main (`auto-merge-dev-to-main.yml`)
- **Quando si attiva:** Quando la CI su `dev` termina con successo
- **Cosa fa:**
  - Checkout di `main`
  - Merge di `dev` su `main` (`git merge --no-ff dev`)
  - Push su `main`

---

### 3. Deploy Test App to GitHub Pages (`deploy-demo.yml`)
- **Quando si attiva:** Push su `main` o trigger manuale
- **Cosa fa:**
  - Installa dipendenze root e test-app
  - Build della test-app
  - Deploy della cartella `dist` della test-app su GitHub Pages

---

### 4. Publish to npm (`publish.yml`)
- **Quando si attiva:** Push di un tag versione (`vX.Y.Z`) su `main` o trigger manuale
- **Cosa fa:**
  - Checkout repository
  - Installa dipendenze
  - Build della libreria
  - Pubblica su npm (`npm publish --access public`)

#### Comandi manuali per pubblicare una nuova versione su npm

1. Assicurati che il branch `main` sia aggiornato e stabile:
   ```sh
   git checkout main
   git pull origin main
   ```
2. Aggiorna la versione in `package.json` (patch/minor/major):
   ```sh
   npm version patch   # oppure minor o major
   ```
3. Crea e pusha il nuovo tag versione:
   ```sh
   git push origin main --follow-tags
   # oppure, se hai creato manualmente un tag:
   git tag v0.2.12
   git push origin v0.2.12
   ```
4. Il workflow `publish.yml` pubblicherà automaticamente la libreria su npm.

---

### 5. Create PR from Dev to Main (`create_pr_to_main.yml`)
- **Quando si attiva:** Solo trigger manuale
- **Cosa fa:**
  - Checkout repository
  - Crea una Pull Request da `dev` verso `main` (utile se vuoi revisione manuale invece dell’auto-merge)

---

### 6. Sync main to dev (`sync-dev.yml`)
sincronizza il branch dev quando vengono fatte delle modifiche direttamente su main
- **Quando si attiva:** Push su `main` o trigger manuale
- **Cosa fa:**
  - Checkout di `main`
  - Merge di `main` su `dev`
  - Push su `dev`

---

## Flusso tipico di sviluppo e rilascio

1. **Sviluppo su `dev`:**
   - Push e PR su `dev` attivano la CI.
2. **Auto-merge su `main`:**
   - Se la CI su `dev` ha successo, parte il merge automatico su `main`.
3. **Deploy demo:**
   - Ogni push su `main` pubblica la test-app su GitHub Pages.
4. **Sync inverso:**
   - Ogni push su `main` aggiorna anche il branch `dev`.
5. **Release npm:**
   - Quando crei e pusha un tag versione su `main`, parte la pubblicazione su npm.
6. **PR manuale dev→main:**
   - Se vuoi revisione manuale, puoi lanciare il workflow per creare una PR da `dev` verso `main`.

---

## Consigli pratici

- Lavora sempre su `dev` e lascia che l’automazione gestisca merge, deploy e release.
- Per pubblicare una nuova versione npm:
  1. Assicurati che `main` sia aggiornato e stabile.
  2. Crea un nuovo tag versione su `main`:
     ```sh
     git tag v0.2.12 && git push origin v0.2.12
     ```
  3. Il workflow `publish.yml` penserà a tutto.
- Se vuoi forzare una PR dev→main (anziché auto-merge), usa il trigger manuale del workflow dedicato.

---

Per dettagli sui singoli workflow, consulta la cartella `.github/workflows/`.
