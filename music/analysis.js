(function () {

// Domain

musis.analyse = {};

var solfegeIdxs = {
  "do": 0,
  "re": 1,
  "mi": 2,
  "fa": 3,
  "sol": 4,
  "la": 5,
  "ti": 6
};
musis.analyse.harmony = function (solfege) {
  // evaluate as tertian (stacked thirds)
  var stack = [];
  var bassIdx = solfegeIdxs[solfege[0]];
  solfege.map(function (s) {
    var diff = solfegeIdxs[s] - bassIdx;
    if (diff < 0) { diff += 7; }
    if (diff % 2 === 1) { diff += 7; }
    var numThirds = diff / 2;
    stack.push([
      { solfege: s, distance: numThirds },
      { solfege: s, distance: numThirds+7 },
      { solfege: s, distance: numThirds-7 }
    ]);
  });
  var combs = combinations(stack);
  var best = combs[0];
  var bestScore = 1e10;
  combs.map(function (stack) {
    var score = 0;
    stack.sort(function (a, b) { return a.distance - b.distance; });
    for (var i = 0; i < stack.length; i++) {
      for (var j = i; j < stack.length; j++) {
        score += Math.abs(stack[j].distance - stack[i].distance);
      }
    }
    if (score < bestScore) {
      bestScore = score;
      best = stack;
    }
  });
  var root = best[0].solfege;
  var hasThird = best[1].distance === best[0].distance + 1;
  var hasFifth = best[2].distance === best[0].distance + 2;
  var hasTriad = hasThird && hasFifth;

  // If its not stackedThirds, should also consider stacked fourths...
  if (!hasThird) { return { type:'?' }; } // Probably only valid to consider as stacked thirds if it actually has a third

  return {
    type: 'tertian',
    root: root,
    hasTriad: hasTriad
  };
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
