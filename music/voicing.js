(function () {

// Domain

var voices = ["bass", "tenor", "alto", "soprano"];

var ranges = {
  bass:    { low: new musis.note("E", 2), high: new musis.note("E", 4) },
  tenor:   { low: new musis.note("C", 3), high: new musis.note("C", 5) },
  alto:    { low: new musis.note("G", 3), high: new musis.note("F", 5) },
  soprano: { low: new musis.note("C", 4), high: new musis.note("C", 6) }
};

//////

musis.voicing = {};

musis.voicing.assignToVoices = function (pitchClasses) {
  var notes = [];
  assignBass(notes, pitchClasses[0]);

  // then a gap then other voices ascending and within their ranges
  
  return notes;
};

var assignBass = function (notes, pc) {
  var bass = new musis.note(pc, 2);
  notes.push(bass.above(ranges.bass.low));
}

})();