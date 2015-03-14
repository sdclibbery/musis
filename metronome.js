(function () {

musis.metronome = function () {
  this.bpm = 100;
};

musis.metronome.prototype.update = function (dt, ctx) {
  var nbt = ctx.play.nextBeatTime(this.bpm);
  if (nbt !== this.nextBeatTime) {
    ctx.play.tick(nbt);
  }
  this.nextBeatTime = nbt;
};

})();