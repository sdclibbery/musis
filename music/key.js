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
