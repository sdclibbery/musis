(function () {

// Domain

var freqs = {
  C: 440*Math.pow(2, -9/12),
  D: 440*Math.pow(2, -7/12),
  E: 440*Math.pow(2, -5/12),
  F: 440*Math.pow(2, -4/12),
  G: 440*Math.pow(2, -2/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 2/12)
};

musis.note = function (pitchClass, octave) {
  this.pitchClass = pitchClass;
  this.octave = octave;
};

musis.note.prototype.freq = function () {
  return freqs[this.pitchClass] * Math.pow(2, this.octave-4);
};

})();