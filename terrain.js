(function () {

// Domain

musis.terrain = function () {
};

var notes = null;

musis.terrain.prototype.nextHarmony = function (next) {
  notes = next;
};

musis.terrain.prototype.render = function (draw, metronome) {
  if (notes) {
    draw.terrain(metronome.bpm, notes);
  }
};

})();