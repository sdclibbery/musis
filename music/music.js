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
    this.toNextHarmony();
    this.nextPitchClasses = [];
  }
  var nextBeatAt = metronome.nextBeatAt();
  var timeToNextBeat = nextBeatAt - play.timeNow();
  var beatDuration = metronome.beatDuration();
  if (nextBeatAt > this.lastBeatAt && timeToNextBeat < 0.1) {
    if (this.composer) { // Compose and perform for the next beat
      var events = this.composer(nextBeatAt, beatDuration);
      perform.beat(play, stars, events);
    }
    this.lastBeatAt = nextBeatAt;
  }
};

musis.music.prototype.toNextHarmony = function () {
  var notes = musis.voicing.assignToVoices(this.nextPitchClasses);
  console.log("Next Harmony: "+notes);
  this.composer = musis.compose.blockChords(notes);
};

})();