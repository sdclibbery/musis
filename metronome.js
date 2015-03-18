(function () {

// Domain

musis.metronome = function () {
  this.bpm = 110;
  this.nextBeat = 0;
};

musis.metronome.prototype.nextBeatAt = function () {
  return this.nextBeat;
};

musis.metronome.prototype.timeToNextBeat = function () {
	return this.nextBeatAt() - play.timeNow();
};

musis.metronome.prototype.beatDuration = function () {
  return 60 / this.bpm;
};

musis.metronome.prototype.update = function (play) {
  var now = play.timeNow();
  if (now > this.nextBeat) {
    this.nextBeat += this.beatDuration();
    play.tick(this.nextBeat);
  }
};

})();