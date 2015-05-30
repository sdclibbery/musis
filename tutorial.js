(function () {

// Domain

musis.tutorial = {};

var info = function (level) {
  musis.ui.title(level.title);
  musis.ui.hint('Hint: '+level.hint);
};

musis.tutorial.create = function (levels) {
  return {
    levelIdx: 0,
    level: levels[0],

    begin: function () {
      info(this.level);
    },

    solfegeTriggers: function () {
      return this.level.solfegeTriggers;
    },

    nextHarmony: function (analysis) {
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
    }
  };
};

})();
