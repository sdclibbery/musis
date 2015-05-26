(function () {

// Domain

var makeTriggers = function (enabled) {
  return [
    [ null,                            { value: 'do', size: 'large', disabled: true },  null,                             ],
    [ { value: 'me', disabled: true }, { value: 'mi', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 'sol', size: 'large', disabled: true }, null,                             ],
    [ { value: 'te', disabled: true }, { value: 'ti', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 're', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 'fa', size: 'large', disabled: true },  { value: 'fi', disabled: true },  ],
    [ { value: 'le', disabled: true }, { value: 'la', size: 'small', disabled: true },  null,                             ]
  ].map(function (a) {
    return a.map(function (t) {
      if (t && enabled.indexOf(t.value) >= 0) { t.disabled = false; }
      return t;
    });
  });
}

var levels = [
  {
    title: 'Play the tonic note',
    hint: 'Tap the highlighted trigger',
    solfegeTriggers: makeTriggers(['do']),
    complete: function (analysis, game) {
      return (analysis.solfege.length === 1 && analysis.solfege[0] === 'do');
    }
  },
  {
    title: 'Play the tonic triad',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: makeTriggers(['do', 'mi', 'sol']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'do' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play the dominant triad',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: makeTriggers(['sol', 'ti', 're']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'sol' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play some static harmony',
    hint: 'Switch between tonic and dominant triads a few times',
    solfegeTriggers: makeTriggers(['do', 'mi', 'sol', 'ti', 're']),
    complete: function (analysis, game) {
      return this.score >= 15;
    },
    nextHarmony: function (analysis, lastAnalysis) {
      if (this.score === undefined) { this.score = 0; }
      this.score += (lastAnalysis.harmony.function !== analysis.harmony.function) ? 5 : 1;
    }
  },
  {
    title: 'Play the subdominant triad',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: makeTriggers(['fa', 'la', 'do']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'fa' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play an authentic cadence',
    hint: 'Play the tonic, the subdominant, the dominant then the tonic',
    solfegeTriggers: makeTriggers(['do', 're', 'mi', 'fa', 'sol', 'la', 'ti']),
    complete: function (analysis, game) {
      return analysis.cadence === 'sdt' && analysis.harmony.root === 'do';
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: makeTriggers(['do', 're', 'mi', 'fa', 'sol', 'la', 'ti']),
    complete: function (analysis, game) { return false; }
  }
];

musis.tutorial = musis.tutorial || {};

musis.tutorial.diatonic = {
  levelIdx: 0,
  level: levels[0]
};

musis.tutorial.diatonic.begin = function (draw) {
  info(this.level, draw);
};

musis.tutorial.diatonic.solfegeTriggers = function () {
  return this.level.solfegeTriggers;
};

musis.tutorial.diatonic.nextHarmony = function (draw, analysis) {
  var completedLevel = false;
  if (this.level.nextHarmony) {
    this.level.nextHarmony(analysis, this.lastAnalysis);
  }
  this.lastAnalysis = analysis;
  if (this.level.complete(analysis, this)) {
    this.levelIdx++;
    this.level = levels[this.levelIdx];
    completedLevel = true;
  }
  info(this.level, draw);
  return completedLevel;
};

var info = function (level, draw) {
  draw.title(level.title);
  draw.hint('Hint: '+level.hint);
};

})();
