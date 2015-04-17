(function () {

// Domain

musis.metronome = function () {
  this.bpm = 110;
  this.nextBeat = 0;
  this.nextBeatIdx = 0;
  this.beats = [
    { strength: 'down', subBeats: [ 0.5 ] },
    { strength: 'up', subBeats: [ 0.5 ] }
  ];
};

musis.metronome.prototype.nextBeatAt = function () {
  return this.nextBeat;
};

musis.metronome.prototype.beatDuration = function () {
  return 60 / this.bpm;
};

musis.metronome.prototype.update = function (now, action) {
  if (now > this.nextBeat - 0.1) { // Call back just BEFORE the next beat to make sure that events composed ON the beat can be scheduled accurately
    var beat = this.beats[this.nextBeatIdx];
    beat.time = this.nextBeatAt();
    beat.duration = this.beatDuration();
    action(beat);
    this.nextBeat += this.beatDuration();
    this.nextBeatIdx = (this.nextBeatIdx + 1) % this.beats.length;
  }
};

})();
