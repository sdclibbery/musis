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
  tonicNote: makeDiatonicTriggers(['do']),
  tonicTriad: makeDiatonicTriggers(['do', 'mi', 'sol']),
  dominantTriad: makeDiatonicTriggers(['sol', 'ti', 're']),
  staticHarmony: makeDiatonicTriggers(['la', 'do', 'mi', 'sol', 'ti', 're']),
  all: makeDiatonicTriggers(['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'])
};

var levels = [
  {
    title: 'Play the Tonic note',
    hint: 'Tap the blue trigger',
    solfegeTriggers: solfegeTriggers.tonicNote,
    complete: function (analysis) {
      return (analysis.solfege.length === 1 && analysis.solfege[0] === 'do');
    }
  },
  {
    title: 'Play the Tonic Triad',
    hint: 'Swipe the blue, violet and red triggers',
    solfegeTriggers: solfegeTriggers.tonicTriad,
    complete: function (analysis) {
      return (analysis.harmony.root === 'do' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play the Dominant Triad',
    hint: 'Swipe the red, orange and yellow triggers',
    solfegeTriggers: solfegeTriggers.dominantTriad,
    complete: function (analysis) {
      return (analysis.harmony.root === 'sol' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play some static harmony',
    hint: 'Try alternating tonic and dominant harmonies',
    solfegeTriggers: solfegeTriggers.staticHarmony,
    complete: function (analysis, game) {
      return game.levelScore > 20;
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
  level: levels[0],
  levelScore: 0,
  totalScore: 0
};

musis.game.begin = function () {
  this.info();
};

musis.game.solfegeTriggers = function () {
  return this.level.solfegeTriggers;
};

musis.game.nextHarmony = function (analysis) {
  var score = analysis.score || 0;
  this.levelScore += score;
  this.totalScore += score;
  if (this.level.complete(analysis, this)) {
    this.levelIdx++;
    this.level = levels[this.levelIdx];
    this.totalScore += 100;
    this.levelScore = 0;
    this.info();
    return true;
  }
  this.info();
};

musis.game.info = function () {
  musis.info.title(this.level.title);
  musis.info.hint('Hint: '+this.level.hint);
  musis.info.score(this.totalScore);
};

})();
