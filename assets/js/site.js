/* ============================================================
   Davinder Pal Singh — Life Architect Coach
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     ⚠️  SET THIS before launch: WhatsApp number with country
         code, no "+" and no spaces.  Example: '919812345678'
         While it is empty, the WhatsApp buttons simply scroll
         to the contact form — no broken link is shipped.
     ---------------------------------------------------------- */
  var WHATSAPP_NUMBER = '917009925750';   // +91 70099 25750

  /* ----------------------------------------------------------
     Sample lesson: the YouTube video ID of a real free lesson,
     e.g. 'dQw4w9WgXcQ'. While empty, the section stays hidden.
     ---------------------------------------------------------- */
  var SAMPLE_LESSON_ID = '';

  var configured = /^\d{10,15}$/.test(WHATSAPP_NUMBER);
  var DEFAULT_NOTE = 'Your message opens in WhatsApp — send it from there.';

  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER +
           (text ? '?text=' + encodeURIComponent(text) : '');
  }

  // the readiness check builds its own pre-filled message
  if (configured) window.dpsWaLink = waLink;

  if (configured) {
    var greeting = "Hello, I’d like to know more about your coaching.";
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
      a.href = waLink(greeting);
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  /* ── sample lesson: loads only when someone presses play ── */
  var sample = document.getElementById('sample');
  var sampleBox = document.getElementById('sampleVideo');
  if (sample && sampleBox && /^[\w-]{6,20}$/.test(SAMPLE_LESSON_ID)) {
    sample.hidden = false;
    var play = document.createElement('button');
    play.type = 'button';
    play.className = 'btn btn--sun';
    play.textContent = 'Play the lesson';
    play.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + SAMPLE_LESSON_ID + '?autoplay=1';
      f.title = 'Sample lesson';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      sampleBox.innerHTML = '';
      sampleBox.classList.add('is-playing');
      sampleBox.appendChild(f);
    });
    sampleBox.appendChild(play);
  }

  /* ── enquiry form → WhatsApp ────────────────────────────── */
  var form = document.getElementById('enquiry');
  var note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var city = form.elements.city.value.trim();
      var ask  = form.elements.ask.value.trim();

      if (!name) {
        form.elements.name.setAttribute('aria-invalid', 'true');
        form.elements.name.focus();
        note.textContent = 'Add your name to continue.';
        return;
      }
      form.elements.name.removeAttribute('aria-invalid');

      var lines = ['Hello, this is ' + name + '.'];
      if (city) lines.push('City: ' + city);
      lines.push(ask ? ask : "I’d like to know more about your coaching.");

      if (configured) {
        note.textContent = 'Opening WhatsApp…';
        window.open(waLink(lines.join('\n')), '_blank', 'noopener');
      } else {
        note.textContent = "We couldn’t connect the contact number just now. " +
                           'Please try again shortly.';
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
      note.textContent = DEFAULT_NOTE;
    });
  }

  /* ── altimeter: fill the rail, light the current level ──── */
  var ladder = document.getElementById('ladder');
  var fill   = document.getElementById('railFill');
  var steps  = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var topbar = document.getElementById('topbar');
  var deep   = document.getElementById('format');

  var ticking = false;

  function update() {
    ticking = false;
    var mark = window.innerHeight * 0.55;

    if (ladder && fill) {
      var box = ladder.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (mark - box.top) / box.height));
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

  // opening a level's details changes the height of the climb
  Array.prototype.forEach.call(document.querySelectorAll('.step__more'), function (d) {
    d.addEventListener('toggle', onScroll);
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
