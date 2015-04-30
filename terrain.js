(function () {

// Domain

musis.terrain = function () {
};

var analysis = null;

musis.terrain.prototype.nextHarmony = function (analysisIn) {
  analysis = analysisIn;
};

musis.terrain.prototype.render = function (draw, metronome) {
  if (analysis) {
    var h = analysis.harmony || {};
    draw.terrain(metronome.bpm, analysis.tension, h.root, h.function);
  }
};

})();
