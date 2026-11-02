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

  // the Manifestation Calculator builds its own pre-filled message
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

  /* ── the opening question ───────────────────────────────── */
  var root     = document.documentElement;
  var askForm  = document.getElementById('askForm');
  var askInput = document.getElementById('askInput');
  var PROBLEM  = 'dps.problem.v1';
  var ASK_HINT = 'Only you can see this. It stays on your device.';
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showProblem(text) {
    var words = document.getElementById('echoWords');
    var line  = document.getElementById('echoLine');
    var help  = document.getElementById('echoHelp');
    var close = document.getElementById('closeYours');
    words.hidden = !text;
    close.hidden = !text;
    if (text) {
      words.textContent = '“' + text + '”';
      close.textContent = 'You wrote: “' + text + '”. Let’s see where you stand on it.';
      line.textContent = 'You have told me your problem. Let me tell you mine.';
    } else {
      line.textContent = 'Before you tell me your problem, let me tell you mine.';
    }
    help.hidden = !(text && /suicid|kill (my ?self|me)|end (my|it all)|end my life|want to die|wanna die|don.?t want to (live|be here)|no reason to live|khud.?kushi|marna chah|mar jana|जान दे|आत्महत्या|खुदकुशी|मरना चाह/i.test(text));
  }

  function enter(text) {
    root.classList.remove('is-asking');
    try { sessionStorage.setItem('dps.entered', '1'); } catch (e) { /* the page still opens */ }
    if (text) {
      try { localStorage.setItem(PROBLEM, JSON.stringify(text)); } catch (e) { /* carries no further */ }
    }
    showProblem(text);
    onScroll();
    var echo = document.getElementById('echo');
    window.requestAnimationFrame(function () {
      echo.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
      var target = document.getElementById('echoLine');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  if (askForm) {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(PROBLEM)); } catch (e) { saved = null; }
    if (typeof saved === 'string' && saved) {
      askInput.value = saved;
      showProblem(saved);
    }

    askForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = askInput.value.trim();
      if (!v) {
        askInput.setAttribute('aria-invalid', 'true');
        askInput.focus();
        document.getElementById('askHint').textContent = 'Write your problem in a few words, or choose one below.';
        return;
      }
      enter(v);
    });
    askInput.addEventListener('input', function () {
      askInput.removeAttribute('aria-invalid');
      document.getElementById('askHint').textContent = ASK_HINT;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () {
        askInput.value = c.textContent;
        enter(c.textContent);
      });
    });
    document.getElementById('askSkip').addEventListener('click', function () {
      enter(askInput.value.trim());
    });

    // the paragraph you are reading is lit; the rest wait in the dark
    var scenes = document.querySelectorAll('.scene__inner');
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (list) {
        list.forEach(function (it) { it.target.classList.toggle('is-lit', it.isIntersecting); });
      }, { rootMargin: '-30% 0px -30% 0px' });
      Array.prototype.forEach.call(scenes, function (n) { seen.observe(n); });
    } else {
      root.classList.remove('js');
    }
  }

  /* ── altimeter: fill the rail, light the current level ──── */
  var ladder = document.getElementById('ladder');
  var fill   = document.getElementById('railFill');
  var steps  = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var topbar = document.getElementById('topbar');
  var deep   = document.getElementById('format');
  var hero   = document.getElementById('hero');
  var story  = document.getElementById('story');
  var sun    = document.getElementById('sun');
  var dawn   = document.getElementById('dawnbreak');

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
        var night = hero && hero.getBoundingClientRect().top > 56;
        topbar.classList.toggle('is-high', night || deep.getBoundingClientRect().top <= 56);
      }
    }

    // the sun stays below the horizon through the story, and rises at dawn
    if (sun && story && dawn && !calm) {
      var vh = window.innerHeight;
      var s = story.getBoundingClientRect();
      var d = dawn.getBoundingClientRect();
      var through = Math.max(0, Math.min(1, -s.top / Math.max(1, d.top - s.top)));
      var dawning = Math.max(0, Math.min(1, (vh - d.top) / (d.height + vh * 0.5)));
      sun.style.setProperty('--rise', (through * 0.16 + dawning * 1.0).toFixed(4));
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
