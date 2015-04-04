(function () {

// Domain

musis.terrain = function () {
};

var harmony = ["none", "none", "none", "none"];

musis.terrain.prototype.nextHarmony = function (next) {
	for (var i = 0; i < 4; i++) {
		harmony[i] = next[i % next.length];
	}
};

musis.terrain.prototype.render = function (draw, metronome) {
  draw.terrain(metronome.bpm, harmony);
};

})();