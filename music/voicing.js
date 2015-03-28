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
  var pcs = pitchClasses.slice(0,4); // get the first four notes and ignore the rest
  var insertBass = function (comb) { comb.unshift(pcs[0]); return comb; };
  var allPCsPresent = function (comb) {
    return pcs.every(function (pc) {
      return comb.indexOf(pc) >= 0;
    });
  };
  var toNotes = function (res, comb) {
    var bs = notesWithinRange(comb[0], ranges.bass);
    var ts = notesWithinRange(comb[1], ranges.tenor);
    var as = notesWithinRange(comb[2], ranges.alto);
    var ss = notesWithinRange(comb[3], ranges.soprano);
    combinations([bs, ts, as, ss]).map(function (notes) { res.push(notes); });
    return res;
  };
  var notCrossed = function (notes) {
    for (var i = 1; i < 4; i++) {
      if (!notes[i-1].isLowerThan(notes[i])) { return false; }
    }
    return true;
  };
  var addScore = function (notes) { notes.score = 0; return notes; };
  var cmpScore = function (a, b) { return a.score - b.score; }

  var combs = combinations([pcs, pcs, pcs]) // get combinations for the upper three voices; bass is always first
    .map(insertBass)
    .filter(allPCsPresent)
    .reduce(toNotes, [])
    .filter(notCrossed) // by this point we have all possible valid voicings; now lets pick the best
    .map(addScore)
    // score each
      // proximity to last note in same voice is good
      // consecutive fifths or octaves are bad
    .sort(cmpScore)
  ;
  var voicing = combs[0];  // choose the best
  console.log(voicing);

  // todo:return voicing but also left-over PCs!
  return voicing;
};

var notesWithinRange = function (pc, range) {
  var note = new musis.note(pc, range.low.octave).above(range.low);
  var res = [];
  while (!note.isHigherThan(range.high)) {
    res.push(note);
    note = note.above(note);
  }
  return res;
};

var combinations = function (xss) { // Takes an array with one entry per slot in the output. Each entry is another array of possible values that could go in that slot.
  var n = xss.length;
  var combs = [];
  var idxs = [];
  for (var i = 0; i < n; i++) { idxs[i] = 0; }
  while (true) {
    var comb = [];
    for (var j = 0; j < n; j++) {
      comb[j] = xss[j][idxs[j]];
    }
    combs.push(comb);
    var increment = function (k) {
      idxs[k]++;
      if (idxs[k] >= xss[k].length) {
        idxs[k] = 0;
        if (k+1 === n) { return true; }
        return increment(k+1);
      }
    }
    if (increment(0)) { break; }
  }
  return combs;
};

})();