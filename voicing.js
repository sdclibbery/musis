(function () {

// Domain

musis.voicing = function () {
  this.notes = [];
};

musis.voicing.prototype.update = function (metronome, play) {
  var time = metronome.nextBeatAt();
  var duration = metronome.beatDuration();
  this.notes.map(function (note) {
    play.note(time, note, duration);
  });
  this.notes = [];
};

musis.voicing.prototype.add = function (note) {
  this.notes.push(note);
};

})();