const k1Items = [
      ['Die KI nennt eine Studie aus dem Jahr 2024, die sich weder über wissenschaftliche Datenbanken noch auf der Website der genannten Hochschule finden lässt.', 'H', 'Eine nicht auffindbare Studie ist ein Warnsignal für eine mögliche Halluzination.'],
      ['Die KI nennt bei erfolgreichen Unternehmer:innen nur Männer aus den USA.', 'B', 'Die Fakten können stimmen; die Auswahl kann dennoch einseitig und verzerrt sein.'],
      ['Die KI fasst einen Artikel zusammen und nennt dabei korrekt Autorin, Titel und Kernaussage.', 'K', 'Ohne weitere Hinweise liegt weder Halluzination noch Bias vor.'],
      ['Die KI behauptet, die Schweiz habe ein Gesetz zur vollständigen Abschaffung von Matura-Prüfungen beschlossen.', 'H', 'Das ist eine überprüfbare Tatsachenbehauptung, die zwingend anhand offizieller Quellen geprüft werden muss.'],
      ['Die KI beschreibt Jugendliche mit Migrationsgeschichte generell als sprachlich schwach und wenig leistungsorientiert.', 'B', 'Die Formulierung pauschalisiert und reproduziert ein defizitorientiertes Stereotyp.'],
      ['Die KI erstellt auf ausdrücklichen Wunsch einen kurzen Text ausschliesslich aus Sicht der Arbeitgeber.', 'K', 'Ein enger Fokus kann auftragsgemäss sein. Wichtig ist Transparenz, falls der Text keinen Gesamtüberblick liefert.']
    ];
    const TOTAL = 6;
    const sectionOf = { k1:'k1', k2:'k2', k3:'k3', k4:'k4', k5:'k5', k6:'k6' };
    const completed = new Set();
    function renderK1() { const target = document.getElementById('k1Quiz'); if(!target || target.querySelector('fieldset')) return; target.innerHTML = k1Items.map((item, i) => `<fieldset style="border:0;padding:0;margin:0"><legend><strong>${i+1}.</strong> ${item[0]}</legend><div class="choices" style="grid-template-columns:repeat(3,minmax(0,1fr));margin:7px 0 13px">${['H','B','K'].map(letter => `<label class="choice"><input type="radio" name="k1_${i}" value="${letter}"> ${letter}</label>`).join('')}</div></fieldset>`).join(''); }

    let toastTimer;
    function toast(msg){ let t=document.getElementById('toast'); if(!t){ t=document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }

    function markNav(key){ const a=document.querySelector('.nav a[href="#'+key+'"]'); if(a) a.classList.add('nav-done'); const sec=document.getElementById(key); if(sec){ sec.classList.add('is-done'); const b=sec.querySelector('.badge'); if(b) b.classList.add('badge-done'); } }

    function setDone(key) {
      const wasNew = !completed.has(key);
      completed.add(key);
      const count = completed.size;
      document.getElementById('done').textContent = count;
      document.getElementById('total').textContent = TOTAL;
      document.getElementById('progressBar').style.width = (count / TOTAL * 100) + '%';
      if(sectionOf[key]) markNav(sectionOf[key]);
      if(wasNew && count < TOTAL) toast('Fortschritt gespeichert · ' + count + ' von ' + TOTAL);
      if(count >= TOTAL){ toast('🎉 Alle sechs Kompetenzstufen bearbeitet!'); const fin=document.querySelector('.final'); if(fin) fin.classList.add('celebrate'); }
      try{ localStorage.setItem('completedSet', JSON.stringify([...completed])); }catch(e){}
    }
    function showFeedback(id, text, type='good') { const el = document.getElementById(id); el.className = 'feedback ' + type; el.innerHTML = text; }
    function checkK1() { let score = 0; let details = []; k1Items.forEach((item, i) => { const chosen = document.querySelector(`input[name="k1_${i}"]:checked`); document.querySelectorAll(`input[name="k1_${i}"]`).forEach(r=>{ const lab=r.closest('.choice'); if(!lab) return; lab.classList.remove('correct','incorrect'); if(r.checked){ lab.classList.add(r.value===item[1]?'correct':'incorrect'); } if(r.value===item[1] && chosen && chosen.value!==item[1]){ lab.classList.add('correct'); } }); if (chosen && chosen.value === item[1]) score++; else details.push(`${i+1}: ${item[1]} – ${item[2]}`); }); const type = score === k1Items.length ? 'good' : score >= 4 ? 'warn' : 'bad'; showFeedback('k1Feedback', `<strong>${score} von ${k1Items.length} richtig.</strong>${details.length ? '<br><br><strong>Rückmeldung:</strong><br>' + details.join('<br>') : '<br>Sehr gut: Sie unterscheiden Faktenfehler, Perspektivenverengung und auftragsgemässe Fokussierung sicher.'}`, type); setDone('k1'); }
    function toggle(id) { const el = document.getElementById(id); el.style.display = el.style.display === 'block' ? 'none' : 'block'; }
    function saveText(inputId, feedbackId) { const val = document.getElementById(inputId).value.trim(); if (!val) return showFeedback(feedbackId, 'Bitte schreiben Sie zuerst einen Entwurf.', 'warn'); localStorage.setItem(inputId, val); showFeedback(feedbackId, 'Ihr Entwurf wurde in diesem Browser gespeichert. Prüfen Sie nun: Sind Halluzination und Bias klar getrennt? Enthält Ihre Antwort je ein Beispiel?', 'good'); setDone(inputId === 'reflection' ? 'reflection' : 'k2'); }
    function saveTwo(id1,id2,feedbackId) { const a=document.getElementById(id1).value.trim(), b=document.getElementById(id2).value.trim(); if(!a || !b) return showFeedback(feedbackId,'Bitte füllen Sie beide Felder aus.','warn'); localStorage.setItem(id1,a); localStorage.setItem(id2,b); showFeedback(feedbackId,'Gespeichert. Achten Sie bei Ihrem Faktencheck auf Originalquellen; beim Perspektivencheck auf Betroffene, Interessen und mögliche Auslassungen.','good'); setDone('k3'); }
    function saveAnalysis() { const fields=['a1','a2','a3','a4','a5','a6']; const filled=fields.filter(id=>document.getElementById(id).value.trim()).length; fields.forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback('k4Feedback', filled === 6 ? 'Ihre vollständige Analyse wurde gespeichert. Besonders wichtig: Beurteilen Sie die Altersaussage nicht nur als Stilfrage, sondern als mögliches Risiko für unfaire Weiterbildungsentscheide.' : `Sie haben ${filled} von 6 Analysefeldern ausgefüllt. Ergänzen Sie die fehlenden Felder, damit Fakten- und Bias-Risiken vollständig getrennt sichtbar werden.`, filled===6?'good':'warn'); if(filled===6) setDone('k4'); }
    function checkK5() { const choice=document.querySelector('input[name="release"]:checked'); const reason=document.getElementById('k5Reason').value.trim(); const actions=document.getElementById('k5Actions').value.trim(); if(!choice || !reason || !actions) return showFeedback('k5Feedback','Bitte wählen Sie einen Entscheid aus und begründen Sie ihn mit konkreten Überarbeitungen.','warn'); localStorage.setItem('k5Reason',reason); localStorage.setItem('k5Actions',actions); const correct=choice.value==='nicht'; const message=correct ? '<strong>Fachlich überzeugender Entscheid: Nicht freigeben.</strong> Der Text enthält altersbezogene Stereotype, eine einseitige Verantwortungszuweisung und eine pauschale Datenschutzbehauptung. Diese Punkte verlangen eine grundlegende Überarbeitung, nicht nur eine sprachliche Korrektur.' : '<strong>Überdenken Sie den Freigabeentscheid.</strong> Vor einer Veröffentlichung müssen die altersbezogenen Zuschreibungen, die pauschale Verantwortung der Arbeitnehmenden und die Datenschutzbehauptung grundlegend überarbeitet werden. Für diesen Text ist „Nicht freigeben“ die angemessenste Wahl.'; showFeedback('k5Feedback',message,correct?'good':'warn'); setDone('k5'); }
    function saveK6() { const ids=['k6Scope','k6Fact','k6Bias','k6Roles','k6Doc','k6Process']; const filled=ids.filter(id=>document.getElementById(id).value.trim()).length; ids.forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback('k6Feedback', filled===6 ? 'Ihr Qualitätssicherungsprozess wurde gespeichert. Prüfen Sie abschliessend, ob Rollen, Quellenprüfung, Perspektivencheck, Freigabe und Dokumentation eindeutig geregelt sind.' : `Sie haben ${filled} von 6 Bausteinen ausgefüllt. Ein nutzbarer Prozess braucht alle sechs Bausteine.`,filled===6?'good':'warn'); if(filled===6) setDone('k6'); }
    function countWords(s){ const t=(s||'').trim(); return t? t.split(/\s+/).length : 0; }
    function attachWordCount(el){ const wc=document.createElement('span'); wc.className='wordcount'; el.insertAdjacentElement('afterend', wc); const upd=()=>{ const n=countWords(el.value); wc.textContent=n+(n===1?' Wort':' Wörter'); wc.classList.toggle('ok', n>=12); }; el.addEventListener('input', upd); upd(); }

    let saveTimers={};
    function autoSave(el){ clearTimeout(saveTimers[el.id]); saveTimers[el.id]=setTimeout(()=>{ if(el.value.trim()) localStorage.setItem(el.id, el.value); },600); }

    function loadSaved() {
      document.querySelectorAll('textarea').forEach(el=>{
        if(localStorage.getItem(el.id)) el.value=localStorage.getItem(el.id);
        attachWordCount(el);
        el.addEventListener('input', ()=>autoSave(el));
      });
      // restore radio selections
      document.querySelectorAll('input[type="radio"]').forEach(r=>{ const key='radio_'+r.name; if(localStorage.getItem(key)===r.value){ r.checked=true; } });
      document.querySelectorAll('input[type="radio"]').forEach(r=>{
        r.addEventListener('change', ()=>{ localStorage.setItem('radio_'+r.name, r.value); document.querySelectorAll('input[name="'+r.name+'"]').forEach(x=>{ const lab=x.closest('.choice'); if(lab) lab.classList.toggle('chosen', x.checked); }); });
      });
      // initial chosen highlight
      document.querySelectorAll('input[type="radio"]:checked').forEach(r=>{ const lab=r.closest('.choice'); if(lab) lab.classList.add('chosen'); });
      // restore completion state
      try{ const saved=JSON.parse(localStorage.getItem('completedSet')||'[]'); saved.forEach(k=>{ completed.add(k); if(sectionOf[k]) markNav(sectionOf[k]); }); const c=completed.size; document.getElementById('done').textContent=c; document.getElementById('total').textContent=TOTAL; document.getElementById('progressBar').style.width=(c/TOTAL*100)+'%'; if(c>=TOTAL){ const fin=document.querySelector('.final'); if(fin) fin.classList.add('celebrate'); } }catch(e){}
    }
    /* ---------- KI-Chat ---------- */
    // Sammelt den aktuellen Antwort-Kontext einer Kompetenzstufe (was die lernende Person geschrieben hat).
    const chatContext = {
      k1: () => { const picks = k1Items.map((it,i)=>{ const c=document.querySelector(`input[name=\"k1_${i}\"]:checked`); return `${i+1}) ${c?c.value:'—'}`; }).join(', '); return 'Aufgabe K1 (Zuordnung H/B/K). Aktuelle Auswahl: '+picks; },
      k2: () => 'Aufgabe K2 (Unterschied Halluzination vs. Bias erklären). Antwort der lernenden Person:\n'+(document.getElementById('k2Text').value||'(leer)'),
      k3: () => 'Aufgabe K3. Faktencheck-Behauptungen:\n'+(document.getElementById('k3Facts').value||'(leer)')+'\nPrüfplan:\n'+(document.getElementById('k3Steps').value||'(leer)')+'\nPerspektiven:\n'+(document.getElementById('k3Perspective').value||'(leer)')+'\nErgänzungssätze:\n'+(document.getElementById('k3Rewrite').value||'(leer)'),
      k4: () => { const ids=['a1','a2','a3','a4','a5','a6']; const labels=['Fakten','Halluzinationen/Quellen','Perspektiven','Stereotype','Folgen','Überarbeitungen']; return 'Aufgabe K4 (Doppelrisiko-Analyse):\n'+ids.map((id,i)=>labels[i]+': '+(document.getElementById(id).value||'(leer)')).join('\n'); },
      k5: () => { const c=document.querySelector('input[name=\"release\"]:checked'); return 'Aufgabe K5 (Freigabeentscheid). Entscheid: '+(c?c.value:'(keiner)')+'\nBegründung:\n'+(document.getElementById('k5Reason').value||'(leer)')+'\nÜberarbeitungen:\n'+(document.getElementById('k5Actions').value||'(leer)'); },
      k6: () => { const ids=['k6Scope','k6Fact','k6Bias','k6Roles','k6Doc','k6Process']; return 'Aufgabe K6 (Qualitätssicherungsprozess):\n'+ids.map(id=>id+': '+(document.getElementById(id).value||'(leer)')).join('\n'); }
    };

    function buildChat(sectionKey, ctxMap){
      ctxMap = ctxMap || chatContext;
      const wrap = document.createElement('div');
      wrap.className = 'chat';
      wrap.style.display = 'none';
      wrap.innerHTML = `
        <div class="chat-head">
          <strong>KI-Assistent</strong>
          <div class="chat-modes">
            <button type="button" data-mode="coach" class="active">Feedback-Coach</button>
            <button type="button" data-mode="partner">Übungspartner</button>
          </div>
        </div>
        <div class="chat-log"></div>
        <div class="chat-input">
          <textarea placeholder="Ihre Frage oder Bitte um Feedback …"></textarea>
          <button type="button">Senden</button>
        </div>
        <div class="chat-hint">Der Coach bewertet Ihre Antwort zu dieser Aufgabe. Der Übungspartner beantwortet Fragen zum Thema. Kein Ersatz für eigenes Prüfen an Originalquellen.</div>`;

      const log = wrap.querySelector('.chat-log');
      const ta = wrap.querySelector('.chat-input textarea');
      const sendBtn = wrap.querySelector('.chat-input button');
      const modeBtns = wrap.querySelectorAll('.chat-modes button');
      let mode = 'coach';
      const history = [];

      function addMsg(role, text){ const d=document.createElement('div'); d.className='msg '+role; d.textContent=text; log.appendChild(d); log.scrollTop=log.scrollHeight; return d; }

      modeBtns.forEach(b=>b.addEventListener('click', ()=>{ mode=b.dataset.mode; modeBtns.forEach(x=>x.classList.toggle('active', x===b)); addMsg('sys', mode==='coach' ? 'Modus: Feedback-Coach – ich gebe Ihnen Rückmeldung zu dieser Aufgabe.' : 'Modus: Übungspartner – fragen Sie mich alles zu Halluzinationen und Bias.'); }));

      async function send(){
        const text = ta.value.trim();
        if(!text) return;
        addMsg('user', text);
        history.push({ role:'user', content:text });
        ta.value=''; sendBtn.disabled=true;
        const typing = addMsg('bot typing', 'schreibt …');
        try{
          const ctx = (mode==='coach' && ctxMap[sectionKey]) ? ctxMap[sectionKey]() : '';
          const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, context: ctx, messages: history }) });
          const data = await r.json();
          typing.remove();
          if(!r.ok){ addMsg('sys', data.error || 'Es ist ein Fehler aufgetreten.'); }
          else { addMsg('bot', data.reply); history.push({ role:'assistant', content:data.reply }); }
        }catch(e){ typing.remove(); addMsg('sys','Verbindung nicht möglich. Bitte später erneut versuchen.'); }
        sendBtn.disabled=false; ta.focus();
      }
      sendBtn.addEventListener('click', send);
      ta.addEventListener('keydown', e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } });

      addMsg('sys', 'Tippen Sie unten Ihre Frage. Tipp: Bitten Sie den Coach um Feedback zu Ihrer Antwort.');
      return wrap;
    }

    function attachChats(){
      ['k1','k2','k3','k4','k5','k6'].forEach(key=>{
        const sec = document.getElementById(key);
        if(!sec) return;
        const card = sec.querySelector('.card') || sec.querySelector('.grid-2');
        if(!card) return;
        const btn = document.createElement('button');
        btn.type='button'; btn.className='secondary chat-toggle'; btn.textContent='KI-Assistent öffnen';
        const chat = buildChat(key);
        btn.addEventListener('click', ()=>{ const show = chat.style.display==='none'; chat.style.display = show?'block':'none'; btn.textContent = show?'KI-Assistent schliessen':'KI-Assistent öffnen'; });
        card.appendChild(btn);
        card.appendChild(chat);
      });
    }

    if(document.getElementById('k1Quiz')){ renderK1(); loadSaved(); attachChats(); }

    function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
    function nl2br(s){ return esc(s).replace(/\n/g,'<br>'); }
    function answered(val){ return val && val.trim() ? nl2br(val) : '<span class="empty">— nicht ausgefüllt —</span>'; }

    function collectK1(){
      return k1Items.map((item,i)=>{
        const chosen = document.querySelector(`input[name="k1_${i}"]:checked`);
        const val = chosen ? chosen.value : null;
        const ok = val === item[1];
        const mark = val ? (ok ? '✓ richtig' : '✗ erwartet: '+item[1]) : '— keine Auswahl';
        return `<li><span class="q">${i+1}. ${esc(item[0])}</span><br>
          <span class="ans">Ihre Zuordnung: <strong>${val||'—'}</strong> &nbsp;<em>(${mark})</em></span></li>`;
      }).join('');
    }

    function downloadAnswersPDF(){
      const g = id => document.getElementById(id) ? document.getElementById(id).value : '';
      const release = document.querySelector('input[name="release"]:checked');
      const releaseLabels = {freigeben:'Freigeben', ueberarbeiten:'Freigeben nach Überarbeitung', nicht:'Nicht freigeben'};

      const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
      <title>Lernwerk GmbH – Kapitel 3 – Meine Antworten</title>
      <style>
        @page { margin: 18mm 16mm; }
        body { font-family: Georgia, "Times New Roman", serif; color:#172633; line-height:1.5; font-size:11.5pt; }
        h1 { font-size:20pt; margin:0 0 4px; color:#1d2c3c; }
        h2 { font-size:13.5pt; color:#8e3900; border-bottom:2px solid #b94b02; padding-bottom:3px; margin:22px 0 10px; page-break-after:avoid; }
        .meta { color:#5a6875; font-size:10pt; margin-bottom:18px; }
        .task { font-weight:bold; margin:14px 0 4px; }
        .block { margin:0 0 12px; page-break-inside:avoid; }
        .label { font-weight:bold; font-size:10.5pt; color:#2b4057; margin-top:8px; }
        .val { white-space:normal; margin:2px 0 8px; padding:8px 10px; background:#f4f6f8; border-left:3px solid #d5dce2; border-radius:0 6px 6px 0; }
        .empty { color:#9aa6b1; font-style:italic; }
        ul.k1 { list-style:none; padding:0; margin:0; }
        ul.k1 li { margin:0 0 10px; padding-bottom:8px; border-bottom:1px dotted #d5dce2; page-break-inside:avoid; }
        .q { font-size:10.5pt; }
        .ans { font-size:10.5pt; }
        .decision { padding:8px 10px; background:#fff0e6; border-left:3px solid #b94b02; border-radius:0 6px 6px 0; font-weight:bold; }
        footer { margin-top:26px; font-size:9pt; color:#5a6875; border-top:1px solid #d5dce2; padding-top:8px; }
      </style></head><body>
      <h1>Halluzinationen und Bias bei KI erkennen</h1>
      <div class="meta">Lernwerk GmbH · Kapitel 3 · Meine Antworten · ${new Date().toLocaleDateString('de-CH',{year:'numeric',month:'long',day:'numeric'})}</div>

      <h2>K1 · Wissen: Halluzination, Bias oder unklar?</h2>
      <ul class="k1">${collectK1()}</ul>

      <h2>K2 · Verstehen: Unterschied erklären</h2>
      <div class="block"><div class="val">${answered(g('k2Text'))}</div></div>

      <h2>K3 · Anwenden: Fakten- und Perspektivencheck</h2>
      <div class="block"><div class="task">Aufgabe 3 – Faktencheck (Studie prüfen)</div>
        <div class="label">Überprüfbare Behauptungen</div><div class="val">${answered(g('k3Facts'))}</div>
        <div class="label">Konkreter Prüfplan</div><div class="val">${answered(g('k3Steps'))}</div></div>
      <div class="block"><div class="task">Aufgabe 4 – Perspektivencheck (Einseitigkeit erkennen)</div>
        <div class="label">Dominante und fehlende Perspektiven</div><div class="val">${answered(g('k3Perspective'))}</div>
        <div class="label">Ausgewogenere Ergänzungssätze</div><div class="val">${answered(g('k3Rewrite'))}</div></div>

      <h2>K4 · Analysieren: Doppelrisiko (Fall Lernwerk GmbH)</h2>
      <div class="block">
        <div class="label">Überprüfbare Faktenbehauptungen</div><div class="val">${answered(g('a1'))}</div>
        <div class="label">Mögliche Halluzinationen / Quellenlücken</div><div class="val">${answered(g('a2'))}</div>
        <div class="label">Dominierende und fehlende Perspektiven</div><div class="val">${answered(g('a3'))}</div>
        <div class="label">Stereotype / problematische Verallgemeinerungen</div><div class="val">${answered(g('a4'))}</div>
        <div class="label">Mögliche Folgen bei ungeprüfter Verwendung</div><div class="val">${answered(g('a5'))}</div>
        <div class="label">Konkrete Überarbeitungen</div><div class="val">${answered(g('a6'))}</div></div>

      <h2>K5 · Evaluieren: Freigabeentscheid</h2>
      <div class="block">
        <div class="decision">Entscheid: ${release ? releaseLabels[release.value] : '<span class="empty">— nicht gewählt —</span>'}</div>
        <div class="label">Begründung</div><div class="val">${answered(g('k5Reason'))}</div>
        <div class="label">Verpflichtende Überarbeitungen</div><div class="val">${answered(g('k5Actions'))}</div></div>

      <h2>K6 · Erstellen: Qualitätssicherungsprozess</h2>
      <div class="block">
        <div class="label">1. Geltungsbereich und Risikostufen</div><div class="val">${answered(g('k6Scope'))}</div>
        <div class="label">2. Faktencheck</div><div class="val">${answered(g('k6Fact'))}</div>
        <div class="label">3. Perspektiven- und Bias-Check</div><div class="val">${answered(g('k6Bias'))}</div>
        <div class="label">4. Rollen und Vier-Augen-Prinzip</div><div class="val">${answered(g('k6Roles'))}</div>
        <div class="label">5. Dokumentation</div><div class="val">${answered(g('k6Doc'))}</div>
        <div class="label">6. Prozess in 5–8 Schritten</div><div class="val">${answered(g('k6Process'))}</div></div>

      <h2>Abschlussreflexion</h2>
      <div class="block"><div class="label">Meine persönliche Prüffrage</div><div class="val">${answered(g('reflection'))}</div></div>

      <footer>Interaktive Lernsequenz · Lernwerk GmbH · Kapitel 3: Halluzinationen und Bias</footer>
      <script>window.onload=function(){window.print();}<\/script>
      </body></html>`;

      const w = window.open('', '_blank');
      if(!w){ alert('Bitte Pop-ups für diese Seite erlauben, damit das PDF erstellt werden kann.'); return; }
      w.document.open(); w.document.write(html); w.document.close();
    }
  
    /* ================= MODUL 2 LOGIK ================= */
    const m2k1Items = [
      ['Trainingsdaten sind die Texte und Beispiele, aus denen ein Sprachmodell seine Muster gelernt hat.', 'R', 'Genau: Aus diesen Daten stammen die Wahrscheinlichkeiten, mit denen das Modell arbeitet.'],
      ['Ein Sprachmodell versteht den Inhalt eines Satzes so wie ein Mensch.', 'F', 'Es sagt das wahrscheinlichste nächste Textstück voraus, ohne echtes Verständnis.'],
      ['Ein Sprachmodell erzeugt Text, indem es Wort für Wort das wahrscheinlichste nächste Element vorhersagt.', 'R', 'Das ist die Grundmechanik der Textgenerierung.'],
      ['Wenn eine KI-Antwort flüssig und plausibel klingt, ist sie deshalb auch inhaltlich korrekt.', 'F', 'Plausibilität ist kein Beleg für Wahrheit – eine flüssige Antwort kann trotzdem falsch sein.'],
      ['Das Kontextfenster begrenzt, wie viel Text ein Modell gleichzeitig berücksichtigen kann.', 'R', 'Bei sehr langen Dokumenten oder Gesprächen können frühere Teile aus dem Blick geraten.'],
      ['Ein Modell kennt automatisch alle tagesaktuellen Ereignisse.', 'F', 'Das Wissen reicht nur so weit wie die Trainingsdaten; Aktuelles fehlt oft.']
    ];
    const M2TOTAL = 6;
    const m2sectionOf = { m2k1:'m2k1', m2k2:'m2k2', m2k3:'m2k3', m2k4:'m2k4', m2k5:'m2k5', m2k6:'m2k6' };
    const m2completed = new Set();

    function m2renderK1() { const target = document.getElementById('m2k1Quiz'); if(!target || target.querySelector('fieldset')) return; target.innerHTML = m2k1Items.map((item, i) => `<fieldset style="border:0;padding:0;margin:0"><legend><strong>${i+1}.</strong> ${item[0]}</legend><div class="choices" style="grid-template-columns:repeat(2,minmax(0,1fr));margin:7px 0 13px">${[['R','richtig'],['F','falsch']].map(o => `<label class="choice"><input type="radio" name="m2k1_${i}" value="${o[0]}"> ${o[1]}</label>`).join('')}</div></fieldset>`).join(''); }

    function m2markNav(key){ const a=document.querySelector('.nav a[href="#'+key+'"]'); if(a) a.classList.add('nav-done'); const sec=document.getElementById(key); if(sec){ sec.classList.add('is-done'); const b=sec.querySelector('.badge'); if(b) b.classList.add('badge-done'); } }

    function m2setDone(key) {
      const wasNew = !m2completed.has(key);
      m2completed.add(key);
      const count = m2completed.size;
      document.getElementById('m2done').textContent = count;
      document.getElementById('m2total').textContent = M2TOTAL;
      document.getElementById('m2progressBar').style.width = (count / M2TOTAL * 100) + '%';
      if(m2sectionOf[key]) m2markNav(m2sectionOf[key]);
      if(wasNew && count < M2TOTAL) toast('Kapitel 2: Fortschritt gespeichert · ' + count + ' von ' + M2TOTAL);
      if(count >= M2TOTAL){ toast('🎉 Kapitel 2 vollständig bearbeitet!'); const fin=document.getElementById('m2final'); if(fin) fin.classList.add('celebrate'); }
      try{ localStorage.setItem('m2completedSet', JSON.stringify([...m2completed])); }catch(e){}
    }

    function m2checkK1() { let score = 0; let details = []; m2k1Items.forEach((item, i) => { const chosen = document.querySelector(`input[name="m2k1_${i}"]:checked`); document.querySelectorAll(`input[name="m2k1_${i}"]`).forEach(r=>{ const lab=r.closest('.choice'); if(!lab) return; lab.classList.remove('correct','incorrect'); if(r.checked){ lab.classList.add(r.value===item[1]?'correct':'incorrect'); } if(r.value===item[1] && chosen && chosen.value!==item[1]){ lab.classList.add('correct'); } }); if (chosen && chosen.value === item[1]) score++; else details.push(`${i+1}: ${item[1]==='R'?'richtig':'falsch'} – ${item[2]}`); }); const type = score === m2k1Items.length ? 'good' : score >= 4 ? 'warn' : 'bad'; showFeedback('m2k1Feedback', `<strong>${score} von ${m2k1Items.length} richtig.</strong>${details.length ? '<br><br><strong>Rückmeldung:</strong><br>' + details.join('<br>') : '<br>Sehr gut: Sie unterscheiden Funktionsweise, Trainingsdaten und Grenzen sicher.'}`, type); m2setDone('m2k1'); }

    function m2saveText(inputId, feedbackId, doneKey) { const val = document.getElementById(inputId).value.trim(); if (!val) return showFeedback(feedbackId, 'Bitte schreiben Sie zuerst einen Entwurf.', 'warn'); localStorage.setItem(inputId, val); showFeedback(feedbackId, 'Ihr Entwurf wurde in diesem Browser gespeichert. Prüfen Sie: Wird die Wort-für-Wort-Vorhersage deutlich? Trennen Sie flüssige Sprache von tatsächlicher Korrektheit?', 'good'); m2setDone(doneKey); }
    function m2saveTwo(id1,id2,feedbackId,doneKey) { const a=document.getElementById(id1).value.trim(), b=document.getElementById(id2).value.trim(); if(!a || !b) return showFeedback(feedbackId,'Bitte füllen Sie beide Felder aus.','warn'); localStorage.setItem(id1,a); localStorage.setItem(id2,b); showFeedback(feedbackId,'Gespeichert. Achten Sie darauf: Für aktuelle oder lokale Fakten sind allgemeine Trainingsdaten oft nicht ausreichend.','good'); m2setDone(doneKey); }
    function m2saveThree(id1,id2,id3,feedbackId,doneKey) { const vals=[id1,id2,id3].map(id=>document.getElementById(id).value.trim()); if(vals.some(v=>!v)) return showFeedback(feedbackId,'Bitte füllen Sie alle drei Felder aus.','warn'); [id1,id2,id3].forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback(feedbackId,'Analyse gespeichert. Kernpunkt: Eine plausible Form (Namen, ISBN, Prozentzahl) ist kein Beleg – nur unabhängige Quellen sind es.','good'); m2setDone(doneKey); }
    function m2checkK5() { const choice=document.querySelector('input[name="m2trust"]:checked'); const reason=document.getElementById('m2k5Reason').value.trim(); if(!choice || !reason) return showFeedback('m2k5Feedback','Bitte wählen Sie eine Option und begründen Sie sie.','warn'); localStorage.setItem('m2k5Reason',reason); const correct=choice.value==='a'; const message=correct ? '<strong>Überzeugende Wahl: die geprüfte Erstformulierung.</strong> Hier nutzt man die Stärke des Modells (Sprache), während eine Person die Korrektheit verantwortet. Verbindliche Fristen und ungeprüfte Veröffentlichungen bergen wegen Aktualitäts- und Plausibilitätsrisiken zu grosse Gefahren.' : '<strong>Überdenken Sie die Wahl.</strong> Verbindliche Auskünfte zu Fristen und ungeprüfte Veröffentlichungen sind riskant: Trainingsdaten können veraltet sein, und plausibel klingende Angaben können falsch sein. Vertretbar ist die Erstformulierung, die anschliessend geprüft wird.'; showFeedback('m2k5Feedback',message,correct?'good':'warn'); m2setDone('m2k5'); }
    function m2saveK6() { const ids=['m2k6Rule','m2k6Check','m2k6Context','m2k6When','m2k6Who','m2k6Steps']; const filled=ids.filter(id=>document.getElementById(id).value.trim()).length; ids.forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback('m2k6Feedback', filled===6 ? 'Ihre Umgangsregel wurde gespeichert. Prüfen Sie abschliessend, ob Plausibilitätsfalle, Quellenprüfung, Kontextfenster und Verantwortung klar geregelt sind.' : `Sie haben ${filled} von 6 Bausteinen ausgefüllt. Eine tragfähige Regel braucht alle sechs.`,filled===6?'good':'warn'); if(filled===6) m2setDone('m2k6'); }

    function m2loadSaved() {
      try{ const saved=JSON.parse(localStorage.getItem('m2completedSet')||'[]'); saved.forEach(k=>{ m2completed.add(k); if(m2sectionOf[k]) m2markNav(m2sectionOf[k]); }); const c=m2completed.size; document.getElementById('m2done').textContent=c; document.getElementById('m2total').textContent=M2TOTAL; document.getElementById('m2progressBar').style.width=(c/M2TOTAL*100)+'%'; if(c>=M2TOTAL){ const fin=document.getElementById('m2final'); if(fin) fin.classList.add('celebrate'); } }catch(e){}
    }

    const m2chatContext = {
      m2k1: () => { const picks = m2k1Items.map((it,i)=>{ const c=document.querySelector(`input[name="m2k1_${i}"]:checked`); return `${i+1}) ${c?c.value:'—'}`; }).join(', '); return 'Kapitel 2, Aufgabe K1 (richtig/falsch zu KI-Grundbegriffen). Auswahl: '+picks; },
      m2k2: () => 'Kapitel 2, Aufgabe K2 (erklären, wie ein Sprachmodell Text erzeugt). Antwort:\n'+(document.getElementById('m2k2Text').value||'(leer)'),
      m2k3: () => 'Kapitel 2, Aufgabe K3 (Trainingsdaten-Wirkung).\nGut geeignet:\n'+(document.getElementById('m2k3Good').value||'(leer)')+'\nVorsicht:\n'+(document.getElementById('m2k3Bad').value||'(leer)'),
      m2k4: () => 'Kapitel 2, Aufgabe K4 (plausibel aber falsch).\nWarum glaubwürdig:\n'+(document.getElementById('m2k4Why').value||'(leer)')+'\nPrüfung:\n'+(document.getElementById('m2k4Check').value||'(leer)')+'\nBezug Funktionsweise:\n'+(document.getElementById('m2k4Reason').value||'(leer)'),
      m2k5: () => { const c=document.querySelector('input[name="m2trust"]:checked'); return 'Kapitel 2, Aufgabe K5 (Grenzen einschätzen). Wahl: '+(c?c.value:'(keine)')+'\nBegründung:\n'+(document.getElementById('m2k5Reason').value||'(leer)'); },
      m2k6: () => { const ids=['m2k6Rule','m2k6Check','m2k6Context','m2k6When','m2k6Who','m2k6Steps']; return 'Kapitel 2, Aufgabe K6 (Umgangsregel):\n'+ids.map(id=>id+': '+(document.getElementById(id).value||'(leer)')).join('\n'); }
    };

    function m2attachChats(){
      ['m2k1','m2k2','m2k3','m2k4','m2k5','m2k6'].forEach(key=>{
        const sec = document.getElementById(key);
        if(!sec) return;
        const card = sec.querySelector('.card') || sec.querySelector('.grid-2');
        if(!card) return;
        const btn = document.createElement('button');
        btn.type='button'; btn.className='secondary chat-toggle'; btn.textContent='KI-Assistent öffnen';
        const chat = buildChat(key, m2chatContext);
        btn.addEventListener('click', ()=>{ const show = chat.style.display==='none'; chat.style.display = show?'block':'none'; btn.textContent = show?'KI-Assistent schliessen':'KI-Assistent öffnen'; });
        card.appendChild(btn);
        card.appendChild(chat);
      });
    }

    function m2downloadAnswersPDF(){
      const g = id => document.getElementById(id) ? document.getElementById(id).value : '';
      const trust = document.querySelector('input[name="m2trust"]:checked');
      const trustLabels = {a:'Geprüfte Erstformulierung', b:'Verbindliche Fristauskunft ohne Prüfung', c:'Automatische Veröffentlichung ohne Kontrolle'};
      const m2collectK1 = () => m2k1Items.map((item,i)=>{ const c=document.querySelector(`input[name="m2k1_${i}"]:checked`); const val=c?c.value:null; const ok=val===item[1]; const mark=val?(ok?'✓ richtig':'✗ erwartet: '+(item[1]==='R'?'richtig':'falsch')):'— keine Auswahl'; return `<li><span class="q">${i+1}. ${esc(item[0])}</span><br><span class="ans">Ihre Antwort: <strong>${val?(val==='R'?'richtig':'falsch'):'—'}</strong> &nbsp;<em>(${mark})</em></span></li>`; }).join('');
      const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Lernwerk GmbH – Kapitel 2 – Meine Antworten</title>
      <style>@page{margin:18mm 16mm}body{font-family:Georgia,serif;color:#172633;line-height:1.5;font-size:11.5pt}h1{font-size:20pt;margin:0 0 4px;color:#1d2c3c}h2{font-size:13.5pt;color:#8e3900;border-bottom:2px solid #b94b02;padding-bottom:3px;margin:22px 0 10px;page-break-after:avoid}.meta{color:#5a6875;font-size:10pt;margin-bottom:18px}.task{font-weight:bold;margin:14px 0 4px}.block{margin:0 0 12px;page-break-inside:avoid}.label{font-weight:bold;font-size:10.5pt;color:#2b4057;margin-top:8px}.val{margin:2px 0 8px;padding:8px 10px;background:#f4f6f8;border-left:3px solid #d5dce2;border-radius:0 6px 6px 0}.empty{color:#9aa6b1;font-style:italic}ul.k1{list-style:none;padding:0;margin:0}ul.k1 li{margin:0 0 10px;padding-bottom:8px;border-bottom:1px dotted #d5dce2}.decision{padding:8px 10px;background:#fff0e6;border-left:3px solid #b94b02;border-radius:0 6px 6px 0;font-weight:bold}footer{margin-top:26px;font-size:9pt;color:#5a6875;border-top:1px solid #d5dce2;padding-top:8px}</style></head><body>
      <h1>KI verstehen: Daten, Textgenerierung und Grenzen</h1>
      <div class="meta">Lernwerk GmbH · Kapitel 2 · Meine Antworten · ${new Date().toLocaleDateString('de-CH',{year:'numeric',month:'long',day:'numeric'})}</div>
      <h2>K1 · Wissen: richtig oder falsch</h2><ul class="k1">${m2collectK1()}</ul>
      <h2>K2 · Verstehen: Textgenerierung erklären</h2><div class="block"><div class="val">${answered(g('m2k2Text'))}</div></div>
      <h2>K3 · Anwenden: Trainingsdaten und ihre Wirkung</h2><div class="block"><div class="label">Gut geeignet</div><div class="val">${answered(g('m2k3Good'))}</div><div class="label">Vorsicht geboten</div><div class="val">${answered(g('m2k3Bad'))}</div></div>
      <h2>K4 · Analysieren: plausibel, aber falsch</h2><div class="block"><div class="label">Warum glaubwürdig</div><div class="val">${answered(g('m2k4Why'))}</div><div class="label">Prüfung</div><div class="val">${answered(g('m2k4Check'))}</div><div class="label">Bezug zur Funktionsweise</div><div class="val">${answered(g('m2k4Reason'))}</div></div>
      <h2>K5 · Evaluieren: Grenzen einschätzen</h2><div class="block"><div class="decision">Wahl: ${trust ? trustLabels[trust.value] : '<span class="empty">— nicht gewählt —</span>'}</div><div class="label">Begründung</div><div class="val">${answered(g('m2k5Reason'))}</div></div>
      <h2>K6 · Erstellen: Umgangsregel</h2><div class="block"><div class="label">1. Grundregel</div><div class="val">${answered(g('m2k6Rule'))}</div><div class="label">2. Prüfung zentraler Aussagen</div><div class="val">${answered(g('m2k6Check'))}</div><div class="label">3. Kontextfenster</div><div class="val">${answered(g('m2k6Context'))}</div><div class="label">4. Geeignet / ungeeignet</div><div class="val">${answered(g('m2k6When'))}</div><div class="label">5. Prüfung und Freigabe</div><div class="val">${answered(g('m2k6Who'))}</div><div class="label">6. Merkhilfe in Schritten</div><div class="val">${answered(g('m2k6Steps'))}</div></div>
      <h2>Abschlussreflexion</h2><div class="block"><div class="val">${answered(g('m2reflection'))}</div></div>
      <footer>Interaktive Lernsequenz · Lernwerk GmbH · Kapitel 2: KI verstehen</footer>
      <script>window.onload=function(){window.print();}<\/script></body></html>`;
      const w = window.open('', '_blank');
      if(!w){ alert('Bitte Pop-ups für diese Seite erlauben, damit das PDF erstellt werden kann.'); return; }
      w.document.open(); w.document.write(html); w.document.close();
    }

    if(document.getElementById('m2k1Quiz')){ m2renderK1(); m2loadSaved(); m2attachChats(); }

    /* ================= KAPITEL 1 LOGIK ================= */
    const c1k1Items = [
      ['Der Oberbegriff für Systeme, die Aufgaben lösen, für die man sonst menschliche Intelligenz braucht.', 'KI', 'Künstliche Intelligenz ist der weiteste Begriff und umfasst die anderen.'],
      ['Ein Teilbereich, bei dem Systeme aus Daten Muster lernen, statt fest programmiert zu werden.', 'ML', 'Machine Learning ist der lernende Teilbereich der KI.'],
      ['Eine Anwendung, die neue Inhalte wie Texte, Bilder oder Töne erzeugt.', 'GEN', 'Generative KI erzeugt neue Inhalte.'],
      ['Ein bestimmtes generatives Modell, das auf Sprache spezialisiert ist.', 'LLM', 'Ein Large Language Model ist ein Sprachmodell und damit ein Spezialfall generativer KI.'],
      ['Ein E-Mail-Programm, das nach festen, von Menschen programmierten Regeln Nachrichten sortiert – ganz ohne Lernen aus Daten.', 'KI', 'Regelbasierte Automatisierung zählt allenfalls zur klassischen KI, ist aber kein Machine Learning, da nichts aus Daten gelernt wird.'],
      ['Ein System, das aus vielen Beispielbildern gelernt hat, Katzen von Hunden zu unterscheiden.', 'ML', 'Aus Daten gelernte Unterscheidung ist typisches Machine Learning, aber nicht generativ.']
    ];
    const C1TOTAL = 6;
    const c1sectionOf = { c1k1:'c1k1', c1k2:'c1k2', c1k3:'c1k3', c1k4:'c1k4', c1k5:'c1k5', c1k6:'c1k6' };
    const c1completed = new Set();
    const c1choices = [['KI','KI'],['ML','ML'],['GEN','GEN'],['LLM','LLM']];

    function c1renderK1() { const target = document.getElementById('c1k1Quiz'); if(!target || target.querySelector('fieldset')) return; target.innerHTML = c1k1Items.map((item, i) => `<fieldset style="border:0;padding:0;margin:0"><legend><strong>${i+1}.</strong> ${item[0]}</legend><div class="choices" style="grid-template-columns:repeat(4,minmax(0,1fr));margin:7px 0 13px">${c1choices.map(o => `<label class="choice"><input type="radio" name="c1k1_${i}" value="${o[0]}"> ${o[1]}</label>`).join('')}</div></fieldset>`).join(''); }

    function c1markNav(key){ const a=document.querySelector('.nav a[href="#'+key+'"]'); if(a) a.classList.add('nav-done'); const sec=document.getElementById(key); if(sec){ sec.classList.add('is-done'); const b=sec.querySelector('.badge'); if(b) b.classList.add('badge-done'); } }

    function c1setDone(key) {
      const wasNew = !c1completed.has(key);
      c1completed.add(key);
      const count = c1completed.size;
      document.getElementById('c1done').textContent = count;
      document.getElementById('c1total').textContent = C1TOTAL;
      document.getElementById('c1progressBar').style.width = (count / C1TOTAL * 100) + '%';
      if(c1sectionOf[key]) c1markNav(c1sectionOf[key]);
      if(wasNew && count < C1TOTAL) toast('Kapitel 1: Fortschritt gespeichert · ' + count + ' von ' + C1TOTAL);
      if(count >= C1TOTAL){ toast('🎉 Kapitel 1 vollständig bearbeitet!'); const fin=document.getElementById('c1final'); if(fin) fin.classList.add('celebrate'); }
      try{ localStorage.setItem('c1completedSet', JSON.stringify([...c1completed])); }catch(e){}
    }

    function c1checkK1() { let score = 0; let details = []; c1k1Items.forEach((item, i) => { const chosen = document.querySelector(`input[name="c1k1_${i}"]:checked`); document.querySelectorAll(`input[name="c1k1_${i}"]`).forEach(r=>{ const lab=r.closest('.choice'); if(!lab) return; lab.classList.remove('correct','incorrect'); if(r.checked){ lab.classList.add(r.value===item[1]?'correct':'incorrect'); } if(r.value===item[1] && chosen && chosen.value!==item[1]){ lab.classList.add('correct'); } }); if (chosen && chosen.value === item[1]) score++; else details.push(`${i+1}: ${item[1]} – ${item[2]}`); }); const type = score === c1k1Items.length ? 'good' : score >= 4 ? 'warn' : 'bad'; showFeedback('c1k1Feedback', `<strong>${score} von ${c1k1Items.length} richtig.</strong>${details.length ? '<br><br><strong>Rückmeldung:</strong><br>' + details.join('<br>') : '<br>Sehr gut: Sie ordnen KI, ML, generative KI und LLM sicher zu.'}`, type); c1setDone('c1k1'); }

    function c1saveText(inputId, feedbackId, doneKey) { const val = document.getElementById(inputId).value.trim(); if (!val) return showFeedback(feedbackId, 'Bitte schreiben Sie zuerst einen Entwurf.', 'warn'); localStorage.setItem(inputId, val); showFeedback(feedbackId, 'Ihr Entwurf wurde in diesem Browser gespeichert. Prüfen Sie: Wird das Ineinanderliegen der Begriffe (LLM ⊂ generative KI ⊂ ML ⊂ KI) deutlich?', 'good'); c1setDone(doneKey); }
    function c1saveTwo(id1,id2,feedbackId,doneKey) { const a=document.getElementById(id1).value.trim(), b=document.getElementById(id2).value.trim(); if(!a || !b) return showFeedback(feedbackId,'Bitte füllen Sie beide Felder aus.','warn'); localStorage.setItem(id1,a); localStorage.setItem(id2,b); showFeedback(feedbackId,'Gespeichert. Gute Einsatzfelder sind meist Sprach- und Entwurfsaufgaben, die sich anschliessend leicht prüfen lassen.','good'); c1setDone(doneKey); }
    function c1saveThree(id1,id2,id3,feedbackId,doneKey) { const vals=[id1,id2,id3].map(id=>document.getElementById(id).value.trim()); if(vals.some(v=>!v)) return showFeedback(feedbackId,'Bitte füllen Sie alle drei Felder aus.','warn'); [id1,id2,id3].forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback(feedbackId,'Analyse gespeichert. Kernidee: Sprache und Entwürfe sind Stärke; verbindliche, aktuelle Fakten sind Grenze.','good'); c1setDone(doneKey); }
    function c1checkK5() { const choice=document.querySelector('input[name="c1fit"]:checked'); const reason=document.getElementById('c1k5Reason').value.trim(); if(!choice || !reason) return showFeedback('c1k5Feedback','Bitte wählen Sie eine Option und begründen Sie sie.','warn'); localStorage.setItem('c1k5Reason',reason); const correct=choice.value==='a'; const message=correct ? '<strong>Überzeugende Wahl: der geprüfte Terminabsage-Entwurf.</strong> Sprache formulieren ist die Stärke der KI, und das Ergebnis lässt sich leicht prüfen und verantworten. Verbindliche Berechnungen und rechtliche Entscheide gehören nicht allein in die Hand eines Sprachmodells.' : '<strong>Überdenken Sie die Wahl.</strong> Ein verbindlicher Feriensaldo und ein rechtsverbindlicher Entscheid verlangen exakte, überprüfte Grundlagen bzw. juristische Verantwortung – dafür ist ein Sprachmodell allein nicht geeignet. Am ehesten vertretbar ist der geprüfte Textentwurf.'; showFeedback('c1k5Feedback',message,correct?'good':'warn'); c1setDone('c1k5'); }
    function c1saveK6() { const ids=['c1k6Good','c1k6Bad','c1k6Question','c1k6Check','c1k6Who','c1k6Steps']; const filled=ids.filter(id=>document.getElementById(id).value.trim()).length; ids.forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback('c1k6Feedback', filled===6 ? 'Ihre Entscheidungshilfe wurde gespeichert. Prüfen Sie abschliessend, ob geeignete und ungeeignete Aufgaben, Leitfrage, Prüfung und Verantwortung klar geregelt sind.' : `Sie haben ${filled} von 6 Bausteinen ausgefüllt. Eine tragfähige Entscheidungshilfe braucht alle sechs.`,filled===6?'good':'warn'); if(filled===6) c1setDone('c1k6'); }

    function c1loadSaved() {
      try{ const saved=JSON.parse(localStorage.getItem('c1completedSet')||'[]'); saved.forEach(k=>{ c1completed.add(k); if(c1sectionOf[k]) c1markNav(c1sectionOf[k]); }); const c=c1completed.size; document.getElementById('c1done').textContent=c; document.getElementById('c1total').textContent=C1TOTAL; document.getElementById('c1progressBar').style.width=(c/C1TOTAL*100)+'%'; if(c>=C1TOTAL){ const fin=document.getElementById('c1final'); if(fin) fin.classList.add('celebrate'); } }catch(e){}
    }

    const c1chatContext = {
      c1k1: () => { const picks = c1k1Items.map((it,i)=>{ const c=document.querySelector(`input[name="c1k1_${i}"]:checked`); return `${i+1}) ${c?c.value:'—'}`; }).join(', '); return 'Kapitel 1, Aufgabe K1 (Begriffe KI/ML/GEN/LLM zuordnen). Auswahl: '+picks; },
      c1k2: () => 'Kapitel 1, Aufgabe K2 (Zusammenhang der Begriffe erklären). Antwort:\n'+(document.getElementById('c1k2Text').value||'(leer)'),
      c1k3: () => 'Kapitel 1, Aufgabe K3 (Einsatzfelder).\nGeeignet:\n'+(document.getElementById('c1k3Fit').value||'(leer)')+'\nGemeinsames Merkmal:\n'+(document.getElementById('c1k3Why').value||'(leer)'),
      c1k4: () => 'Kapitel 1, Aufgabe K4 (Stärken/Grenzen).\nStärke:\n'+(document.getElementById('c1k4Strength').value||'(leer)')+'\nGrenze:\n'+(document.getElementById('c1k4Limit').value||'(leer)')+'\nRegel:\n'+(document.getElementById('c1k4Rule').value||'(leer)'),
      c1k5: () => { const c=document.querySelector('input[name="c1fit"]:checked'); return 'Kapitel 1, Aufgabe K5 (Eignung entscheiden). Wahl: '+(c?c.value:'(keine)')+'\nBegründung:\n'+(document.getElementById('c1k5Reason').value||'(leer)'); },
      c1k6: () => { const ids=['c1k6Good','c1k6Bad','c1k6Question','c1k6Check','c1k6Who','c1k6Steps']; return 'Kapitel 1, Aufgabe K6 (Entscheidungshilfe):\n'+ids.map(id=>id+': '+(document.getElementById(id).value||'(leer)')).join('\n'); }
    };

    function c1attachChats(){
      ['c1k1','c1k2','c1k3','c1k4','c1k5','c1k6'].forEach(key=>{
        const sec = document.getElementById(key);
        if(!sec) return;
        const card = sec.querySelector('.card') || sec.querySelector('.grid-2');
        if(!card) return;
        const btn = document.createElement('button');
        btn.type='button'; btn.className='secondary chat-toggle'; btn.textContent='KI-Assistent öffnen';
        const chat = buildChat(key, c1chatContext);
        btn.addEventListener('click', ()=>{ const show = chat.style.display==='none'; chat.style.display = show?'block':'none'; btn.textContent = show?'KI-Assistent schliessen':'KI-Assistent öffnen'; });
        card.appendChild(btn);
        card.appendChild(chat);
      });
    }

    function c1downloadAnswersPDF(){
      const g = id => document.getElementById(id) ? document.getElementById(id).value : '';
      const fit = document.querySelector('input[name="c1fit"]:checked');
      const fitLabels = {a:'Geprüfter Terminabsage-Entwurf', b:'Verbindlicher Feriensaldo ohne Prüfung', c:'Rechtsverbindlicher Kündigungsentscheid'};
      const c1collectK1 = () => c1k1Items.map((item,i)=>{ const c=document.querySelector(`input[name="c1k1_${i}"]:checked`); const val=c?c.value:null; const ok=val===item[1]; const mark=val?(ok?'✓ richtig':'✗ erwartet: '+item[1]):'— keine Auswahl'; return `<li><span class="q">${i+1}. ${esc(item[0])}</span><br><span class="ans">Ihre Antwort: <strong>${val||'—'}</strong> &nbsp;<em>(${mark})</em></span></li>`; }).join('');
      const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Lernwerk GmbH – Kapitel 1 – Meine Antworten</title>
      <style>@page{margin:18mm 16mm}body{font-family:Georgia,serif;color:#172633;line-height:1.5;font-size:11.5pt}h1{font-size:20pt;margin:0 0 4px;color:#1d2c3c}h2{font-size:13.5pt;color:#8e3900;border-bottom:2px solid #b94b02;padding-bottom:3px;margin:22px 0 10px;page-break-after:avoid}.meta{color:#5a6875;font-size:10pt;margin-bottom:18px}.block{margin:0 0 12px;page-break-inside:avoid}.label{font-weight:bold;font-size:10.5pt;color:#2b4057;margin-top:8px}.val{margin:2px 0 8px;padding:8px 10px;background:#f4f6f8;border-left:3px solid #d5dce2;border-radius:0 6px 6px 0}.empty{color:#9aa6b1;font-style:italic}ul.k1{list-style:none;padding:0;margin:0}ul.k1 li{margin:0 0 10px;padding-bottom:8px;border-bottom:1px dotted #d5dce2}.decision{padding:8px 10px;background:#fff0e6;border-left:3px solid #b94b02;border-radius:0 6px 6px 0;font-weight:bold}footer{margin-top:26px;font-size:9pt;color:#5a6875;border-top:1px solid #d5dce2;padding-top:8px}</style></head><body>
      <h1>Grundlagen: KI, ML, generative KI und LLM</h1>
      <div class="meta">Lernwerk GmbH · Kapitel 1 · Meine Antworten · ${new Date().toLocaleDateString('de-CH',{year:'numeric',month:'long',day:'numeric'})}</div>
      <h2>K1 · Wissen: Begriffe zuordnen</h2><ul class="k1">${c1collectK1()}</ul>
      <h2>K2 · Verstehen: Zusammenhang erklären</h2><div class="block"><div class="val">${answered(g('c1k2Text'))}</div></div>
      <h2>K3 · Anwenden: Einsatzfelder</h2><div class="block"><div class="label">Geeignete Aufgaben</div><div class="val">${answered(g('c1k3Fit'))}</div><div class="label">Gemeinsames Merkmal</div><div class="val">${answered(g('c1k3Why'))}</div></div>
      <h2>K4 · Analysieren: Stärken und Grenzen</h2><div class="block"><div class="label">Stärke</div><div class="val">${answered(g('c1k4Strength'))}</div><div class="label">Grenze</div><div class="val">${answered(g('c1k4Limit'))}</div><div class="label">Abgeleitete Regel</div><div class="val">${answered(g('c1k4Rule'))}</div></div>
      <h2>K5 · Evaluieren: Eignung entscheiden</h2><div class="block"><div class="decision">Wahl: ${fit ? fitLabels[fit.value] : '<span class="empty">— nicht gewählt —</span>'}</div><div class="label">Begründung</div><div class="val">${answered(g('c1k5Reason'))}</div></div>
      <h2>K6 · Erstellen: Entscheidungshilfe</h2><div class="block"><div class="label">1. Geeignete Aufgaben</div><div class="val">${answered(g('c1k6Good'))}</div><div class="label">2. Ungeeignete Aufgaben</div><div class="val">${answered(g('c1k6Bad'))}</div><div class="label">3. Leitfrage</div><div class="val">${answered(g('c1k6Question'))}</div><div class="label">4. Prüfung des Ergebnisses</div><div class="val">${answered(g('c1k6Check'))}</div><div class="label">5. Verantwortung</div><div class="val">${answered(g('c1k6Who'))}</div><div class="label">6. Kurz-Checkliste</div><div class="val">${answered(g('c1k6Steps'))}</div></div>
      <h2>Abschlussreflexion</h2><div class="block"><div class="val">${answered(g('c1reflection'))}</div></div>
      <footer>Interaktive Lernsequenz · Lernwerk GmbH · Kapitel 1: Grundlagen KI</footer>
      <script>window.onload=function(){window.print();}<\/script></body></html>`;
      const w = window.open('', '_blank');
      if(!w){ alert('Bitte Pop-ups für diese Seite erlauben, damit das PDF erstellt werden kann.'); return; }
      w.document.open(); w.document.write(html); w.document.close();
    }

    if(document.getElementById('c1k1Quiz')){ c1renderK1(); c1loadSaved(); c1attachChats(); }

    /* ================= KAPITEL 4 LOGIK ================= */
    const c4k1Items = [
      ['Ein regelbasiertes System folgt festen, von Menschen vorgegebenen Regeln.', 'R', 'Genau: feste Wenn-dann-Regeln, nachvollziehbar und zuverlässig.'],
      ['Ein lernendes System erkennt Muster aus Daten und kann mit neuen, ähnlichen Fällen umgehen.', 'R', 'Das ist der Kern maschinellen Lernens.'],
      ['Ein überzeugend formulierter LLM-Output ist deshalb auch inhaltlich richtig und für die Aufgabe geeignet.', 'F', 'Form ist kein Beleg für Richtigkeit oder Eignung.'],
      ['Ein LLM ist für exakte, verbindliche Berechnungen das am besten geeignete Werkzeug.', 'F', 'Für exakte Berechnungen sind Tabellen/Rechner geeigneter; ein LLM kann rechnerisch irren.'],
      ['Bei folgenreichen, personenbezogenen Entscheidungen sollte die letzte Verantwortung bei einem Menschen bleiben.', 'R', 'Menschliche Verantwortung und Kontrolle bleiben hier notwendig.'],
      ['Regelbasierte und lernende Ansätze lassen sich sinnvoll kombinieren.', 'R', 'Viele gute Lösungen kombinieren beides.']
    ];
    const C4TOTAL = 6;
    const c4sectionOf = { c4k1:'c4k1', c4k2:'c4k2', c4k3:'c4k3', c4k4:'c4k4', c4k5:'c4k5', c4k6:'c4k6' };
    const c4completed = new Set();

    function c4renderK1() { const target = document.getElementById('c4k1Quiz'); if(!target || target.querySelector('fieldset')) return; target.innerHTML = c4k1Items.map((item, i) => `<fieldset style="border:0;padding:0;margin:0"><legend><strong>${i+1}.</strong> ${item[0]}</legend><div class="choices" style="grid-template-columns:repeat(2,minmax(0,1fr));margin:7px 0 13px">${[['R','richtig'],['F','falsch']].map(o => `<label class="choice"><input type="radio" name="c4k1_${i}" value="${o[0]}"> ${o[1]}</label>`).join('')}</div></fieldset>`).join(''); }

    function c4markNav(key){ const a=document.querySelector('.nav a[href="#'+key+'"]'); if(a) a.classList.add('nav-done'); const sec=document.getElementById(key); if(sec){ sec.classList.add('is-done'); const b=sec.querySelector('.badge'); if(b) b.classList.add('badge-done'); } }

    function c4setDone(key) {
      const wasNew = !c4completed.has(key);
      c4completed.add(key);
      const count = c4completed.size;
      document.getElementById('c4done').textContent = count;
      document.getElementById('c4total').textContent = C4TOTAL;
      document.getElementById('c4progressBar').style.width = (count / C4TOTAL * 100) + '%';
      if(c4sectionOf[key]) c4markNav(c4sectionOf[key]);
      if(wasNew && count < C4TOTAL) toast('Kapitel 4: Fortschritt gespeichert · ' + count + ' von ' + C4TOTAL);
      if(count >= C4TOTAL){ toast('🎉 Kapitel 4 vollständig bearbeitet!'); const fin=document.getElementById('c4final'); if(fin) fin.classList.add('celebrate'); }
      try{ localStorage.setItem('c4completedSet', JSON.stringify([...c4completed])); }catch(e){}
    }

    function c4checkK1() { let score = 0; let details = []; c4k1Items.forEach((item, i) => { const chosen = document.querySelector(`input[name="c4k1_${i}"]:checked`); document.querySelectorAll(`input[name="c4k1_${i}"]`).forEach(r=>{ const lab=r.closest('.choice'); if(!lab) return; lab.classList.remove('correct','incorrect'); if(r.checked){ lab.classList.add(r.value===item[1]?'correct':'incorrect'); } if(r.value===item[1] && chosen && chosen.value!==item[1]){ lab.classList.add('correct'); } }); if (chosen && chosen.value === item[1]) score++; else details.push(`${i+1}: ${item[1]==='R'?'richtig':'falsch'} – ${item[2]}`); }); const type = score === c4k1Items.length ? 'good' : score >= 4 ? 'warn' : 'bad'; showFeedback('c4k1Feedback', `<strong>${score} von ${c4k1Items.length} richtig.</strong>${details.length ? '<br><br><strong>Rückmeldung:</strong><br>' + details.join('<br>') : '<br>Sehr gut: Sie schätzen Systeme, Grenzen und Verantwortung sicher ein.'}`, type); c4setDone('c4k1'); }

    function c4saveText(inputId, feedbackId, doneKey) { const val = document.getElementById(inputId).value.trim(); if (!val) return showFeedback(feedbackId, 'Bitte schreiben Sie zuerst einen Entwurf.', 'warn'); localStorage.setItem(inputId, val); showFeedback(feedbackId, 'Ihr Entwurf wurde in diesem Browser gespeichert. Prüfen Sie: Wird der Unterschied zwischen festen Regeln und aus Daten gelernten Mustern deutlich?', 'good'); c4setDone(doneKey); }
    function c4saveTwo(id1,id2,feedbackId,doneKey) { const a=document.getElementById(id1).value.trim(), b=document.getElementById(id2).value.trim(); if(!a || !b) return showFeedback(feedbackId,'Bitte füllen Sie beide Felder aus.','warn'); localStorage.setItem(id1,a); localStorage.setItem(id2,b); showFeedback(feedbackId,'Gespeichert. Faustregel: exakte Berechnung → Tabelle/Rechner; feste Abläufe → regelbasiert; Sprache/Entwurf → LLM; oft ist die Kombination am stärksten.','good'); c4setDone(doneKey); }
    function c4saveThree(id1,id2,id3,feedbackId,doneKey) { const vals=[id1,id2,id3].map(id=>document.getElementById(id).value.trim()); if(vals.some(v=>!v)) return showFeedback(feedbackId,'Bitte füllen Sie alle drei Felder aus.','warn'); [id1,id2,id3].forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback(feedbackId,'Analyse gespeichert. Kernidee: Eine überzeugende Form ersetzt keine Prüfung – besonders bei personenbezogenen Empfehlungen.','good'); c4setDone(doneKey); }
    function c4checkK5() { const choice=document.querySelector('input[name="c4control"]:checked'); const reason=document.getElementById('c4k5Reason').value.trim(); if(!choice || !reason) return showFeedback('c4k5Feedback','Bitte wählen Sie eine Option und begründen Sie sie.','warn'); localStorage.setItem('c4k5Reason',reason); const correct=choice.value==='a'; const message=correct ? '<strong>Überzeugende Wahl: das Vorsortieren mit späterer Kontrolle.</strong> Hier unterstützt die KI, während ein Mensch prüfen kann und die Folgen gering sind. Personal- und rechtliche/medizinische Entscheide sind folgenreich und müssen in menschlicher Verantwortung bleiben.' : '<strong>Überdenken Sie die Wahl.</strong> Personalentscheide sowie rechtliche oder medizinische Auskünfte sind folgenreich und betreffen Menschen unmittelbar; sie dürfen nicht allein einem System überlassen werden. Vertretbar ist die unterstützende Vorsortierung mit menschlicher Kontrolle.'; showFeedback('c4k5Feedback',message,correct?'good':'warn'); c4setDone('c4k5'); }
    function c4saveK6() { const ids=['c4k6Rule','c4k6Combo','c4k6Convince','c4k6Human','c4k6Who','c4k6Steps']; const filled=ids.filter(id=>document.getElementById(id).value.trim()).length; ids.forEach(id=>localStorage.setItem(id,document.getElementById(id).value)); showFeedback('c4k6Feedback', filled===6 ? 'Ihre Auswahlhilfe wurde gespeichert. Prüfen Sie abschliessend, ob Werkzeugwahl, Kombination, Umgang mit überzeugenden Outputs und menschliche Verantwortung klar geregelt sind.' : `Sie haben ${filled} von 6 Bausteinen ausgefüllt. Eine tragfähige Auswahlhilfe braucht alle sechs.`,filled===6?'good':'warn'); if(filled===6) c4setDone('c4k6'); }

    function c4loadSaved() {
      try{ const saved=JSON.parse(localStorage.getItem('c4completedSet')||'[]'); saved.forEach(k=>{ c4completed.add(k); if(c4sectionOf[k]) c4markNav(c4sectionOf[k]); }); const c=c4completed.size; document.getElementById('c4done').textContent=c; document.getElementById('c4total').textContent=C4TOTAL; document.getElementById('c4progressBar').style.width=(c/C4TOTAL*100)+'%'; if(c>=C4TOTAL){ const fin=document.getElementById('c4final'); if(fin) fin.classList.add('celebrate'); } }catch(e){}
    }

    const c4chatContext = {
      c4k1: () => { const picks = c4k1Items.map((it,i)=>{ const c=document.querySelector(`input[name="c4k1_${i}"]:checked`); return `${i+1}) ${c?c.value:'—'}`; }).join(', '); return 'Kapitel 4, Aufgabe K1 (richtig/falsch zu Systemen, Grenzen, Verantwortung). Auswahl: '+picks; },
      c4k2: () => 'Kapitel 4, Aufgabe K2 (regelbasiert vs. lernend erklären). Antwort:\n'+(document.getElementById('c4k2Text').value||'(leer)'),
      c4k3: () => 'Kapitel 4, Aufgabe K3 (Werkzeugwahl).\nZuordnung:\n'+(document.getElementById('c4k3Match').value||'(leer)')+'\nKombination:\n'+(document.getElementById('c4k3Combo').value||'(leer)'),
      c4k4: () => 'Kapitel 4, Aufgabe K4 (überzeugend ≠ geeignet).\nÜberzeugend/kein Beweis:\n'+(document.getElementById('c4k4Convince').value||'(leer)')+'\nRisiken:\n'+(document.getElementById('c4k4Risk').value||'(leer)')+'\nZu prüfen:\n'+(document.getElementById('c4k4Need').value||'(leer)'),
      c4k5: () => { const c=document.querySelector('input[name="c4control"]:checked'); return 'Kapitel 4, Aufgabe K5 (menschliche Kontrolle). Wahl: '+(c?c.value:'(keine)')+'\nBegründung:\n'+(document.getElementById('c4k5Reason').value||'(leer)'); },
      c4k6: () => { const ids=['c4k6Rule','c4k6Combo','c4k6Convince','c4k6Human','c4k6Who','c4k6Steps']; return 'Kapitel 4, Aufgabe K6 (Werkzeug-Auswahlhilfe):\n'+ids.map(id=>id+': '+(document.getElementById(id).value||'(leer)')).join('\n'); }
    };

    function c4attachChats(){
      ['c4k1','c4k2','c4k3','c4k4','c4k5','c4k6'].forEach(key=>{
        const sec = document.getElementById(key);
        if(!sec) return;
        const card = sec.querySelector('.card') || sec.querySelector('.grid-2');
        if(!card) return;
        const btn = document.createElement('button');
        btn.type='button'; btn.className='secondary chat-toggle'; btn.textContent='KI-Assistent öffnen';
        const chat = buildChat(key, c4chatContext);
        btn.addEventListener('click', ()=>{ const show = chat.style.display==='none'; chat.style.display = show?'block':'none'; btn.textContent = show?'KI-Assistent schliessen':'KI-Assistent öffnen'; });
        card.appendChild(btn);
        card.appendChild(chat);
      });
    }

    function c4downloadAnswersPDF(){
      const g = id => document.getElementById(id) ? document.getElementById(id).value : '';
      const ctrl = document.querySelector('input[name="c4control"]:checked');
      const ctrlLabels = {a:'Vorsortieren mit späterer Kontrolle', b:'Endgültiger Personalentscheid durch KI', c:'Verbindliche Fachauskunft ohne Fachperson'};
      const c4collectK1 = () => c4k1Items.map((item,i)=>{ const c=document.querySelector(`input[name="c4k1_${i}"]:checked`); const val=c?c.value:null; const ok=val===item[1]; const mark=val?(ok?'✓ richtig':'✗ erwartet: '+(item[1]==='R'?'richtig':'falsch')):'— keine Auswahl'; return `<li><span class="q">${i+1}. ${esc(item[0])}</span><br><span class="ans">Ihre Antwort: <strong>${val?(val==='R'?'richtig':'falsch'):'—'}</strong> &nbsp;<em>(${mark})</em></span></li>`; }).join('');
      const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Lernwerk GmbH – Kapitel 4 – Meine Antworten</title>
      <style>@page{margin:18mm 16mm}body{font-family:Georgia,serif;color:#172633;line-height:1.5;font-size:11.5pt}h1{font-size:20pt;margin:0 0 4px;color:#1d2c3c}h2{font-size:13.5pt;color:#8e3900;border-bottom:2px solid #b94b02;padding-bottom:3px;margin:22px 0 10px;page-break-after:avoid}.meta{color:#5a6875;font-size:10pt;margin-bottom:18px}.block{margin:0 0 12px;page-break-inside:avoid}.label{font-weight:bold;font-size:10.5pt;color:#2b4057;margin-top:8px}.val{margin:2px 0 8px;padding:8px 10px;background:#f4f6f8;border-left:3px solid #d5dce2;border-radius:0 6px 6px 0}.empty{color:#9aa6b1;font-style:italic}ul.k1{list-style:none;padding:0;margin:0}ul.k1 li{margin:0 0 10px;padding-bottom:8px;border-bottom:1px dotted #d5dce2}.decision{padding:8px 10px;background:#fff0e6;border-left:3px solid #b94b02;border-radius:0 6px 6px 0;font-weight:bold}footer{margin-top:26px;font-size:9pt;color:#5a6875;border-top:1px solid #d5dce2;padding-top:8px}</style></head><body>
      <h1>Stärken, Grenzen und Verantwortung</h1>
      <div class="meta">Lernwerk GmbH · Kapitel 4 · Meine Antworten · ${new Date().toLocaleDateString('de-CH',{year:'numeric',month:'long',day:'numeric'})}</div>
      <h2>K1 · Wissen: richtig oder falsch</h2><ul class="k1">${c4collectK1()}</ul>
      <h2>K2 · Verstehen: regelbasiert vs. lernend</h2><div class="block"><div class="val">${answered(g('c4k2Text'))}</div></div>
      <h2>K3 · Anwenden: Werkzeugwahl</h2><div class="block"><div class="label">Zuordnung Aufgabe → Werkzeug</div><div class="val">${answered(g('c4k3Match'))}</div><div class="label">Sinnvolle Kombination</div><div class="val">${answered(g('c4k3Combo'))}</div></div>
      <h2>K4 · Analysieren: überzeugend ≠ geeignet</h2><div class="block"><div class="label">Überzeugend, aber kein Beweis</div><div class="val">${answered(g('c4k4Convince'))}</div><div class="label">Risiken bei ungeprüftem Folgen</div><div class="val">${answered(g('c4k4Risk'))}</div><div class="label">Zu prüfen / ergänzen</div><div class="val">${answered(g('c4k4Need'))}</div></div>
      <h2>K5 · Evaluieren: menschliche Kontrolle</h2><div class="block"><div class="decision">Wahl: ${ctrl ? ctrlLabels[ctrl.value] : '<span class="empty">— nicht gewählt —</span>'}</div><div class="label">Begründung</div><div class="val">${answered(g('c4k5Reason'))}</div></div>
      <h2>K6 · Erstellen: Werkzeug-Auswahlhilfe</h2><div class="block"><div class="label">1. Werkzeugwahl</div><div class="val">${answered(g('c4k6Rule'))}</div><div class="label">2. Kombination</div><div class="val">${answered(g('c4k6Combo'))}</div><div class="label">3. Umgang mit überzeugenden Outputs</div><div class="val">${answered(g('c4k6Convince'))}</div><div class="label">4. Menschliche Letztverantwortung</div><div class="val">${answered(g('c4k6Human'))}</div><div class="label">5. Prüfung und Freigabe</div><div class="val">${answered(g('c4k6Who'))}</div><div class="label">6. Auswahl-Checkliste</div><div class="val">${answered(g('c4k6Steps'))}</div></div>
      <h2>Abschlussreflexion</h2><div class="block"><div class="val">${answered(g('c4reflection'))}</div></div>
      <footer>Interaktive Lernsequenz · Lernwerk GmbH · Kapitel 4: Stärken, Grenzen und Verantwortung</footer>
      <script>window.onload=function(){window.print();}<\/script></body></html>`;
      const w = window.open('', '_blank');
      if(!w){ alert('Bitte Pop-ups für diese Seite erlauben, damit das PDF erstellt werden kann.'); return; }
      w.document.open(); w.document.write(html); w.document.close();
    }

    if(document.getElementById('c4k1Quiz')){ c4renderK1(); c4loadSaved(); c4attachChats(); }

