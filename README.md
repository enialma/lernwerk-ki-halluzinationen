# Lernwerk – Halluzinationen und Bias bei KI erkennen

Interaktive Lernsequenz (K1–K6) für die Schweizer Berufsbildung, mit integriertem
KI-Assistenten. Der Assistent hat zwei Modi:

- **Feedback-Coach** – bewertet die Antwort der lernenden Person zur jeweiligen Aufgabe.
- **Übungspartner** – beantwortet Fragen zum Thema und stellt Übungsbeispiele bereit.

Der KI-Chat läuft über die **Infomaniak AI Tools** (Hosting in der Schweiz). Der API-Token
bleibt serverseitig und ist im Browser nicht sichtbar.

## Aufbau

```
index.html        Die Lernseite (Frontend, inkl. Chat-Oberfläche)
api/chat.js        Serverless-Funktion: hält den Token geheim, ruft Infomaniak auf
package.json       Projekt-Metadaten
vercel.json        Konfiguration (saubere URLs, Caching)
.env.example       Kopiervorlage der benötigten Variablen (Dokumentation)
```

## Einrichtung Schritt für Schritt

### 1. Infomaniak vorbereiten
1. Im Infomaniak-Manager **AI Tools** aktivieren.
2. Die **Produkt-Kennung (Product ID)** notieren.
3. Einen **API-Token** erstellen und sicher aufbewahren.

### 2. Repo auf GitHub anlegen
1. Auf GitHub ein neues, leeres Repository erstellen, z. B. `lernwerk-ki-halluzinationen`.
2. Die Dateien aus diesem Ordner hochladen (per Web-Upload oder git push).

### 3. Mit Vercel verbinden
1. In Vercel **Add New… → Project** wählen und das GitHub-Repo importieren.
2. Framework-Preset: **Other** (keine Anpassung nötig, Vercel erkennt `/api` automatisch).
3. Vor dem ersten Deploy unter **Environment Variables** eintragen:
   - `INFOMANIAK_TOKEN` = Ihr API-Token
   - `INFOMANIAK_PRODUCT_ID` = Ihre Produkt-Kennung
   - `INFOMANIAK_MODEL` = z. B. `mistral3` (optional)
4. **Deploy** klicken.

Ab jetzt löst jeder Push auf den Hauptbranch automatisch ein neues Deployment aus.

### 4. Öffentlichen Zugang sicherstellen
Falls eine Login-Wand erscheint: **Settings → Deployment Protection → Vercel
Authentication → Off → Save**.

## Modell wechseln
Verfügbare Modelle abfragen (Token und Product ID einsetzen):

```
curl -H "Authorization: Bearer <TOKEN>" \
  "https://api.infomaniak.com/2/ai/<PRODUCT_ID>/openai/v1/models"
```

Dann in Vercel die Variable `INFOMANIAK_MODEL` auf den gewünschten Modellschlüssel
setzen und neu deployen.

## Datenschutzhinweis
Chatinhalte werden zur Beantwortung an Infomaniak (Schweiz) übermittelt. Weisen Sie
Lernende darauf hin, keine besonders schützenswerten Personendaten einzugeben.
