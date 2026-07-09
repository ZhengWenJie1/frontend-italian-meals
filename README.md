# Italian Meals App

App mobile realizzata con **React Native + Expo** che permette di sfogliare, cercare e salvare tra i preferiti i piatti della cucina italiana, usando le API pubbliche di [TheMealDB](https://www.themealdb.com/api.php).

**Autore:** Wen Jie Zheng
**Repository:** https://github.com/ZhengWenJie1/frontend-italian-meals.git

---

## Come installare e avviare il progetto

1. Clona il repository:
   ```bash
   git clone https://github.com/ZhengWenJie1/frontend-italian-meals.git
   ```
2. Entra nella cartella del progetto:
   ```bash
   cd frontend-italian-meals
   ```
3. Installa le dipendenze:
   ```bash
   npm install
   ```
4. Avvia il progetto con Expo:
   ```bash
   npx expo start
   ```
   Dal terminale che si apre puoi poi:
   - premere **`a`** per aprire l'app su un emulatore/dispositivo Android collegato;
   - inquadrare il **QR code** con l'app **Expo Go** (iOS o Android) per aprirla su un dispositivo fisico.

### Prerequisiti

- **Node.js** versione LTS (18.x o superiore consigliata)
- **npm** (incluso con Node.js)
- App **Expo Go** installata sul telefono (App Store / Play Store), oppure un emulatore Android / simulatore iOS configurato sul computer
- Connessione internet attiva (l'app consuma le API di TheMealDB in tempo reale)

---

## Endpoint API usati

L'app utilizza le API pubbliche gratuite di **TheMealDB** (documentazione: https://www.themealdb.com/api.php), in particolare:

| Endpoint                                   | Uso nell'app                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| `GET /api/json/v1/1/filter.php?a=Italian`  | Recupera la lista dei piatti di cucina italiana (schermata Home)                   |
| `GET /api/json/v1/1/lookup.php?i={idMeal}` | Recupera il dettaglio di un singolo piatto tramite il suo id (schermata Dettaglio) |

---

## Utenti mock per il login

Il login è simulato: non c'è un backend, le credenziali vengono validate contro un elenco statico definito in `src/services/auth.ts`.

| Email                     | Password    |
| ------------------------- | ----------- |
| mario.rossi@student.it    | React2026!  |
| giulia.bianchi@student.it | Expo2026!   |
| luca.verdi@student.it     | Mobile2026! |

---

## Deep linking

La configurazione del linking è definita in `App.tsx`:

```js
const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      Home: "home",
      Details: "dettagli/:id",
      Avatar: "avatar",
    },
  },
};
```

- **Path configurato per il dettaglio di un piatto:** `dettagli/:id` (es. `dettagli/52771`)
- Se l'`id` non corrisponde a nessun piatto esistente, la schermata Dettaglio mostra lo stato di errore "Piatto non trovato" con un pulsante **Riprova**.

### Comando di test (con Expo Go, in sviluppo)

Con il progetto avviato tramite `npx expo start`, apri un altro terminale ed esegui:

```bash
npx uri-scheme open exp://127.0.0.1:8081/--/dettagli/52771 --ios
# oppure, per Android:
npx uri-scheme open exp://127.0.0.1:8081/--/dettagli/52771 --android
```

> Nota: l'indirizzo `127.0.0.1:8081` va sostituito con l'host/porta mostrati nel terminale di Expo (ad es. l'IP LAN, se si testa su dispositivo fisico non collegato via USB).

> ⚠️ Il prefisso custom `myapp://` funziona solo su una build standalone (EAS Build), perché in `app.json` non è ancora stata dichiarata la proprietà `"scheme": "myapp"`. In Expo Go va usato il link generato da `Linking.createURL(...)` (formato `exp://...`) come nell'esempio sopra.

---

## Link al Google Doc (screenshot lab 13–22)

https://docs.google.com/document/d/1RXdJJVh4GlMYAngYksM9MLcUvdgkYoO3lizdgMCK36Y/edit?tab=t.0#heading=h.wu29v8o1b6lm

---

## Scelta dello stato globale e motivazione

Lo stato dell'app è gestito con la **React Context API**, senza librerie esterne (es. Redux), perché la quantità di stato condiviso tra schermate è limitata e Context risulta più semplice da mantenere per un progetto di queste dimensioni:

- **`FavoriteContext`** (`src/context/FavoriteContext.tsx`): gestisce la lista degli id dei piatti preferiti, condivisa tra Home e Dettaglio. Ad ogni modifica i preferiti vengono persistiti su `AsyncStorage` (`storage.ts`) e ricaricati all'avvio dell'app, così restano disponibili anche dopo la chiusura.
- **Tema (dark/light) e layout (lista/griglia)**: sollevati come stato in `App.tsx` con `useState` e passati come props alle schermate, persistiti anch'essi su `AsyncStorage`.
- **Utente autenticato**: non passa per un Context globale, ma viene propagato tramite i **parametri di navigazione** (`navigation.replace("Home", { user })`) dopo il login. È presente in `src/context/AuthContext.tsx` una implementazione con Context già scritta ma non ancora collegata in `App.tsx` (vedi sezione "Cosa manca" più sotto).

---

## Edge case gestiti

- **Errori di rete**: sia in Home che in Dettaglio le chiamate API sono in `try/catch`; in caso di errore viene mostrato un messaggio e un pulsante **Riprova** che ripete la richiesta.
- **Login fallito**: se email/password non superano la validazione (email con `@`, password minima 6 caratteri) o non corrispondono a un utente mock, viene mostrato un messaggio di errore sotto al campo interessato.
- **Lista vuota**: se la ricerca o il filtro "Solo preferiti" non restituiscono risultati, viene mostrato un messaggio ("Nessun piatto trovato." / "Nessun preferito ancora.") al posto della lista.
- **Preferiti**: toggle persistente su `AsyncStorage`, disponibile sia nella card della lista sia nella schermata di dettaglio, con filtro dedicato "Solo preferiti" in Home.
- **Deep link invalido**: se il parametro `id` nel link non corrisponde a nessun piatto, la schermata Dettaglio mostra lo stato di errore "Piatto non trovato" con possibilità di riprovare la richiesta.

---

## Feature opzionali implementate

- **Dark mode**: interruttore in Profilo/Impostazioni, persistito su `AsyncStorage`.
- **Layout lista/griglia**: selettore in Profilo/Impostazioni per passare da vista a singola colonna a vista a griglia (2 colonne).
- **Geolocalizzazione** (`expo-location`): richiesta permessi e lettura della posizione corrente dalla schermata Profilo, con gestione del permesso negato e scorciatoia alle impostazioni del dispositivo.
- **Ricerca testuale** dei piatti nella schermata Home.
- **Avatar con fallback**: se l'immagine del profilo non si carica, viene mostrato un placeholder testuale al posto dell'immagine rotta.

---

## Cosa manca / possibili miglioramenti futuri

- Collegare `AuthContext.tsx` (già scritto) in `App.tsx` al posto del passaggio dell'utente via parametri di navigazione, per rendere l'autenticazione uno stato globale vero e proprio.
- Aggiungere `"scheme": "myapp"` in `app.json` per far funzionare il deep link `myapp://` anche in build standalone (EAS Build), non solo in Expo Go.
- Completare gli screenshot mancanti in `docs/screenshots` (lista piatti e impostazioni) citati in `PROGRESS.md`.
