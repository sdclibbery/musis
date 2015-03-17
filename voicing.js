(function () {

// Domain
/*
var ranges = {
  bass:    { low: musis.note("E", 2), high: musis.note("E", 4) },
  tenor:   { low: musis.note("C", 3), high: musis.note("C", 5) },
  alto:    { low: musis.note("G", 3), high: musis.note("F", 5) },
  soprano: { low: musis.note("C", 4), high: musis.note("C", 6) }
};

var assignNote = function (voice, pitchClass) {
  var note = ranges[voice].low;
};
*/

var makeChordComposer = function (metronome, play, note, stars, pitchClasses) {
  var notes = [];
  for (i = 0; i < pitchClasses.length; i++) {
    var pc = pitchClasses[i];
    notes.push(new note(pc, 4));
  }

  return function () {
    var time = metronome.nextBeatAt();
    var duration = metronome.beatDuration();
    notes.map(function (note) {
      play.note(time, note.freq(), duration);
      stars.burst(note.pitchClass);
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
  if (this.lastPlayedTime + duration - 0.05 <= time) {
    this.lastPlayedTime = time;
    if (this.composer) { this.composer(); }
  }
};

musis.voicing.prototype.add = function (pitchClass) {
  this.nextPitchClasses.push(pitchClass);
};

})();