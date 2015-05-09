(function () {

// Domain

var makeDiatonicTriggers = function (enabled) {
  return [
    { value: 'do', size: 'large', disabled: true },
    { value: 'mi', size: 'small', disabled: true },
    { value: 'sol', size: 'large', disabled: true },
    { value: 'ti', size: 'small', disabled: true },
    { value: 're', size: 'small', disabled: true },
    { value: 'fa', size: 'large', disabled: true },
    { value: 'la', size: 'small', disabled: true }
  ].map(function (t) {
    if (enabled.indexOf(t.value) >= 0) { t.disabled = false; }
    return t;
  });
}

var solfegeTriggers = {
  tonicTriad: makeDiatonicTriggers(['do', 'mi', 'sol']),
  all: makeDiatonicTriggers(['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'])
};

var levels = [
  {
    title: 'Play the Tonic note',
    solfegeTriggers: solfegeTriggers.tonicTriad,
    complete: function (analysis) {
      return (analysis.solfege.length === 1 && analysis.solfege[0] === 'do');
    }
  },
  {
    title: 'Play a Tonic Triad',
    solfegeTriggers: solfegeTriggers.tonicTriad,
    complete: function (analysis) {
      return (analysis.harmony.root === 'do' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: solfegeTriggers.all,
    complete: function (analysis) { return false; }
  }
];

musis.game = {
  levelIdx: 0,
  level: levels[0]
};

musis.game.begin = function () {
  musis.info.title(this.level.title);
};

musis.game.solfegeTriggers = function () {
  return this.level.solfegeTriggers;
};

musis.game.nextHarmony = function (analysis) {
  if (this.level.complete(analysis)) {
    this.levelIdx++;
    this.level = levels[this.levelIdx];
    this.begin();
    return true;
  }
};

})();
