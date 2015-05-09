(function () {

// Domain

var solfegeTriggers = {
  tonicTriad: [
    { value: "do", size: "large", disabled: false },
    { value: "mi", size: "small", disabled: false },
    { value: "sol", size: "large", disabled: false },
    { value: "ti", size: "small", disabled: true },
    { value: "re", size: "small", disabled: true },
    { value: "fa", size: "large", disabled: true },
    { value: "la", size: "small", disabled: true }
  ],
  all: [
    { value: "do", size: "large", disabled: false },
    { value: "mi", size: "small", disabled: false },
    { value: "sol", size: "large", disabled: false },
    { value: "ti", size: "small", disabled: false },
    { value: "re", size: "small", disabled: false },
    { value: "fa", size: "large", disabled: false },
    { value: "la", size: "small", disabled: false }
  ]
};

var levels = [
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
  }
};

})();
