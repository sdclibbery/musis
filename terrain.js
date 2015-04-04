(function () {

// Domain

musis.terrain = function () {
};

musis.terrain.prototype.render = function (draw, metronome) {
  draw.terrain(metronome.bpm);
};

})();