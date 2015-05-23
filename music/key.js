musis.key = {};

// Domain

musis.key.toPitchclasses = function (solfege) {
  // Assumes key of C for now
  var toPC = {
    do: "C",
    re: "D",
    me: "Eb",
    mi: "E",
    fa: "F",
    fi: "F#",
    sol: "G",
    le: "Ab",
    la: "A",
    te: "Bb",
    ti: "B"
  };
  return solfege.map(function (s) {
    var pc = new String(toPC[s]);
    pc.solfege = s;
    return pc;
  });
};
