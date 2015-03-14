(function () {

// Domain

musis.metronome = function () {
  this.bpm = 100;
  this.nextBeatAt = 0;
};

musis.metronome.prototype.update = function (dt, ctx) {
  var now = ctx.play.timeNow();
  var interval = 60 / this.bpm;
  if (now + interval >= this.nextBeatAt) {
    this.nextBeatAt += interval;
    ctx.play.tick(this.nextBeatAt);
  }
};

})();