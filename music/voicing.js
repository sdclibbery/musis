(function () {

// Domain

var voices = ["bass", "tenor", "alto", "soprano"];

var ranges = {
  bass:    { low: new musis.note("E2"), mid: new musis.note("C3"), high: new musis.note("E4") },
  tenor:   { low: new musis.note("C3"), mid: new musis.note("C4"), high: new musis.note("C5") },
  alto:    { low: new musis.note("G3"), mid: new musis.note("G4"), high: new musis.note("F5") },
  soprano: { low: new musis.note("C4"), mid: new musis.note("C5"), high: new musis.note("C6") }
};

//////

musis.voicing = {};
musis.voicing.previous = [ ranges.bass.mid, ranges.tenor.mid, ranges.alto.mid, ranges.soprano.mid ];

musis.voicing.assignToVoices = function (pitchClasses) {
  var pcs = pitchClasses.slice(0,4); // get the first four notes and ignore the rest
  var insertBass = function (comb) { comb.unshift(pcs[0]); return comb; };
  var allPCsPresent = function (comb) {
    return pcs.every(function (pc) {
      return comb.indexOf(pc) >= 0;
    });
  };

  var combs = combinations([pcs, pcs, pcs]) // get combinations for the upper three voices; bass is always first
    .map(insertBass)
    .filter(allPCsPresent)
    .reduce(toNotesInRange, [])
    .filter(notCrossed) // after this point we have all possible valid voicings; now lets pick the best
    .map(addScore)
    .map(scoreRange)
    .map(scoreSpacing)
    .map(scoreSmoothness)
    .map(scoreLeadingNoteResolution)
//    .map(scoreParallels)
    .sort(cmpScore)
  ;
  var voicing = combs[0];  // choose the best
console.log(voicing);
  musis.voicing.previous = voicing;

  // todo:return voicing but also left-over PCs!
  return voicing;
};

var toNotesInRange = function (res, comb) {
  var bs = notesWithinRange(comb[0], ranges.bass);
  var ts = notesWithinRange(comb[1], ranges.tenor);
  var as = notesWithinRange(comb[2], ranges.alto);
  var ss = notesWithinRange(comb[3], ranges.soprano);
  combinations([bs, ts, as, ss]).map(function (notes) { res.push(notes); });
  return res;
};

var notesWithinRange = function (pc, range) {
  var note = new musis.note(pc, range.low.octave).above(range.low);
  var res = [];
  while (!note.isHigherThan(range.high)) {
    note.solfege = pc.solfege;
    res.push(note);
    note = note.above(note);
  }
  return res;
};

var notCrossed = function (notes) {
  for (var i = 1; i < 4; i++) {
    if (notes[i-1].isSamePitchAs(notes[i])) { continue; }
    if (!notes[i-1].isLowerThan(notes[i])) { return false; }
  }
  return true;
};

var addScore = function (notes) { notes.score = 0; return notes; };

var scoreRange = function (notes) {
  notes.map(function (note, idx) {
    var diff = note.chromaticDiff(ranges[voices[idx]].mid);
    notes.score -= Math.abs(diff) / 2;
  });
  return notes;
};

var scoreSpacing = function (notes) {
  for (var i = 1; i < 4; i++) {
    var diff = notes[i].chromaticDiff(notes[i-1]);
    var limit = (i === 1) ? 12 : 7
    notes.score += limit - Math.max(Math.abs(diff), limit);
  }
  return notes;
};

var scoreSmoothness = function (notes) {
  notes.map(function (note, idx) {
    var diff = note.chromaticDiff(musis.voicing.previous[idx]);
    notes.score -= Math.abs(diff);
  });
  return notes;
};

var scoreLeadingNoteResolution = function (notes) {
  notes.map(function (note, idx) {
    var prev = musis.voicing.previous[idx];
    var chromaticDiff = note.chromaticDiff(prev);
    if (prev.solfege === "ti" && note.solfege === "do" && chromaticDiff === 1) {
      notes.score += 10;
    }
  });
  return notes;
};

var cmpScore = function (a, b) { return b.score - a.score; }

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