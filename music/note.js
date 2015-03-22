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

var chromatic = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
};

musis.note = function (pitchClass, octave) {
  this.pitchClass = pitchClass;
  this.octave = octave;
};

musis.note.prototype.toString = function () {
  return this.pitchClass + this.octave;
};

musis.note.prototype.absChromatic = function () {
  return chromatic[this.pitchClass] + this.octave*12;
};

musis.note.prototype.isLowerThan = function (rhs) {
  return this.absChromatic() < rhs.absChromatic();
};
musis.note.prototype.isHigherThan = function (rhs) {
  return this.absChromatic() > rhs.absChromatic();
};

musis.note.prototype.freq = function () {
  return freqs[this.pitchClass] * Math.pow(2, this.octave-4);
};

musis.note.prototype.above = function (cmp) {
  var ret = new musis.note(this.pitchClass, this.octave);
  while (!ret.isHigherThan(cmp)) {
    ret.octave++;
  }
  return ret;
};

})();