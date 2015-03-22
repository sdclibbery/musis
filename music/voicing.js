(function () {

// Domain

var voices = ["bass", "tenor", "alto", "soprano"];

var ranges = {
  bass:    { low: new musis.note("E2"), high: new musis.note("E4") },
  tenor:   { low: new musis.note("C3"), high: new musis.note("C5") },
  alto:    { low: new musis.note("G3"), high: new musis.note("F5") },
  soprano: { low: new musis.note("C4"), high: new musis.note("C6") }
};

//////

musis.voicing = {};

musis.voicing.assignToVoices = function (pitchClasses) {
  var notes = [];
  pitchClasses = expandPCs(pitchClasses);
  assignBass(notes, pitchClasses[0]);

  var last = notes[0];
  for (var i = 1; i < pitchClasses.length; i++) {
    var note = new musis.note(pitchClasses[i], 2);
    note = note.above(ranges[voices[Math.min(i, 3)]].low); // in range for voice
    note = note.above(last); // higher than prev
    notes.push(note);
    last = note;
  }

  return notes;
};

var expandPCs = function (pitchClasses) {
  var num = pitchClasses.length;
  var newPCs = [];
  for (var i = 0; i < Math.max(4, num); i++) { // at least 4 parts
    newPCs[i] = pitchClasses[i%num];
  }
  return newPCs;
};

var assignBass = function (notes, pc) {
  var bass = new musis.note(pc, 2);
  notes.push(bass.above(ranges.bass.low));
}

})();