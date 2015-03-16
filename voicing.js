(function () {

// Domain

var makeChordComposer = function (metronome, play, note, stars, pitchClasses) {
  return function () {
    var time = metronome.nextBeatAt();
    var duration = metronome.beatDuration();
    pitchClasses.map(function (pitchClass) {
      var freq = note.freq(pitchClass, 4);
      play.note(time, freq, duration);
      stars.burst(pitchClass);
    });
  };
};

//////

musis.voicing = function () {
  this.nextPitchClasses = [];
  this.lastPlayedTime = 0;
};

musis.voicing.prototype.update = function (metronome, play, note, stars) {
  if (this.nextPitchClasses.length > 0) {
    this.composer = makeChordComposer(metronome, play, note, stars, this.nextPitchClasses);
    this.nextPitchClasses = [];
  }

  var time = metronome.nextBeatAt();
  var duration = metronome.beatDuration();
  if (this.lastPlayedTime < time) {
    this.lastPlayedTime = time;
    if (this.composer) { this.composer(); }
  }
};

musis.voicing.prototype.add = function (pitchClass) {
  this.nextPitchClasses.push(pitchClass);
};

})();