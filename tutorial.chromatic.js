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

musis.tutorial.chromatic.begin = function () {
  info(this.level);
};

musis.tutorial.chromatic.solfegeTriggers = function () {
  return this.level.solfegeTriggers;
};

musis.tutorial.chromatic.nextHarmony = function (analysis) {
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
  info(this.level);
  return completedLevel;
};

var info = function (level) {
  musis.ui.title(level.title);
  musis.ui.hint('Hint: '+level.hint);
};

})();
