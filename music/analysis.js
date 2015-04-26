(function () {

// Domain

var solfegeIdxs = {
  "do": 0,
  "re": 1,
  "mi": 2,
  "fa": 3,
  "sol": 4,
  "la": 5,
  "ti": 6
};
musis.music.analyse = function (solfege) {
  // evaluate as stacked thirds
  var thirds = [];
  var bassIdx = solfegeIdxs[solfege[0]];
  solfege.map(function (s) {
    var diff = solfegeIdxs[s] - bassIdx;
    if (diff < 0) { diff += 7; }
    if (diff % 2 === 1) { diff += 7; }
    var numThirds = diff / 2;
    if (numThirds > 3) { numThirds -= 7; } // Broken: need to consider all possible arrangements of the input solfege (eg Cmaj9 gets wrong root)
    thirds.push({ solfege: s, distance: numThirds, toString: function () {return this.distance+':'+this.solfege;} });
  });
  thirds.sort(function (a, b) { return a.distance - b.distance; });
  var root = thirds[0].solfege;
  var hasThird = thirds[1].distance === thirds[0].distance + 1; // Probably only valid to consider as stacked thirds if it has a third

  return thirds.toString();
};

})();
