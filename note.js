(function () {

// Domain

musis.note = {};

var freqs = {
  C: 440*Math.pow(2, -9/12),
  D: 440*Math.pow(2, -7/12),
  E: 440*Math.pow(2, -5/12),
  F: 440*Math.pow(2, -4/12),
  G: 440*Math.pow(2, -2/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 2/12)
};

musis.note.freq = function (pc, octave) {
  return freqs[pc] * Math.pow(2, octave-4);
};

})();