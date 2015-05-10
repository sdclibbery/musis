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

var levels = [
  {
    title: 'Play the Tonic note',
    hint: 'Tap the blue trigger',
    solfegeTriggers: makeDiatonicTriggers(['do']),
    complete: function (analysis, game) {
      return (analysis.solfege.length === 1 && analysis.solfege[0] === 'do');
    }
  },
  {
    title: 'Play the Tonic Triad',
    hint: 'Swipe the blue, violet and red triggers',
    solfegeTriggers: makeDiatonicTriggers(['do', 'mi', 'sol']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'do' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play the Dominant Triad',
    hint: 'Swipe the red, orange and yellow triggers',
    solfegeTriggers: makeDiatonicTriggers(['sol', 'ti', 're']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'sol' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Play some static harmony',
    hint: 'Score 20 points. Try alternating tonic and dominant harmonies',
    solfegeTriggers: makeDiatonicTriggers(['la', 'do', 'mi', 'sol', 'ti', 're']),
    complete: function (analysis, game) {
      return game.levelScore >= 20;
    },
    score: function (analysis, lastAnalysis) {
      return (lastAnalysis.harmony.function !== analysis.harmony.function) ? 5 : 1;
    }
  },
  {
    title: 'Play the SubDominant Triad',
    hint: 'Swipe the green, cyan and blue triggers',
    solfegeTriggers: makeDiatonicTriggers(['fa', 'la', 'do']),
    complete: function (analysis, game) {
      return (analysis.harmony.root === 'fa' && analysis.harmony.hasTriad);
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: makeDiatonicTriggers(['do', 're', 'mi', 'fa', 'sol', 'la', 'ti']),
    complete: function (analysis, game) { return false; }
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
  var completedLevel = false;
  var score = (this.level.score || this.defaultScore)(analysis, this.lastAnalysis);
  this.lastAnalysis = analysis;
  this.levelScore += score;
  this.totalScore += score;
  if (this.level.complete(analysis, this)) {
    this.totalScore += 100;
    this.levelIdx++;
    this.level = levels[this.levelIdx];
    this.levelScore = 0;
    completedLevel = true;
  }
  this.info();
  return completedLevel;
};

musis.game.info = function () {
  musis.info.title(this.level.title);
  musis.info.hint('Hint: '+this.level.hint);
  musis.info.score(this.totalScore);
};

musis.game.defaultScore = function (analysis) {
  return 0;
};


})();
