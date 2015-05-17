(function () {

// Domain

musis.cadence = {};

var lastFunction;
var last = '';

musis.cadence.analyse = function (analysis) {
  if (lastFunction === 'tonic') {
    last = analysis.harmony.function[0]; // After tonic, clear out and start new cadence
  } else if (analysis.harmony.function !== lastFunction) {
    last += analysis.harmony.function[0]; // Add on to cadence string
  }
  lastFunction = analysis.harmony.function;
  return last;
};

})();
