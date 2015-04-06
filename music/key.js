musis.key = {};

// Domain

musis.key.toPitchclasses = function (solfege) {
  // Assumes key of C for now
  var toPC = {
    do: "C",
    re: "D",
    mi: "E",
    fa: "F",
    sol: "G",
    la: "A",
    ti: "B"
  };
  var pcs = [];
  solfege.map(function (s) {
    var pc = new String(toPC[s]);
    pc.solfege = s;
    pcs.push(pc);
  });
  return pcs;
};

musis.key.toSolfege = function (pitchClass) {
  // Assumes key of C for now
  var toS = {
    C: "do",
    D: "re",
    E: "mi",
    F: "fa",
    G: "sol",
    A: "la",
    B: "ti"
  };
  return toS[pitchClass];
};
