(function () {

// Domain
/*
// equal temperament
var freqs = {
  C: 440*Math.pow(2, -9/12),
  D: 440*Math.pow(2, -7/12),
  E: 440*Math.pow(2, -5/12),
  F: 440*Math.pow(2, -4/12),
  G: 440*Math.pow(2, -2/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 2/12)
};
*/

// just intonation
var C = 528; // root generator of the key
var fifth = 3/2; // perfect fifth
var G = C*fifth; // dominant generator
var F = C/fifth*2; // sub-dominant generator
var third = 5/4; // major third
var freqs = {
  C: C,
  D: G*fifth,
  E: C*third,
  F: F,
  G: G,
  A: F*third,
  B: G*third
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
  if (octave === undefined) {
    // Single arg constructor
    var ident = pitchClass;
    pitchClass = ident.slice(0, -1);
    octave = parseInt(ident.slice(-1), 10);
  }
  if (octave < 1) { throw("Invalid note: "+pitchClass+"-"+octave); }
  if (octave > 6) { throw("Invalid note: "+pitchClass+"-"+octave); }
  if (!freqs.hasOwnProperty(pitchClass)) { throw("Invalid note: "+pitchClass+"-"+octave); }
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