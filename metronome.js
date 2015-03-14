(function () {

// Domain

musis.metronome = function () {
  this.bpm = 100;
  this.nextBeat = 0;
};

musis.metronome.prototype.nextBeatAt = function () {
  return this.nextBeat;
};

musis.metronome.prototype.beatDuration = function () {
  return 60 / this.bpm;
};

musis.metronome.prototype.update = function (dt, ctx) {
  var now = ctx.play.timeNow();
  if (now > this.nextBeat) {
    this.nextBeat += this.beatDuration();
    ctx.play.tick(this.nextBeat);
  }
};

})();