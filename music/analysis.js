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
    thirds.push({ solfege: s, distance: numThirds });
  });
  var combs = combinations(thirds.map(function (third) {
    return [
      { solfege: third.solfege, distance: third.distance },
      { solfege: third.solfege, distance: third.distance+7 },
      { solfege: third.solfege, distance: third.distance-7 }
    ];
  }));
  var best = thirds[0];
  var bestScore = 1e10;
  combs.map(function (thirds) {
    var score = 0;
    thirds.sort(function (a, b) { return a.distance - b.distance; });
    for (var i = 0; i < thirds.length; i++) {
      for (var j = i; j < thirds.length; j++) {
        score += Math.abs(thirds[j].distance - thirds[i].distance);
      }
    }
    if (score < bestScore) {
      bestScore = score;
      best = thirds;
    }
  });
  var root = best[0].solfege;
  var hasThird = best[1].distance === best[0].distance + 1; // Probably only valid to consider as stacked thirds if it has a third

  return root;
};


var combinations = function (xss) { // Takes an array with one entry per slot in the output. Each entry is another array of possible values that could go in that slot.
  var n = xss.length;
  var combs = [];
  var idxs = [];
  for (var i = 0; i < n; i++) { idxs[i] = 0; }
  while (true) {
    var comb = [];
    for (var j = 0; j < n; j++) {
      comb[j] = xss[j][idxs[j]];
    }
    combs.push(comb);
    var increment = function (k) {
      idxs[k]++;
      if (idxs[k] >= xss[k].length) {
        idxs[k] = 0;
        if (k+1 === n) { return true; }
        return increment(k+1);
      }
    }
    if (increment(0)) { break; }
  }
  return combs;
};

})();
