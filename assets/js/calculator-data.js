/* ============================================================
   Manifestation Calculator — model and content
   ------------------------------------------------------------
   DIMENSIONS carry the weights. Each has two questions scored
   0–10, so a dimension score is their mean.

   The score is a reflection measure. The weights express this
   coaching framework's emphasis; they have not been statistically
   validated, so nothing here may be worded as a probability of
   reaching a goal.

   COMPOSITES group the nine dimensions into the five reported
   areas. Edit the `of` arrays to regroup — nothing else needs
   to change, the maths follows from here.
   ============================================================ */
window.FMR = (function () {
  'use strict';

  var DIMENSIONS = [
    {
      key: 'action', name: 'Action', weight: 25,
      blurb: 'What you actually do, as opposed to what you plan, research or intend.',
      questions: [
        { text: 'Over the last seven days, how much did you actually do toward solving this — not planned, not researched, did?',
          low: 'Nothing moved', high: 'Something every day' },
        { text: 'When you know what the next step is, how quickly do you take it?',
          low: 'It sits for weeks', high: 'Usually the same day' }
      ],
      do: ['Pick the single next physical step and do it today, before refining the plan again.',
           'Put one 45-minute block on tomorrow’s calendar with that step written inside it.',
           'End each day by naming the one thing you actually moved.'],
      dont: ['Don’t let research or planning count as progress.',
             'Don’t wait for a complete plan before the first step.',
             'Don’t reorganise your system instead of using it.'],
      experiment: 'For seven days, take one visible action on this before 11am — however small — and log it in a single line.'
    },
    {
      key: 'focus', name: 'Focus', weight: 20,
      blurb: 'How much of your attention stays on one thing instead of splitting across many.',
      questions: [
        { text: 'How much of your attention stays on solving this rather than spreading across other goals?',
          low: 'Split many ways', high: 'Almost entirely this' },
        { text: 'When you sit down to work on it, how long before you reach for your phone or something else?',
          low: 'Almost immediately', high: 'I stay with it' }
      ],
      do: ['Name the one problem this season belongs to, and put the rest on a parked list.',
           'Protect one block a day where only this gets worked on.',
           'Keep the phone in another room for that block.'],
      dont: ['Don’t begin a second major goal until this one has moved.',
             'Don’t treat being busy as being on track.',
             'Don’t check progress on five things a day.'],
      experiment: 'For seven days, work on nothing else in your first block of the day. Park every new idea in a list instead of starting it.'
    },
    {
      key: 'exposure', name: 'Exposure', weight: 10,
      blurb: 'Contact with the goal or the material — being near the thing itself.',
      questions: [
        { text: 'How often do you put yourself in front of what would solve this — the place, the people, the material?',
          low: 'Almost never', high: 'Regularly' },
        { text: 'How much do you encounter the real thing rather than pictures and talk about it?',
          low: 'Only at a distance', high: 'Up close, often' }
      ],
      do: ['Go where this has already been solved — the place, the room, the people.',
           'Spend time each week with someone already living it.',
           'Handle the real thing rather than images of it.'],
      dont: ['Don’t substitute scrolling for being there.',
             'Don’t study the solution only from a distance.',
             'Don’t avoid the environment because you feel out of place in it yet.'],
      experiment: 'For seven days, put yourself in direct contact with the solution once a day — a visit, a call, a real conversation.'
    },
    {
      key: 'conception', name: 'Conception', weight: 10,
      blurb: 'Conceiving the possibility for yourself out of what you have been exposed to.',
      questions: [
        { text: 'When you see someone who has already solved this, how real does it feel that it could be you?',
          low: 'Another world', high: 'Entirely plausible' },
        { text: 'Can you picture your life with this solved — concrete details, not a vague idea?',
          low: 'Very vague', high: 'Sharp and specific' }
      ],
      do: ['Write the specific version that is yours, with numbers and details in it.',
           'Find three people who began where you are and reached it.',
           'Describe the ordinary day you would have once this is solved.'],
      dont: ['Don’t keep the goal vague enough to stay safe.',
             'Don’t dismiss examples as different circumstances without checking.',
             'Don’t picture only the moment it gets solved.'],
      experiment: 'For seven days, spend five minutes writing one concrete detail of life after this is solved — a different detail each day.'
    },
    {
      key: 'feeling', name: 'Feeling', weight: 8,
      blurb: 'The emotional state you work from, and how often you already feel the relief of it being solved.',
      questions: [
        { text: 'When you think about this problem, what is the dominant feeling?',
          low: 'Pressure and anxiety', high: 'Ease and warmth' },
        { text: 'How often do you already feel some version of what solving it would feel like?',
          low: 'Never', high: 'Most days' }
      ],
      do: ['Notice the feeling this problem brings up before you start working on it.',
           'Spend a few minutes a day in the feeling of it already being solved.',
           'Work from calm rather than pressure wherever you get the choice.'],
      dont: ['Don’t use anxiety as the engine.',
             'Don’t force the feeling; start from something nearby that is already easy to feel.',
             'Don’t measure the day by how hard it felt.'],
      experiment: 'For seven days, take two minutes to settle before your main block. Note the feeling you start from and the one you end with.'
    },
    {
      key: 'intention', name: 'Intention', weight: 8,
      blurb: 'How clearly and how steadily you hold what you actually want.',
      questions: [
        { text: 'How clearly can you state what you want in one sentence, with a number or a date in it?',
          low: 'I cannot yet', high: 'Exactly, on demand' },
        { text: 'How stable has that intention been over the past three months?',
          low: 'It keeps changing', high: 'Unchanged' }
      ],
      do: ['State it in one sentence with a number and a date.',
           'Keep that sentence somewhere you see every morning.',
           'If it changes, change it deliberately and in writing.'],
      dont: ['Don’t rewrite the goal every time motivation dips.',
             'Don’t hold several versions of it at once.',
             'Don’t leave it as a direction instead of a destination.'],
      experiment: 'For seven days, write the same one-sentence intention by hand each morning. Note any day you were tempted to change it.'
    },
    {
      key: 'belief', name: 'Belief', weight: 8,
      blurb: 'Whether you hold yourself as the kind of person who can solve this.',
      questions: [
        { text: 'Do you believe you are the kind of person who can solve this?',
          low: 'Not really', high: 'Without question' },
        { text: 'When something goes wrong, what does it tend to mean to you?',
          low: 'Proof it will not work', high: 'Just information' }
      ],
      do: ['Collect evidence of times you did something you doubted you could.',
           'Separate “this did not work” from “I cannot do this”.',
           'Spend time around people who assume it is possible for you.'],
      dont: ['Don’t treat a setback as a verdict on you.',
             'Don’t argue for your limits out loud.',
             'Don’t wait to feel certain before acting.'],
      experiment: 'For seven days, write one line each evening recording something you did that the doubting version of you would not have.'
    },
    {
      key: 'consistency', name: 'Consistency', weight: 6,
      blurb: 'Showing up repeatedly, and how fast you restart after a break.',
      questions: [
        { text: 'Over the last month, how regular has your effort been?',
          low: 'Bursts, then nothing', high: 'Steady throughout' },
        { text: 'After you break a streak, how quickly do you restart?',
          low: 'I tend not to', high: 'The next day' }
      ],
      do: ['Set a floor so small you can hit it on your worst day.',
           'Restart the same day you break, not next Monday.',
           'Keep the streak somewhere you can see it.'],
      dont: ['Don’t go all in for a week and then vanish.',
             'Don’t set a standard so high it collapses.',
             'Don’t treat one missed day as the end of the attempt.'],
      experiment: 'For seven days, hit a minimum version daily — ten minutes counts. The point is the unbroken line, not the volume.'
    },
    {
      key: 'adoptability', name: 'Adoptability', weight: 5,
      blurb: 'Willingness to change method, and to be taught by someone further along.',
      questions: [
        { text: 'How willing are you to change your method when the evidence says it is not working?',
          low: 'I keep pushing', high: 'I adapt quickly' },
        { text: 'How open are you to correction from someone further along than you?',
          low: 'I resist it', high: 'I seek it out' }
      ],
      do: ['Set a date to review whether the method is working.',
           'Ask one person further along what they would change.',
           'Change the approach when evidence says so — not the goal.'],
      dont: ['Don’t keep a method going out of loyalty to it.',
             'Don’t take correction as criticism.',
             'Don’t change everything at once when one thing is not working.'],
      experiment: 'For seven days, ask one person ahead of you for a single piece of feedback, and act on it before the week ends.'
    }
  ];

  /* The five reported areas. Regroup here if the model changes. */
  var COMPOSITES = [
    { key: 'action',    name: 'Action',          of: ['action'] },
    { key: 'focus',     name: 'Focus',           of: ['focus'] },
    { key: 'core',      name: 'Core Alignment',  of: ['exposure', 'conception'] },
    { key: 'identity',  name: 'Identity',        of: ['feeling', 'intention', 'belief'] },
    { key: 'adapt',     name: 'Consistency & Adaptability', of: ['consistency', 'adoptability'] }
  ];

  var BANDS = [
    { min: 80, name: 'Well aligned',
      note: 'Most of the structure is in place. The work now is protecting it — the usual failure from here is drift, not collapse.' },
    { min: 60, name: 'Mostly aligned',
      note: 'The foundation holds and one or two areas are doing the holding back. Those are worth more of your attention than anything already working.' },
    { min: 40, name: 'Uneven',
      note: 'Real strength in places, real gaps in others. Uneven profiles usually move fastest by repairing the weakest area rather than pushing harder on the strongest.' },
    { min: 0,  name: 'Early',
      note: 'Most of the structure is not in place yet. That is information about the structure, not about you — and it is the most changeable thing here.' }
  ];

  /* Named gaps between two dimensions. The first pattern that fits is shown,
     so keep the most telling ones at the top. */
  var PATTERNS = [
    { high: 'conception', low: 'action',
      text: 'You can see the solution clearly, but what you can see is ahead of what you are doing. More planning will not close that gap; small visible actions will.' },
    { high: 'belief', low: 'action',
      text: 'You believe in this more than your last week shows. The belief is useful, and it needs something to stand on.' },
    { high: 'action', low: 'focus',
      text: 'You are putting in effort, and it is spreading across too much. The same effort on one thing would count for more.' },
    { high: 'intention', low: 'consistency',
      text: 'You know what you want, but your effort comes in bursts. A smaller promise you can keep daily suits you better than a bigger one you cannot.' },
    { high: 'action', low: 'feeling',
      text: 'You are getting things done, and the pressure is doing a lot of the pushing. That is worth easing before it wears you down.' },
    { high: 'action', low: 'adoptability',
      text: 'You keep moving, but you are less willing to change how. Check that the method deserves the effort you are giving it.' },
    { high: 'focus', low: 'exposure',
      text: 'Your attention is on this, but mostly from a distance. It is time to get closer to the real thing.' }
  ];

  function dimByKey(k) {
    for (var i = 0; i < DIMENSIONS.length; i++) if (DIMENSIONS[i].key === k) return DIMENSIONS[i];
    return null;
  }

  function isComplete(answers) {
    return DIMENSIONS.every(function (d) {
      return [0, 1].every(function (i) {
        var v = answers[d.key + '-' + i];
        return typeof v === 'number' && v >= 0 && v <= 10;
      });
    });
  }

  /* answers: { 'action-0': 7, 'action-1': 4, ... } values 0–10 */
  function score(answers) {
    var dims = DIMENSIONS.map(function (d) {
      var a = answers[d.key + '-0'], b = answers[d.key + '-1'];
      var mean = (a + b) / 2;                       // 0–10
      return {
        key: d.key, name: d.name, weight: d.weight, blurb: d.blurb,
        score: mean,
        pct: mean * 10,                             // 0–100 within the dimension
        earned: (mean / 10) * d.weight,             // points contributed
        lost: ((10 - mean) / 10) * d.weight         // weighted drag
      };
    });

    var byKey = {};
    dims.forEach(function (d) { byKey[d.key] = d; });

    // every mean is a multiple of 0.5, so the sum is kept in whole twentieths:
    // no floating-point drift, and the same answers can't round two ways
    var twentieths = dims.reduce(function (s, d) {
      return s + Math.round(d.score * 2) * d.weight;
    }, 0);
    var total = twentieths / 20;
    var rounded = Math.round(total);

    var composites = COMPOSITES.map(function (c) {
      var members = c.of.map(function (k) { return byKey[k]; });
      var w = members.reduce(function (s, m) { return s + m.weight; }, 0);
      var e = members.reduce(function (s, m) { return s + m.earned; }, 0);
      return { key: c.key, name: c.name, weight: w, earned: e, pct: w ? (e / w) * 100 : 0 };
    });

    // biggest drag first: weighted points lost, so a weak heavy dimension
    // outranks a weak light one. Ties fall back to the model's own order.
    var order = function (d) { return dims.indexOf(d); };
    var byDrag = dims.slice().sort(function (x, y) {
      return (y.lost - x.lost) || (y.weight - x.weight) || (order(x) - order(y));
    });
    var byStrength = dims.slice().sort(function (x, y) {
      return (y.score - x.score) || (y.weight - x.weight) || (order(x) - order(y));
    });

    // the band follows the number the reader sees, not the unrounded one
    var band = BANDS[BANDS.length - 1];
    for (var i = 0; i < BANDS.length; i++) {
      if (rounded >= BANDS[i].min) { band = BANDS[i]; break; }
    }

    var hi = byStrength[0].score, lo = byStrength[byStrength.length - 1].score;

    return {
      total: rounded,
      exact: total,
      resistance: 100 - rounded,
      band: band,
      dims: dims,
      composites: composites,
      blocker: byDrag[0].lost > 0 ? byDrag[0] : null,
      weakest: byDrag.slice(0, 2).filter(function (d) { return d.lost > 0; }),
      strongest: byStrength[0].score > 0 ? byStrength[0] : null,
      flat: hi === lo                                // every dimension the same
    };
  }

  /* The single answer furthest below the rest, for quoting back. */
  function lowestAnswer(answers) {
    var best = null;
    DIMENSIONS.forEach(function (d) {
      d.questions.forEach(function (q, i) {
        var v = answers[d.key + '-' + i];
        if (!best || v < best.value) best = { value: v, text: q.text, anchor: q.low, dim: d.name };
      });
    });
    return best;
  }

  /* Plain sentences built only from this person's answers. Pure: the same
     answers and goal always give the same words. */
  function reading(answers, goal) {
    var r = score(answers), out = [];
    var byKey = {};
    r.dims.forEach(function (d) { byKey[d.key] = d; });

    if (!r.blocker) {
      out.push('You marked every answer at the top of the scale for “' + goal +
        '”. If that is honest, keep doing what you are doing. If it felt too easy, ' +
        'ask someone who knows you well to answer the same questions about you.');
      return out;
    }
    if (!r.strongest) {
      out.push('You marked every answer at the bottom of the scale for “' + goal +
        '”. That is a hard place to answer from, and it is also a clear place to start. ' +
        'Pick one small thing, not nine.');
      return out;
    }

    var same = r.strongest.key === r.blocker.key;
    if (r.flat) {
      out.push('You rated all nine areas about the same for “' + goal + '”, at ' +
        r.strongest.score.toFixed(1) + ' out of 10. Nothing stands out as a strength or a gap, ' +
        'so ' + r.blocker.name + ' comes first simply because it carries the most weight in this check.');
    } else if (same) {
      out.push('For “' + goal + '”, ' + r.blocker.name + ' is your highest score (' +
        r.blocker.score.toFixed(1) + ' out of 10), and it still has the most room, because it ' +
        'carries so much weight in this check. It accounts for ' + r.blocker.lost.toFixed(1) +
        ' of the points not yet earned.');
    } else {
      out.push('For “' + goal + '”, your strongest area is ' + r.strongest.name + ' (' +
        r.strongest.score.toFixed(1) + ' out of 10). The area with the most room is ' +
        r.blocker.name + ' (' + r.blocker.score.toFixed(1) + ' out of 10), which accounts for ' +
        r.blocker.lost.toFixed(1) + ' of the points not yet earned.');
    }

    for (var i = 0; i < PATTERNS.length; i++) {
      var p = PATTERNS[i];
      if (byKey[p.high].score >= 6.5 && byKey[p.low].score <= byKey[p.high].score - 2.5) {
        out.push(p.text);
        break;
      }
    }

    var low = lowestAnswer(answers);
    if (low.value <= 4) {
      out.push('Your lowest single answer was ' + low.value + ' out of 10, on this question: “' +
        low.text + '” Start there. It is the most specific thing this check can point you to.');
    }
    return out;
  }

  /* Ordered next steps, drawn from the two areas costing the most points. */
  function nextActions(r) {
    if (!r.blocker) {
      return [{ when: 'This week', text: 'Choose the one habit that matters most here and protect it.' },
              { when: 'This month', text: 'Take this check again and see whether your answers still hold.' }];
    }
    var first = dimByKey(r.blocker.key);
    var acts = [
      { when: 'Today', text: first.do[0] },
      { when: 'This week', text: first.experiment }
    ];
    if (r.weakest[1]) {
      acts.push({ when: 'Next week', text: 'Then turn to ' + r.weakest[1].name + ': ' +
        dimByKey(r.weakest[1].key).do[0] });
    }
    return acts;
  }

  /* Change in self-reported scores between two checks, largest first. */
  function compare(prevDims, nowDims) {
    return DIMENSIONS.map(function (d) {
      return { key: d.key, name: d.name, change: nowDims[d.key] - prevDims[d.key] };
    }).sort(function (a, b) {
      return (Math.abs(b.change) - Math.abs(a.change));
    });
  }

  /* The copy/download version of the report. */
  function reportText(answers, goal, dateText, tracker) {
    var r = score(answers), L = [];
    L.push('MANIFESTATION CALCULATOR: YOUR REPORT');
    L.push('Davinder Pal Singh, Life Architect Coach');
    if (dateText) L.push(dateText);
    L.push('');
    L.push('Problem: ' + goal);
    L.push('Manifestation score: ' + r.total + ' / 100 (' + r.band.name + ')');
    L.push(r.band.note);
    L.push('');
    L.push('YOUR READING');
    reading(answers, goal).forEach(function (t) { L.push(t); });
    L.push('');
    L.push('NEXT ACTIONS');
    nextActions(r).forEach(function (a) { L.push('- ' + a.when + ': ' + a.text); });
    L.push('');
    L.push('BREAKDOWN (your score out of 10, then points earned out of the weight)');
    r.dims.forEach(function (d) {
      L.push('- ' + d.name + ': ' + d.score.toFixed(1) + '/10, ' +
             d.earned.toFixed(1) + ' of ' + d.weight + ' points');
    });
    if (tracker) {
      var n = tracker.days.filter(Boolean).length;
      L.push('');
      L.push('SEVEN-DAY TRACKER: ' + n + ' of 7 days done');
      if (tracker.note) L.push('Notes: ' + tracker.note);
    }
    L.push('');
    L.push('How the score works: each dimension is the average of your two answers. ' +
           'That average, out of 10, is multiplied by the dimension’s weight, and the ' +
           'nine results are added up.');
    L.push('This is a reflection of what you reported, not a prediction or the probability ' +
           'of reaching your goal. It is not medical or psychological advice.');
    return L.join('\n');
  }

  return {
    DIMENSIONS: DIMENSIONS,
    COMPOSITES: COMPOSITES,
    BANDS: BANDS,
    PATTERNS: PATTERNS,
    dimByKey: dimByKey,
    isComplete: isComplete,
    score: score,
    reading: reading,
    nextActions: nextActions,
    compare: compare,
    reportText: reportText,
    totalWeight: DIMENSIONS.reduce(function (s, d) { return s + d.weight; }, 0)
  };
})();
