/* ============================================================
   दविंदर पाल सिंह — Life Architect Coach
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     ⚠️  यहाँ अपना WhatsApp नंबर डालें — country code के साथ,
         बिना + और बिना space के।  उदाहरण: '919812345678'
         जब तक यह खाली है, WhatsApp बटन नीचे संपर्क form तक
         ले जाएँगे (कोई टूटा हुआ link नहीं खुलेगा)।
     ---------------------------------------------------------- */
  var WHATSAPP_NUMBER = '';

  var configured = /^\d{10,15}$/.test(WHATSAPP_NUMBER);

  /* ── WhatsApp links ─────────────────────────────────────── */
  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER +
           (text ? '?text=' + encodeURIComponent(text) : '');
  }

  if (configured) {
    var greeting = 'नमस्ते, मुझे आपकी coaching के बारे में जानना है।';
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
      a.href = waLink(greeting);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ── enquiry form → WhatsApp ────────────────────────────── */
  var form = document.getElementById('enquiry');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var naam   = form.elements.naam.value.trim();
      var shahar = form.elements.shahar.value.trim();
      var baat   = form.elements.baat.value.trim();

      if (!naam) {
        form.elements.naam.setAttribute('aria-invalid', 'true');
        form.elements.naam.focus();
        note.textContent = 'आगे बढ़ने के लिए अपना नाम लिखिए।';
        return;
      }
      form.elements.naam.removeAttribute('aria-invalid');

      var lines = ['नमस्ते, मैं ' + naam + ' बोल रहा/रही हूँ।'];
      if (shahar) lines.push('शहर: ' + shahar);
      lines.push(baat ? baat : 'मुझे आपकी coaching के बारे में जानना है।');
      var text = lines.join('\n');

      if (configured) {
        note.textContent = 'WhatsApp खोला जा रहा है…';
        window.open(waLink(text), '_blank', 'noopener');
      } else {
        note.textContent = 'संपर्क नंबर अभी जुड़ नहीं पाया है। थोड़ी देर बाद कोशिश कीजिए।';
        if (window.console) {
          console.warn('[site] WHATSAPP_NUMBER is not set in assets/js/site.js — ' +
                       'enquiries cannot be delivered until it is filled in.');
        }
      }
    });

    form.addEventListener('input', function (e) {
      if (e.target.hasAttribute('aria-invalid')) {
        e.target.removeAttribute('aria-invalid');
      }
      note.textContent = 'आपका संदेश WhatsApp में खुलेगा, वहीं से भेज दीजिए।';
    });
  }

  /* ── altimeter: fill the rail and light the current level ── */
  var ladder = document.getElementById('ladder');
  var fill   = document.getElementById('railFill');
  var steps  = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var topbar = document.getElementById('topbar');
  var deep   = document.getElementById('prarup');

  var ticking = false;

  function update() {
    ticking = false;
    var mark = window.innerHeight * 0.55;

    if (ladder && fill) {
      var box = ladder.getBoundingClientRect();
      var travelled = mark - box.top;
      var pct = Math.max(0, Math.min(1, travelled / box.height));
      fill.style.height = (pct * 100) + '%';
    }

    var current = null;
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].getBoundingClientRect().top <= mark) current = steps[i];
    }
    for (var j = 0; j < steps.length; j++) {
      steps[j].classList.toggle('is-active', steps[j] === current);
    }

    if (topbar) {
      topbar.classList.toggle('is-stuck', window.scrollY > 24);
      if (deep) {
        topbar.classList.toggle('is-high', deep.getBoundingClientRect().top <= 56);
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ── year ───────────────────────────────────────────────── */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
