// Vercel Serverless Function: /api/chat
// Leitet Chat-Anfragen sicher an die Infomaniak AI Tools API weiter.
// Der API-Token bleibt serverseitig (Environment Variable) und ist im Browser NICHT sichtbar.

const INFOMANIAK_BASE = "https://api.infomaniak.com";

// Erlaubte Modi mit jeweils eigenem didaktischem Systemprompt.
// Beide sind auf Schweizer Berufsbildung, Sprache Deutsch (Sie-Form) und das
// Thema "Halluzinationen und Bias bei KI" zugeschnitten.
const SYSTEM_PROMPTS = {
  coach: `Du bist ein didaktischer Feedback-Coach für Lernende an einer Schweizer Berufsfachschule.
Thema: Halluzinationen und Bias bei KI-Systemen (Large Language Models).
Die Lernenden bearbeiten sechs Kompetenzstufen (K1 Wissen bis K6 Erstellen).

Deine Aufgabe: Du bewertest die Antwort der lernenden Person konstruktiv und lernförderlich.
Regeln:
- Sprich die Lernenden in der Sie-Form an. Schreibe auf Deutsch, Schweizer Rechtschreibung (ss statt ß).
- Gib zuerst eine kurze wertschätzende Rückmeldung, dann konkrete, umsetzbare Verbesserungshinweise.
- Verrate niemals die Musterlösung komplett. Stelle stattdessen gezielte Rückfragen oder gib Denkanstösse, damit die Lernenden selbst weiterkommen.
- Halte klar auseinander: Halluzination = falsche/erfundene/nicht belegbare Information (Faktenrisiko). Bias = verzerrte Auswahl oder Darstellung (Perspektivenrisiko). Eine biased Antwort kann in ihren Fakten korrekt sein.
- Bleibe knapp (maximal ca. 150 Wörter), freundlich und ermutigend.
- Wenn die Antwort leer oder off-topic ist, lenke freundlich zurück zur Aufgabe.`,

  partner: `Du bist ein KI-Übungspartner für Lernende an einer Schweizer Berufsfachschule.
Thema: Halluzinationen und Bias bei KI-Systemen (Large Language Models).

Deine Aufgabe: Du hilfst den Lernenden, Halluzinationen und Bias sicher zu erkennen und einzuordnen.
Regeln:
- Sprich die Lernenden in der Sie-Form an. Schreibe auf Deutsch, Schweizer Rechtschreibung (ss statt ß).
- Beantworte Fragen zum Thema klar und mit Beispielen. Du darfst auf Wunsch bewusst ein kleines Beispiel für eine Halluzination oder einen Bias erzeugen und die Lernenden bitten, es zu erkennen und zu begründen.
- Fördere kritisches Denken: Frage nach Quellen, nach fehlenden Perspektiven, nach überprüfbaren Behauptungen.
- Erfinde keine Studien, Zahlen oder Quellen als wären sie echt. Wenn du ein Beispiel für eine Halluzination zeigst, kennzeichne es klar als Übungsbeispiel.
- Bleibe knapp und dialogisch (maximal ca. 150 Wörter pro Antwort).`
};

export default async function handler(req, res) {
  // Nur POST erlauben
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.INFOMANIAK_TOKEN;
  const productId = process.env.INFOMANIAK_PRODUCT_ID;
  // Modell über Env-Variable einstellbar; Standardwert kann jederzeit angepasst werden.
  const model = process.env.INFOMANIAK_MODEL || "mistral3";

  if (!token || !productId) {
    return res.status(500).json({
      error: "Serverkonfiguration unvollständig. Bitte INFOMANIAK_TOKEN und INFOMANIAK_PRODUCT_ID in den Vercel-Projekteinstellungen hinterlegen."
    });
  }

  // Body robust parsen (Vercel liefert je nach Setup String oder Objekt)
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const mode = body.mode === "partner" ? "partner" : "coach";
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context = typeof body.context === "string" ? body.context.slice(0, 4000) : "";

  // Nur die erwarteten Felder durchreichen; Rollen auf user/assistant begrenzen.
  const cleanedMessages = messages
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12) // nur die letzten Turns, hält Anfragen klein
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (cleanedMessages.length === 0) {
    return res.status(400).json({ error: "Keine gültige Nachricht erhalten." });
  }

  let systemContent = SYSTEM_PROMPTS[mode];
  if (context) {
    systemContent += `\n\nKontext der aktuellen Aufgabe (zur Orientierung):\n${context}`;
  }

  const payload = {
    model,
    messages: [{ role: "system", content: systemContent }, ...cleanedMessages],
    temperature: 0.4,
    max_tokens: 500
  };

  const url = `${INFOMANIAK_BASE}/2/ai/${productId}/openai/v1/chat/completions`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(upstream.status).json({
        error: "Die KI-Anfrage ist fehlgeschlagen.",
        status: upstream.status,
        detail: detail.slice(0, 500)
      });
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "(Keine Antwort erhalten.)";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(502).json({ error: "Verbindung zur KI nicht möglich.", detail: String(err).slice(0, 300) });
  }
}
