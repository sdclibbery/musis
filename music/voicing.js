(function () {

// Domain

var voices = ["bass", "tenor", "alto", "soprano"];

var ranges = {
  bass:    { low: new musis.note("E", 2), high: new musis.note("E", 4) },
  tenor:   { low: new musis.note("C", 3), high: new musis.note("C", 5) },
  alto:    { low: new musis.note("G", 3), high: new musis.note("F", 5) },
  soprano: { low: new musis.note("C", 4), high: new musis.note("C", 6) }
};

var expandPCs = function (pitchClasses) {
  var num = pitchClasses.length;
  for (var i = num; i < voices.length; i++) {
    pitchClasses[i] = pitchClasses[i-num];
  }
  return pitchClasses;
};

var assignToVoices = function (pitchClasses) {
  var notes = [];
  for (var i = 0; i < pitchClasses.length; i++) {
    var pc = pitchClasses[i];
    notes.push(voiceNote(voices[i % voices.length], pc));
  }
  return notes;
};

var voiceNote = function (voice, pitchClass) {
  var note = new musis.note(pitchClass, 1);
  while (note.isLowerThan(ranges[voice].low)) {
    note = new musis.note(pitchClass, note.octave+1);
  }
  return note;
};

//////

musis.voicing = function () {
};

musis.voicing.prototype.makeChordComposer = function (play, stars, pitchClasses) {
  pitchClasses = expandPCs(pitchClasses);
  var notes = assignToVoices(pitchClasses);
  return function (time, duration) {
    notes.map(function (note) {
      play.note(time, note.freq(), duration);
      stars.burst(note.pitchClass);
    });
  };
};


})();