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
    title: 'Play the Secondary Dominant',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: makeTriggers(['re', 'fi', 'la']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 're' && analysis.harmony.hasTriad && analysis.harmony.quality === 'major');
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: makeTriggers(['do', 're', 'mi', 'me', 'fa', 'fi', 'sol', 'la', 'le', 'ti', 'te']),
    complete: function (analysis, game) { return false; }
  }
];

musis.tutorial = musis.tutorial || {};

musis.tutorial.chromatic = {
  levelIdx: 0,
  level: levels[0]
};

musis.tutorial.chromatic.begin = function (draw) {
  info(this.level, draw);
};

musis.tutorial.chromatic.solfegeTriggers = function () {
  return this.level.solfegeTriggers;
};

musis.tutorial.chromatic.nextHarmony = function (draw, analysis) {
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
