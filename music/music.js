(function () {

// Domain

var voicing = new musis.voicing();

musis.music = function () {
  this.nextPitchClasses = [];
  this.lastBeatAt = 0;
};

musis.music.prototype.update = function (metronome, play, stars) {
  if (this.nextPitchClasses.length > 0) {
    this.composer = voicing.makeChordComposer(play, stars, this.nextPitchClasses);
    this.nextPitchClasses = [];
  }

  var nextBeatAt = metronome.nextBeatAt();
  var timeToNextBeat = nextBeatAt - play.timeNow();
  var duration = metronome.beatDuration();
  if (nextBeatAt > this.lastBeatAt && timeToNextBeat < 0.1) {
    if (this.composer) { this.composer(nextBeatAt, duration); }
    this.lastBeatAt = nextBeatAt;
  }
};

musis.music.prototype.nextHarmony = function (pitchClasses) {
  this.nextPitchClasses = pitchClasses;
};

})();