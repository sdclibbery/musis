(function () {

// Domain

var voices = ["bass", "tenor", "alto", "soprano"];

var ranges = {
  bass:    { low: new musis.note("E", 2), high: new musis.note("E", 4) },
  tenor:   { low: new musis.note("C", 3), high: new musis.note("C", 5) },
  alto:    { low: new musis.note("G", 3), high: new musis.note("F", 5) },
  soprano: { low: new musis.note("C", 4), high: new musis.note("C", 6) }
};

var voiceNote = function (voice, pitchClass) {
  var note = new musis.note(pitchClass, 1);
  while (note.isLowerThan(ranges[voice].low)) {
    note = new musis.note(pitchClass, note.octave+1);
  }
console.log("Note: "+note.pitchClass+"-"+note.octave);
  return note;
};

var makeChordComposer = function (metronome, play, stars, pitchClasses) {
  var num = pitchClasses.length;
  for (var i = num; i < voices.length; i++) {
    pitchClasses[i] = pitchClasses[i-num];
  }

  var notes = [];
  for (var i = 0; i < pitchClasses.length; i++) {
    var pc = pitchClasses[i];
    notes.push(voiceNote(voices[i % voices.length], pc));
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

musis.voicing.prototype.update = function (metronome, play, stars) {
  if (this.nextPitchClasses.length > 0) {
    this.composer = makeChordComposer(metronome, play, stars, this.nextPitchClasses);
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