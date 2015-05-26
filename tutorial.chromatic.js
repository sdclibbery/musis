(function () {

// Domain

var levels = [
  {
    title: 'Play the Secondary Dominant',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: ['re', 'fi', 'la'],
    complete: function (analysis, game) {
      return (analysis.harmony.root === 're' && analysis.harmony.hasTriad && analysis.harmony.quality === 'major');
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: ['do', 're', 'mi', 'me', 'fa', 'fi', 'sol', 'la', 'le', 'ti', 'te'],
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
