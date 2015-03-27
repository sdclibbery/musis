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
  var insertBass = function (comb) { comb.unshift(pitchClasses[0]); return comb; }
  var allPCsPresent = function (comb) {
    return pcs.every(function (pc) {
      return comb.indexOf(pc) >= 0;
    });
  }
  var addScore = function (comb) { return { voices: comb, score: 0 }; }
  var combs = combinations(pcs, 3) // get combinations for the upper three voices
    .map(insertBass)
    .filter(allPCsPresent)
    .map(addScore)

    // pc-to-note, picking the octave in the voices range that is closest to the voices last note

    // score each
      // proximity to last note in same voice is good
      // consecutive fifths or octaves are bad

    // choose the best

  ;
  console.log(combs);

  // return voicing but also left-over PCs

  return [];
};

var combinations = function (xs, n) {
  var num = xs.length;
  var combs = [];
  var idxs = [];
  for (var i = 0; i < n; i++) { idxs[i] = 0; }
  while (true) {
    var perm = [];
    for (var j = 0; j < n; j++) {
      perm[j] = xs[idxs[j]];
    }
    combs.push(perm);
    var increment = function (k) {
      idxs[k]++;
      if (idxs[k] >= num) {
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