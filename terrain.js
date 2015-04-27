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
    draw.terrain(metronome.bpm, analysis.solfege, analysis.tension);
  }
};

})();
