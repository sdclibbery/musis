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
  return note;
};

//////

musis.voicing = {};

musis.voicing.assignToVoices = function (pitchClasses) {
  var notes = [];
  for (var i = 0; i < pitchClasses.length; i++) {
    var pc = pitchClasses[i];
    notes.push(voiceNote(voices[i % voices.length], pc));
  }
  return notes;
};

})();