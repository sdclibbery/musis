(function () {

var perform = new musis.perform();

// Domain

musis.music = function () {
  this.nextPitchClasses = [];
  this.lastBeatAt = 0;
};

musis.music.prototype.nextHarmony = function (pitchClasses) {
  this.nextPitchClasses = pitchClasses;
};

musis.music.prototype.update = function (metronome, play, stars) {
};

musis.music.prototype.update = function (metronome, play, stars) {
  if (this.nextPitchClasses.length > 0) {
    this.compose(play, stars);
    this.nextPitchClasses = [];
  }
  var nextBeatAt = metronome.nextBeatAt();
  var timeToNextBeat = nextBeatAt - play.timeNow();
  var duration = metronome.beatDuration();
  if (nextBeatAt > this.lastBeatAt && timeToNextBeat < 0.1) {
    if (this.composer) { // Compose and perform for the next beat
      var events = this.composer(nextBeatAt, duration);
      perform.beat(play, stars, events);
    }
    this.lastBeatAt = nextBeatAt;
  }
};

musis.music.prototype.compose = function (play, stars) {
  var pitchClasses = expandPCs(this.nextPitchClasses);
  var notes = musis.voicing.assignToVoices(pitchClasses);
  this.composer = musis.compose.blockChords(play, stars, notes);
};

var expandPCs = function (pitchClasses) {
  var num = pitchClasses.length;
  for (var i = num; i < 4; i++) { // at least 4 parts
    pitchClasses[i] = pitchClasses[i-num];
  }
  return pitchClasses;
};

})();