(function () {

// Domain

musis.voicing = function () {
  this.pitchClasses = [];
};

musis.voicing.prototype.update = function (metronome, play, note) {
  var time = metronome.nextBeatAt();
  var duration = metronome.beatDuration();
  this.pitchClasses.map(function (pitchClass) {
    var freq = note.freq(pitchClass, 4);
    play.note(time, freq, duration);
  });
  this.pitchClasses = [];
};

musis.voicing.prototype.add = function (pitchClass) {
  this.pitchClasses.push(pitchClass);
};

})();