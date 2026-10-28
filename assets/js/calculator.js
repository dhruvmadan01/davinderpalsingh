/* ============================================================
   Readiness Check — flow, rendering, local history
   Depends on calculator-data.js (window.FMR)
   ============================================================ */
(function () {
  'use strict';

  var F = window.FMR;
  if (!F) return;

  var STORE = 'dps.readiness.v1';
  var dims  = F.DIMENSIONS;

  var state = { goal: '', step: 0, answers: {} };

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
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ── local history (per browser; never leaves the device) ── */
  function readHistory() {
    try {
      var raw = localStorage.getItem(STORE);
      var list = raw ? JSON.parse(raw) : [];
      return Object.prototype.toString.call(list) === '[object Array]' ? list : [];
    } catch (e) { return []; }
  }
  function writeHistory(list) {
    try { localStorage.setItem(STORE, JSON.stringify(list.slice(-40))); }
    catch (e) { /* private window, blocked storage — the check still works */ }
  }

  /* ── start ─────────────────────────────────────────────── */
  $('startForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var g = $('goal').value.trim();
    if (!g) {
      $('goal').setAttribute('aria-invalid', 'true');
      $('goal').focus();
      $('goalHint').textContent = 'Name the outcome first — the questions are all about this one thing.';
      return;
    }
    $('goal').removeAttribute('aria-invalid');
    state.goal = g;
    state.step = 0;
    state.answers = {};
    show('assess');
    renderStep();
  });

  $('goal').addEventListener('input', function () {
    $('goal').removeAttribute('aria-invalid');
    $('goalHint').textContent = 'One outcome at a time. The whole check measures your relationship with this one.';
  });

  /* ── one step = one dimension = two questions ──────────── */
  function renderStep() {
    var d = dims[state.step];
    var pct = (state.step / dims.length) * 100;

    $('progFill').style.width = pct + '%';
    $('progLabel').textContent = 'Step ' + (state.step + 1) + ' of ' + dims.length;
    $('dimName').textContent = d.name;
    $('dimBlurb').textContent = d.blurb;
    $('btnBack').disabled = state.step === 0;
    $('btnNext').textContent = state.step === dims.length - 1 ? 'See the result' : 'Next';
    $('qHint').textContent = '';

    var form = $('qForm');
    form.innerHTML = '';

    d.questions.forEach(function (q, qi) {
      var name = d.key + '-' + qi;
      var fs = document.createElement('fieldset');
      fs.className = 'q';

      var lg = document.createElement('legend');
      lg.className = 'q__text';
      lg.textContent = q.text;
      fs.appendChild(lg);

      var scale = document.createElement('div');
      scale.className = 'scale';

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

      var lo = document.createElement('span');
      lo.className = 'scale__anchor';
      lo.textContent = q.low;
      var hi = document.createElement('span');
      hi.className = 'scale__anchor scale__anchor--hi';
      hi.textContent = q.high;

      scale.appendChild(lo);
      scale.appendChild(opts);
      scale.appendChild(hi);
      fs.appendChild(scale);
      form.appendChild(fs);
    });

    form.addEventListener('change', function (e) {
      if (e.target && e.target.type === 'radio') {
        state.answers[e.target.name] = Number(e.target.value);
        $('qHint').textContent = '';
      }
    });
  }

  $('btnBack').addEventListener('click', function () {
    if (state.step > 0) { state.step--; renderStep(); }
  });

  $('btnNext').addEventListener('click', function () {
    var d = dims[state.step];
    var missing = [0, 1].filter(function (i) {
      return typeof state.answers[d.key + '-' + i] !== 'number';
    });
    if (missing.length) {
      $('qHint').textContent = missing.length === 2
        ? 'Answer both questions to continue.'
        : 'One question is still unanswered.';
      return;
    }
    if (state.step < dims.length - 1) {
      state.step++;
      renderStep();
    } else {
      finish();
    }
  });

  /* ── results ───────────────────────────────────────────── */
  function bar(name, pct, value, weight, fine) {
    var li = document.createElement('li');
    li.className = 'bar' + (fine ? ' bar--fine' : '');
    li.innerHTML =
      '<div class="bar__head"><span class="bar__name"></span>' +
      '<span class="bar__meta"><span class="bar__value"></span>' +
      '<span class="bar__weight"></span></span></div>' +
      '<div class="bar__track"><span class="bar__fill"></span></div>';
    li.querySelector('.bar__name').textContent = name;
    li.querySelector('.bar__value').textContent = value;
    li.querySelector('.bar__weight').textContent = 'weight ' + weight;
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

  function finish() {
    var r = F.score(state.answers);

    $('resultsFor').textContent = 'Your outcome: ' + state.goal;
    $('scoreNum').textContent = r.total;
    $('bandName').textContent = r.band.name;
    $('bandNote').textContent = r.band.note;
    $('resistLine').textContent =
      'Resistance ' + r.resistance + ' — the weighted drag still sitting across the nine dimensions.';

    var comp = $('composites'); comp.innerHTML = '';
    r.composites.forEach(function (c) {
      comp.appendChild(bar(c.name, c.pct, Math.round(c.pct) + '%', c.weight));
    });

    var dl = $('dimensions'); dl.innerHTML = '';
    r.dims.slice().sort(function (a, b) { return b.weight - a.weight; }).forEach(function (d) {
      dl.appendChild(bar(d.name, d.pct, d.score.toFixed(1) + '/10', d.weight, true));
    });

    var bDim = F.dimByKey(r.blocker.key);
    $('blockerName').textContent = r.blocker.name;
    $('blockerWhy').textContent =
      'Costing you about ' + r.blocker.lost.toFixed(1) + ' of the 100 points, more than any other ' +
      'dimension. ' + bDim.blurb;

    $('strongName').textContent = r.strongest.name;
    $('strongWhy').textContent =
      'Scoring ' + r.strongest.score.toFixed(1) + '/10. Leave this one alone for now; it is already carrying you.';

    $('boardSub').textContent =
      'Built from the two areas costing you the most points — weight multiplied by the gap, ' +
      'which is not always the two lowest scores: ' +
      r.weakest.map(function (d) { return d.name; }).join(' and ') + '.';

    var dos = [], donts = [];
    r.weakest.forEach(function (w) {
      var d = F.dimByKey(w.key);
      dos = dos.concat(d.do);
      donts = donts.concat(d.dont);
    });
    fillList($('doList'), dos);
    fillList($('dontList'), donts);

    $('experiment').innerHTML =
      '<p class="experiment__dim"></p><p class="experiment__text"></p>' +
      '<p class="experiment__after"></p>';
    $('experiment').querySelector('.experiment__dim').textContent = 'Working on ' + r.blocker.name;
    $('experiment').querySelector('.experiment__text').textContent = bDim.experiment;
    $('experiment').querySelector('.experiment__after').textContent =
      'Run it for seven days, then come back and check again. Compare after 30 days, and again at 90 — ' +
      'the shape of the change matters more than any single score.';

    var list = readHistory();
    list.push({
      at: Date.now(),
      goal: state.goal,
      total: r.total,
      dims: r.dims.reduce(function (o, d) { o[d.key] = Number(d.score.toFixed(1)); return o; }, {})
    });
    writeHistory(list);
    renderHistory(list);

    $('endNote').textContent =
      'Saved in this browser only, so you can compare later. Nothing was sent anywhere. ' +
      'A score here describes your current habits and mindset — it is not a forecast, and ' +
      'circumstances outside this check matter too.';

    show('results');
  }

  /* ── history chart ─────────────────────────────────────── */
  function renderHistory(list) {
    var box = $('history');
    if (list.length < 2) { box.hidden = true; return; }
    box.hidden = false;

    var recent = list.slice(-12);
    var prev = recent[recent.length - 2], now = recent[recent.length - 1];
    var delta = now.total - prev.total;
    var days = Math.max(0, Math.round((now.at - prev.at) / 86400000));
    $('historySub').textContent =
      (delta === 0 ? 'No change' : (delta > 0 ? 'Up ' + delta : 'Down ' + Math.abs(delta)) + ' points') +
      ' since your last check' + (days ? ', ' + days + ' day' + (days === 1 ? '' : 's') + ' ago' : '') + '.';

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
      'Readiness scores across your last ' + n + ' checks, most recent ' + now.total + ' out of 100">' +
      grid + '<polyline class="chart__line" points="' + pts + '"/>' + dots + '</svg>';
  }

  $('btnAgain').addEventListener('click', function () {
    state.step = 0;
    state.answers = {};
    $('goal').value = state.goal;
    show('intro');
  });
})();
