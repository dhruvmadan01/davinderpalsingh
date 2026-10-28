/* ============================================================
   Manifestation Readiness — model and content
   ------------------------------------------------------------
   DIMENSIONS carry the weights. Each has two questions scored
   0–10, so a dimension score is their mean.

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
        { text: 'Over the last seven days, how much did you actually do toward this outcome — not planned, not researched, did?',
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
      experiment: 'For seven days, take one visible action on this outcome before 11am — however small — and log it in a single line.'
    },
    {
      key: 'focus', name: 'Focus', weight: 20,
      blurb: 'How much of your attention stays on one outcome instead of splitting across many.',
      questions: [
        { text: 'How much of your attention stays on this one outcome rather than spreading across other goals?',
          low: 'Split many ways', high: 'Almost entirely this' },
        { text: 'When you sit down to work on it, how long before you reach for your phone or something else?',
          low: 'Almost immediately', high: 'I stay with it' }
      ],
      do: ['Name the one outcome this season belongs to, and put the rest on a parked list.',
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
        { text: 'How often do you put yourself in front of the thing you want — the place, the people, the material?',
          low: 'Almost never', high: 'Regularly' },
        { text: 'How much do you encounter the real thing rather than pictures and talk about it?',
          low: 'Only at a distance', high: 'Up close, often' }
      ],
      do: ['Go where this outcome already exists — the place, the room, the people.',
           'Spend time each week with someone already living it.',
           'Handle the real thing rather than images of it.'],
      dont: ['Don’t substitute scrolling for being there.',
             'Don’t study the outcome only from a distance.',
             'Don’t avoid the environment because you feel out of place in it yet.'],
      experiment: 'For seven days, put yourself in direct contact with this outcome once a day — a visit, a call, a real conversation.'
    },
    {
      key: 'conception', name: 'Conception', weight: 10,
      blurb: 'Conceiving the possibility for yourself out of what you have been exposed to.',
      questions: [
        { text: 'When you see someone already living this outcome, how real does it feel that it could be you?',
          low: 'Another world', high: 'Entirely plausible' },
        { text: 'Can you picture the specific version of this outcome that is yours — concrete details, not a vague idea?',
          low: 'Very vague', high: 'Sharp and specific' }
      ],
      do: ['Write the specific version that is yours, with numbers and details in it.',
           'Find three people who began where you are and reached it.',
           'Describe the ordinary day you would have after it arrives.'],
      dont: ['Don’t keep the goal vague enough to stay safe.',
             'Don’t dismiss examples as different circumstances without checking.',
             'Don’t picture only the moment of arrival.'],
      experiment: 'For seven days, spend five minutes writing one concrete detail of life after this outcome — a different detail each day.'
    },
    {
      key: 'feeling', name: 'Feeling', weight: 8,
      blurb: 'The emotional state you work from, and how often you already feel the outcome.',
      questions: [
        { text: 'When you think about this outcome, what is the dominant feeling?',
          low: 'Pressure and anxiety', high: 'Ease and warmth' },
        { text: 'How often do you already feel some version of what having it would feel like?',
          low: 'Never', high: 'Most days' }
      ],
      do: ['Notice the feeling this goal brings up before you start working on it.',
           'Spend a few minutes a day in the feeling of already having it.',
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
      blurb: 'Whether you hold yourself as the kind of person this happens for.',
      questions: [
        { text: 'Do you believe you are the kind of person this outcome happens for?',
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
    { min: 80, name: 'Aligned',
      note: 'Most of the structure is in place. The work now is protecting it — the usual failure from here is drift, not collapse.' },
    { min: 60, name: 'Close',
      note: 'The foundation holds and one or two areas are doing the holding back. Those are worth more of your attention than anything already working.' },
    { min: 40, name: 'Uneven',
      note: 'Real strength in places, real gaps in others. Uneven profiles usually move fastest by repairing the weakest area rather than pushing harder on the strongest.' },
    { min: 0,  name: 'Early',
      note: 'Most of the structure is not in place yet. That is information about the structure, not about you — and it is the most changeable thing here.' }
  ];

  function dimByKey(k) {
    for (var i = 0; i < DIMENSIONS.length; i++) if (DIMENSIONS[i].key === k) return DIMENSIONS[i];
    return null;
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

    var total = dims.reduce(function (s, d) { return s + d.earned; }, 0);

    var composites = COMPOSITES.map(function (c) {
      var members = c.of.map(function (k) { return byKey[k]; });
      var w = members.reduce(function (s, m) { return s + m.weight; }, 0);
      var e = members.reduce(function (s, m) { return s + m.earned; }, 0);
      return { key: c.key, name: c.name, weight: w, earned: e, pct: w ? (e / w) * 100 : 0 };
    });

    // biggest drag first: weighted points lost, so a weak heavy dimension
    // outranks a weak light one
    var byDrag = dims.slice().sort(function (x, y) {
      return (y.lost - x.lost) || (y.weight - x.weight);
    });
    var byStrength = dims.slice().sort(function (x, y) {
      return (y.score - x.score) || (y.weight - x.weight);
    });

    var band = BANDS[BANDS.length - 1];
    for (var i = 0; i < BANDS.length; i++) {
      if (total >= BANDS[i].min) { band = BANDS[i]; break; }
    }

    return {
      total: Math.round(total),
      resistance: Math.round(100 - total),
      band: band,
      dims: dims,
      composites: composites,
      blocker: byDrag[0],
      weakest: byDrag.slice(0, 2),
      strongest: byStrength[0]
    };
  }

  return {
    DIMENSIONS: DIMENSIONS,
    COMPOSITES: COMPOSITES,
    BANDS: BANDS,
    dimByKey: dimByKey,
    score: score,
    totalWeight: DIMENSIONS.reduce(function (s, d) { return s + d.weight; }, 0)
  };
})();
