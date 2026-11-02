/* ============================================================
   Manifestation Calculator — flow, rendering, local history
   Depends on calculator-data.js (window.FMR)

   Where you are lives in the URL hash (#q1…#q9, #results), so
   the browser's Back and Forward buttons and refresh all work.
   Everything is saved in this browser only.
   ============================================================ */
(function () {
  'use strict';

  var F = window.FMR;
  if (!F) return;

  var STORE = 'dps.readiness.v1';
  var DRAFT = 'dps.readiness.draft.v1';
  var dims  = F.DIMENSIONS;

  var state = { id: '', goal: '', step: 0, answers: {}, done: false };
  var memory = {};            // used when browser storage is blocked
  var current = null;         // the history entry on the results panel

  var $ = function (id) { return document.getElementById(id); };
  var panels = {
    intro:   $('panel-intro'),
    assess:  $('panel-assess'),
    results: $('panel-results')
  };

  function show(which) {
    Object.keys(panels).forEach(function (k) {
      panels[k].classList.toggle('is-on', k === which);
    });
    toTop();
  }

  // the page uses smooth scrolling for anchors; a new step should simply
  // appear at the top rather than visibly travel there
  function toTop() {
    var root = document.documentElement, was = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = was;
  }

  /* ── storage (per browser; never leaves the device) ─────── */
  function load(key) {
    try {
      var raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch (e) { /* corrupt or blocked: fall through to memory */ }
    return memory[key] === undefined ? null : memory[key];
  }
  function save(key, value) {
    memory[key] = value;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { /* private window, blocked storage: the check still works */ }
  }

  function readHistory() {
    var list = load(STORE);
    if (Object.prototype.toString.call(list) !== '[object Array]') return [];
    return list.filter(function (e) { return e && typeof e.total === 'number' && e.goal; });
  }
  function writeHistory(list) { save(STORE, list.slice(-40)); }

  function saveDraft() {
    save(DRAFT, { id: state.id, goal: state.goal, answers: state.answers, done: state.done });
  }
  function loadDraft() {
    var d = load(DRAFT);
    if (!d || !d.goal || !d.answers) return false;
    state.id = d.id; state.goal = d.goal; state.answers = d.answers; state.done = !!d.done;
    return true;
  }
  function clearDraft() {
    state = { id: '', goal: '', step: 0, answers: {}, done: false };
    delete memory[DRAFT];
    try { localStorage.removeItem(DRAFT); } catch (e) { /* nothing to clear */ }
  }

  function latestReport() {
    var list = readHistory();
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].answers && F.isComplete(list[i].answers)) return list[i];
    }
    return null;
  }

  function sameGoal(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
  }

  function dateText(at) {
    return new Date(at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  /* ── routing ────────────────────────────────────────────── */
  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  function firstIncomplete() {
    for (var s = 0; s < dims.length; s++) {
      if (!stepComplete(s)) return s;
    }
    return dims.length - 1;
  }
  function stepComplete(s) {
    return [0, 1].every(function (i) {
      return typeof state.answers[dims[s].key + '-' + i] === 'number';
    });
  }

  function route() {
    var h = location.hash, m = /^#q([1-9])$/.exec(h);

    if (m) {
      if (!state.goal && !loadDraft()) { toIntro(); return; }
      var wanted = Number(m[1]) - 1;
      var allowed = Math.min(wanted, firstIncomplete());   // no skipping ahead
      if (allowed !== wanted) {
        history.replaceState(null, '', '#q' + (allowed + 1));
      }
      state.step = allowed;
      renderStep();
      show('assess');
      return;
    }
    if (h === '#results') {
      var entry = latestReport();
      if (!entry) { toIntro(); return; }
      renderResults(entry);
      show('results');
      return;
    }
    renderIntro();
    show('intro');
  }

  function toIntro() {
    history.replaceState(null, '', location.pathname + location.search);
    renderIntro();
    show('intro');
  }

  /* ── intro ──────────────────────────────────────────────── */
  function renderIntro() {
    var box = $('returning');
    box.innerHTML = '';
    var last = latestReport(), draft = load(DRAFT);

    if (draft && draft.goal && !draft.done) {
      var answered = Object.keys(draft.answers || {}).length;
      box.appendChild(returningCard(
        'You have an unfinished check',
        '“' + draft.goal + '”, ' + answered + ' of 18 answered.',
        'Continue', function () {
          loadDraft();
          go('#q' + (firstIncomplete() + 1));
        },
        'Start over', function () { clearDraft(); renderIntro(); }
      ));
    } else if (last) {
      var done = last.tracker ? last.tracker.days.filter(Boolean).length : 0;
      box.appendChild(returningCard(
        'Your last check',
        '“' + last.goal + '”, ' + last.total + ' out of 100, on ' + dateText(last.at) +
          '. Seven-day tracker: ' + done + ' of 7 days.',
        'Open my report', function () { go('#results'); },
        'Take the follow-up', function () { begin(last.goal); }
      ));
    }
    box.hidden = !box.childNodes.length;
  }

  function returningCard(title, text, mainLabel, mainFn, altLabel, altFn) {
    var c = document.createElement('div');
    c.className = 'returning__card';
    var h = document.createElement('h2'); h.textContent = title;
    var p = document.createElement('p');  p.textContent = text;
    var row = document.createElement('div'); row.className = 'returning__row';
    var a = document.createElement('button');
    a.type = 'button'; a.className = 'btn btn--sun'; a.textContent = mainLabel;
    a.addEventListener('click', mainFn);
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn--line'; b.textContent = altLabel;
    b.addEventListener('click', altFn);
    row.appendChild(a); row.appendChild(b);
    c.appendChild(h); c.appendChild(p); c.appendChild(row);
    return c;
  }

  function begin(goal) {
    state = {
      id: String(Date.now()) + '-' + Math.floor(Math.random() * 1e6),
      goal: goal, step: 0, answers: {}, done: false
    };
    saveDraft();
    go('#q1');
  }

  var GOAL_HINT = 'One problem at a time. Every question is about this one.';

  $('startForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var g = $('goal').value.trim();
    if (!g) {
      $('goal').setAttribute('aria-invalid', 'true');
      $('goal').focus();
      $('goalHint').textContent = 'Write your problem first. Every question is about it.';
      return;
    }
    $('goal').removeAttribute('aria-invalid');
    begin(g);
  });

  $('goal').addEventListener('input', function () {
    $('goal').removeAttribute('aria-invalid');
    $('goalHint').textContent = GOAL_HINT;
  });

  /* ── one step = one dimension = two questions ──────────── */
  function answeredCount() {
    return Object.keys(state.answers).length;
  }

  function updateProgress() {
    var n = answeredCount();
    $('progFill').style.width = (n / 18) * 100 + '%';
    $('progLabel').textContent = 'Step ' + (state.step + 1) + ' of ' + dims.length +
      ' · ' + n + ' of 18 answered';
    var bar = $('progBar');
    bar.setAttribute('aria-valuenow', String(n));
  }

  function renderStep() {
    var d = dims[state.step];

    $('dimName').textContent = d.name;
    $('dimBlurb').textContent = d.blurb;
    $('btnBack').disabled = state.step === 0;
    $('btnNext').textContent = state.step === dims.length - 1 ? 'See the result' : 'Next';
    $('qHint').textContent = '';
    updateProgress();

    var form = $('qForm');
    form.innerHTML = '';

    d.questions.forEach(function (q, qi) {
      var name = d.key + '-' + qi;
      var fs = document.createElement('fieldset');
      fs.className = 'q';
      fs.id = 'q-' + name;

      var lg = document.createElement('legend');
      lg.className = 'q__text';
      lg.textContent = q.text;
      fs.appendChild(lg);

      var scale = document.createElement('div');
      scale.className = 'scale';

      var ends = document.createElement('div');
      ends.className = 'scale__ends';
      var lo = document.createElement('span');
      lo.textContent = '0 = ' + q.low;
      var hi = document.createElement('span');
      hi.textContent = '10 = ' + q.high;
      ends.appendChild(lo);
      ends.appendChild(hi);

      var opts = document.createElement('div');
      opts.className = 'scale__opts';
      for (var v = 0; v <= 10; v++) {
        var lab = document.createElement('label');
        lab.className = 'opt';
        var inp = document.createElement('input');
        inp.type = 'radio';
        inp.name = name;
        inp.value = String(v);
        if (state.answers[name] === v) inp.checked = true;
        var sp = document.createElement('span');
        sp.textContent = String(v);
        lab.appendChild(inp);
        lab.appendChild(sp);
        opts.appendChild(lab);
      }

      scale.appendChild(ends);
      scale.appendChild(opts);
      fs.appendChild(scale);
      form.appendChild(fs);
    });

    var head = $('dimName');
    head.setAttribute('tabindex', '-1');
    if (head.focus) head.focus({ preventScroll: true });
  }

  $('qForm').addEventListener('change', function (e) {
    if (e.target && e.target.type === 'radio') {
      state.answers[e.target.name] = Number(e.target.value);
      state.done = false;
      var fs = e.target.closest('fieldset');
      if (fs) fs.classList.remove('q--missing');
      $('qHint').textContent = '';
      updateProgress();
      saveDraft();
    }
  });

  $('btnBack').addEventListener('click', function () {
    if (state.step > 0) go('#q' + state.step);
  });

  $('btnNext').addEventListener('click', function () {
    var d = dims[state.step];
    var missing = [0, 1].filter(function (i) {
      return typeof state.answers[d.key + '-' + i] !== 'number';
    });
    if (missing.length) {
      missing.forEach(function (i) {
        $('q-' + d.key + '-' + i).classList.add('q--missing');
      });
      $('qHint').textContent = missing.length === 2
        ? 'Answer both questions to continue.'
        : 'One question is still unanswered.';
      $('q-' + d.key + '-' + missing[0]).scrollIntoView({ block: 'center' });
      return;
    }
    if (state.step < dims.length - 1) go('#q' + (state.step + 2));
    else finish();
  });

  /* ── finishing ──────────────────────────────────────────── */
  function finish() {
    if (!F.isComplete(state.answers)) {     // e.g. a stale tab
      go('#q' + (firstIncomplete() + 1));
      return;
    }
    var r = F.score(state.answers);
    var entry = {
      id: state.id,
      at: Date.now(),
      goal: state.goal,
      total: r.total,
      dims: r.dims.reduce(function (o, d) { o[d.key] = d.score; return o; }, {}),
      answers: JSON.parse(JSON.stringify(state.answers)),
      tracker: { days: [false, false, false, false, false, false, false], note: '' }
    };

    // going Back and changing an answer updates this attempt, not a new one
    var list = readHistory(), at = -1;
    list.forEach(function (e, i) { if (e.id === entry.id) at = i; });
    if (at >= 0) {
      entry.at = list[at].at;
      entry.tracker = list[at].tracker || entry.tracker;
      list[at] = entry;
    } else {
      list.push(entry);
    }
    writeHistory(list);

    state.done = true;
    saveDraft();
    go('#results');
  }

  /* ── results ───────────────────────────────────────────── */
  function bar(name, pct, value, detail, fine) {
    var li = document.createElement('li');
    li.className = 'bar' + (fine ? ' bar--fine' : '');
    li.innerHTML =
      '<div class="bar__head"><span class="bar__name"></span>' +
      '<span class="bar__meta"><span class="bar__value"></span>' +
      '<span class="bar__weight"></span></span></div>' +
      '<div class="bar__track"><span class="bar__fill"></span></div>';
    li.querySelector('.bar__name').textContent = name;
    li.querySelector('.bar__value').textContent = value;
    li.querySelector('.bar__weight').textContent = detail;
    li.querySelector('.bar__fill').style.width = Math.max(1.5, pct) + '%';
    return li;
  }

  function fillList(ul, items) {
    ul.innerHTML = '';
    items.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
  }

  function renderResults(entry) {
    current = entry;
    var r = F.score(entry.answers), goal = entry.goal;

    $('resultsFor').textContent = 'Your problem: ' + goal;
    $('resultsDate').textContent = dateText(entry.at);
    $('scoreNum').textContent = r.total;
    $('bandName').textContent = r.band.name;
    $('bandNote').textContent = r.band.note;
    $('resistLine').textContent =
      'Resistance ' + r.resistance + ': the points not yet earned across the nine dimensions.';

    var read = $('reading'); read.innerHTML = '';
    F.reading(entry.answers, goal).forEach(function (t) {
      var p = document.createElement('p');
      p.textContent = t;
      read.appendChild(p);
    });

    var acts = $('actions'); acts.innerHTML = '';
    F.nextActions(r).forEach(function (a) {
      var li = document.createElement('li');
      var b = document.createElement('b'); b.textContent = a.when;
      var s = document.createElement('span'); s.textContent = a.text;
      li.appendChild(b); li.appendChild(s);
      acts.appendChild(li);
    });

    var comp = $('composites'); comp.innerHTML = '';
    r.composites.forEach(function (c) {
      comp.appendChild(bar(c.name, c.pct, Math.round(c.pct) + '%',
        c.earned.toFixed(1) + ' of ' + c.weight + ' pts'));
    });

    var dl = $('dimensions'); dl.innerHTML = '';
    r.dims.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (d) {
      dl.appendChild(bar(d.name, d.pct, d.score.toFixed(1) + '/10',
        d.earned.toFixed(1) + ' of ' + d.weight + ' pts', true));
    });

    renderSums(r);
    renderCallouts(r);

    var board = r.weakest.length > 0;
    $('boardWrap').hidden = !board;
    if (board) {
      $('boardSub').textContent =
        'Built from the ' + (r.weakest.length === 2 ? 'two areas' : 'area') + ' with the most points ' +
        'still to earn (weight multiplied by the gap, which is not always the lowest score): ' +
        r.weakest.map(function (d) { return d.name; }).join(' and ') + '.';
      var dos = [], donts = [];
      r.weakest.forEach(function (w) {
        var d = F.dimByKey(w.key);
        dos = dos.concat(d.do);
        donts = donts.concat(d.dont);
      });
      fillList($('doList'), dos);
      fillList($('dontList'), donts);
    }

    var exp = r.blocker ? F.dimByKey(r.blocker.key).experiment
      : 'For seven days, keep doing the one habit that matters most here, and note it in a single line.';
    $('experimentDim').textContent = r.blocker ? 'Working on ' + r.blocker.name : 'Holding what works';
    $('experimentText').textContent = exp;
    renderTracker(entry);
    renderHistory(entry);

    $('reportStatus').textContent = '';
    var talk = $('btnTalk');
    if (window.dpsWaLink) {
      talk.href = window.dpsWaLink([
        'Hello, I took the Manifestation Calculator.',
        'Problem: ' + goal,
        'Score: ' + r.total + ' / 100',
        r.blocker ? 'Biggest area to work on: ' + r.blocker.name : '',
        'I’d like to talk it through.'
      ].filter(Boolean).join('\n'));
      talk.target = '_blank';
      talk.rel = 'noopener';
    }
  }

  function renderSums(r) {
    var body = $('sumRows'); body.innerHTML = '';
    r.dims.forEach(function (d) {
      var tr = document.createElement('tr');
      [d.name, d.score.toFixed(1), String(d.weight), d.earned.toFixed(2)].forEach(function (t) {
        var td = document.createElement('td');
        td.textContent = t;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
    $('sumExact').textContent = r.exact.toFixed(2);
    $('sumRounded').textContent = r.total;
  }

  function renderCallouts(r) {
    var showBlock = !!r.blocker;
    var showStrong = !!r.strongest && !(r.blocker && r.blocker.key === r.strongest.key);
    $('calloutBlock').hidden = !showBlock;
    $('calloutStrong').hidden = !showStrong;
    $('callouts').hidden = !showBlock && !showStrong;

    if (showBlock) {
      $('blockerName').textContent = r.blocker.name;
      $('blockerWhy').textContent =
        'Accounts for ' + r.blocker.lost.toFixed(1) + ' of the points not yet earned, more than any ' +
        'other dimension. ' + F.dimByKey(r.blocker.key).blurb;
    }
    if (showStrong) {
      $('strongName').textContent = r.strongest.name;
      $('strongWhy').textContent = r.strongest.score >= 6
        ? 'Scoring ' + r.strongest.score.toFixed(1) + '/10. Leave this one alone for now; it is already carrying you.'
        : 'Scoring ' + r.strongest.score.toFixed(1) + '/10. It is your highest, so build on it.';
    }
  }

  /* ── seven-day tracker ──────────────────────────────────── */
  function updateEntry(fn) {
    var list = readHistory();
    list.forEach(function (e) { if (e.id === current.id) fn(e); });
    fn(current);
    writeHistory(list);
  }

  function renderTracker(entry) {
    var t = entry.tracker || { days: [false, false, false, false, false, false, false], note: '' };
    entry.tracker = t;
    var box = $('trackerDays'); box.innerHTML = '';
    t.days.forEach(function (on, i) {
      var lab = document.createElement('label');
      lab.className = 'day';
      var inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.checked = !!on;
      inp.setAttribute('aria-label', 'Day ' + (i + 1) + ' done');
      inp.addEventListener('change', function () {
        var checked = inp.checked;
        updateEntry(function (e) {
          e.tracker = e.tracker || t;
          e.tracker.days[i] = checked;
        });
        trackerStatus();
      });
      var sp = document.createElement('span');
      sp.textContent = String(i + 1);
      lab.appendChild(inp);
      lab.appendChild(sp);
      box.appendChild(lab);
    });
    $('trackerNote').value = t.note || '';
    trackerStatus();
  }

  function trackerStatus() {
    var n = current.tracker.days.filter(Boolean).length;
    $('trackerStatus').textContent = n === 7
      ? 'All seven days done. Take the follow-up check to see how your answers have moved.'
      : n + ' of 7 days done. Saved in this browser, so you can come back to this page each day.';
    $('btnFollow').classList.toggle('btn--sun', n === 7);
    $('btnFollow').classList.toggle('btn--line', n !== 7);
    $('btnNew').classList.toggle('btn--sun', false);
  }

  $('trackerNote').addEventListener('input', function () {
    var v = $('trackerNote').value;
    updateEntry(function (e) {
      e.tracker = e.tracker || { days: [false, false, false, false, false, false, false], note: '' };
      e.tracker.note = v;
    });
  });

  /* ── history and follow-up ──────────────────────────────── */
  function renderHistory(entry) {
    var box = $('history');
    var all = readHistory().filter(function (e) { return sameGoal(e.goal, entry.goal); });
    var idx = -1;
    all.forEach(function (e, i) { if (e.id === entry.id) idx = i; });
    var list = idx >= 0 ? all.slice(0, idx + 1) : all;
    if (list.length < 2) { box.hidden = true; return; }
    box.hidden = false;

    var recent = list.slice(-12);
    var prev = recent[recent.length - 2], now = recent[recent.length - 1];
    var delta = now.total - prev.total;
    var days = Math.max(0, Math.round((now.at - prev.at) / 86400000));
    $('historySub').textContent =
      (delta === 0 ? 'No change' : (delta > 0 ? 'Up ' + delta : 'Down ' + Math.abs(delta)) + ' points') +
      ' since your last check on this problem' +
      (days ? ', ' + days + ' day' + (days === 1 ? '' : 's') + ' ago' : '') +
      '. This shows how your own answers have moved, not a measured change in your life.';

    var changes = $('historyChanges'); changes.innerHTML = '';
    if (prev.dims && now.dims) {
      F.compare(prev.dims, now.dims).filter(function (c) { return c.change !== 0; })
        .slice(0, 4).forEach(function (c) {
          var li = document.createElement('li');
          li.textContent = c.name + ' ' + (c.change > 0 ? '+' : '−') + Math.abs(c.change).toFixed(1);
          changes.appendChild(li);
        });
    }

    var W = 600, H = 200, P = 28;
    var n = recent.length;
    var x = function (i) { return P + (i * (W - P * 2)) / Math.max(1, n - 1); };
    var y = function (v) { return H - P - (v / 100) * (H - P * 2); };

    var pts = recent.map(function (e, i) { return x(i) + ',' + y(e.total); }).join(' ');
    var dots = recent.map(function (e, i) {
      return '<circle cx="' + x(i) + '" cy="' + y(e.total) + '" r="4"/>' +
             '<text class="chart__val" x="' + x(i) + '" y="' + (y(e.total) - 11) + '">' + e.total + '</text>';
    }).join('');
    var grid = [0, 50, 100].map(function (v) {
      return '<line class="chart__grid" x1="' + P + '" y1="' + y(v) + '" x2="' + (W - P) + '" y2="' + y(v) + '"/>' +
             '<text class="chart__axis" x="' + (P - 8) + '" y="' + (y(v) + 4) + '">' + v + '</text>';
    }).join('');

    $('historyChart').innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img" aria-label="' +
      'Manifestation scores across your last ' + n + ' checks on this problem, most recent ' +
      now.total + ' out of 100">' +
      grid + '<polyline class="chart__line" points="' + pts + '"/>' + dots + '</svg>';
  }

  /* ── copy, download ─────────────────────────────────────── */
  function reportNow() {
    return F.reportText(current.answers, current.goal, dateText(current.at), current.tracker);
  }

  function copyFallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  $('btnCopy').addEventListener('click', function () {
    var text = reportNow(), done = function (ok) {
      $('reportStatus').textContent = ok ? 'Report copied.' : 'Copying was blocked. Use Download instead.';
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); },
        function () { done(copyFallback(text)); });
    } else {
      done(copyFallback(text));
    }
  });

  $('btnDownload').addEventListener('click', function () {
    var url = URL.createObjectURL(new Blob([reportNow()], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'manifestation-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    $('reportStatus').textContent = 'Report downloaded.';
  });

  $('btnFollow').addEventListener('click', function () { begin(current.goal); });

  $('btnNew').addEventListener('click', function () {
    clearDraft();
    $('goal').value = '';
    go('');
  });

  // the problem typed on the homepage carries over, so nobody types it twice
  var carried = load('dps.problem.v1');
  if (typeof carried === 'string' && carried) $('goal').value = carried.slice(0, 120);

  window.addEventListener('hashchange', route);
  route();
})();
