(function () {

// Domain

musis.metronome = function () {
  this.bpm = 110;
  this.nextBeat = 0;
};

musis.metronome.prototype.nextBeatAt = function () {
  return this.nextBeat;
};

musis.metronome.prototype.beatDuration = function () {
  return 60 / this.bpm;
};

musis.metronome.prototype.update = function (now, beat) {
  if (now > this.nextBeat - 0.1) { // Call back just BEFORE the next beat to make sure that events composed ON the beat can be scheduled accurately
    beat({
      time: this.nextBeatAt(),
      duration: this.beatDuration()
    });
    this.nextBeat += this.beatDuration();
  }
};

})();
