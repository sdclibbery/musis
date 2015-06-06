(function () {

// Domain

var equal12tet = '12-TET Equal Temperament';
var just5limit = '5-Limit Just Intonation';

// just5limit intonation in C
var C = 440*3/5; // root generator of the key
var fifth = 3/2; // perfect fifth
var G = C*fifth; // dominant generator
var F = C/fifth*2; // sub-dominant generator
var third = 5/4; // major third

var tunings = {
  equal12tet: {
    C: 440*Math.pow(2, -9/12),
    D: 440*Math.pow(2, -7/12),
    Eb: 440*Math.pow(2, -4/12),
    E: 440*Math.pow(2, -5/12),
    F: 440*Math.pow(2, -4/12),
    'F#': 440*Math.pow(2, -5/12),
    G: 440*Math.pow(2, -2/12),
    Ab: 440*Math.pow(2, -1/12),
    A: 440*Math.pow(2, 0/12),
    Bb: 440*Math.pow(2, 1/12),
    B: 440*Math.pow(2, 2/12)
  },
 just5limit: {
    C: C,
    D: G*fifth/2,
    Eb: G/third,
    E: C*third,
    F: F,
    'F#': G*fifth/2*third,
    G: G,
    Ab: C/third*2,
    A: F*third,
    Bb: F/fifth*2,
    B: G*third
  }
};

musis.tuning = {
  current: just5limit
};

musis.tuning.name = function () {
  return this.current;
};

musis.tuning.freq = function (pitchClass) {
  return tunings[this.current][pitchClass];
};

musis.tuning.swap = function () {
  this.current = (this.current === just5limit) ? equal12tet : just5limit;
};

})();
