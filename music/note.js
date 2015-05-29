(function () {

// Domain

var chromatic = {
  C: 0,
  D: 2,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  Ab: 8,
  A: 9,
  Bb: 10,
  B: 11
};

musis.note = function (pitchClass, octave) {
  if (octave === undefined) {
    // Single arg constructor
    var ident = pitchClass;
    pitchClass = ident.slice(0, -1);
    octave = parseInt(ident.slice(-1), 10);
  }
  if (octave < 1) { throw("Invalid note: "+pitchClass+"-"+octave); }
  if (octave > 6) { throw("Invalid note: "+pitchClass+"-"+octave); }
  if (!musis.tuning.freq(pitchClass)) { throw("Invalid note: "+pitchClass+"-"+octave); }
  this.pitchClass = pitchClass;
  this.octave = octave;
};

musis.note.prototype.toString = function () {
  return this.pitchClass + this.octave;
};

musis.note.prototype.absChromatic = function () {
  return chromatic[this.pitchClass] + this.octave*12;
};

musis.note.prototype.chromaticDiff = function (rhs) {
  return this.absChromatic() - rhs.absChromatic();
};

musis.note.prototype.isSamePitchAs = function (rhs) {
  return this.absChromatic() === rhs.absChromatic();
};
musis.note.prototype.isLowerThan = function (rhs) {
  return this.absChromatic() < rhs.absChromatic();
};
musis.note.prototype.isHigherThan = function (rhs) {
  return this.absChromatic() > rhs.absChromatic();
};

musis.note.prototype.freq = function () {
  return musis.tuning.freq(this.pitchClass) * Math.pow(2, this.octave-4);
};

musis.note.prototype.above = function (cmp) {
  var ret = new musis.note(this.pitchClass, this.octave);
  while (!ret.isHigherThan(cmp)) {
    ret.octave++;
  }
  return ret;
};

var idxs = {C:0, D:1, E:2, F:3, G:4, A:5, B:6};
var pcs = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
musis.note.prototype.shift = function (shift) {
  var idx = idxs[this.pitchClass] + shift;
  var octaveShift = 0;
  if (idx < 0) { idx += 7; octaveShift = -1; }
  if (idx > 6) { idx -= 7; octaveShift = 1; }
  return new musis.note(pcs[idx], this.octave+octaveShift);
};


})();
