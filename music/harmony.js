(function () {

// Domain

musis.harmony = {};

var solfegeIdxs = {
  "do": 0,
  "re": 1,
  "mi": 2,
  "me": 2,
  "fa": 3,
  "fi": 3,
  "sol": 4,
  "la": 5,
  "le": 5,
  "ti": 6,
  "te": 6
};
musis.harmony.analyse = function (solfege) {

  // Single notes
  if (solfege.length === 1) {
    return {
      type:'?',
      function:rootFunction(solfege[0])
    };
  }

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
  var third = best[1] && (best[1].distance === best[0].distance + 1) ? best[1].solfege : null;
  var fifth = best[2] && (best[2].distance === best[0].distance + 2) ? best[2].solfege : null;
  var hasThird = !!third;
  var hasFifth = !!fifth;
  var hasTriad = hasThird && hasFifth;

  // also need to handle sus2/sus4

  return {
    type: 'tertian',
    root: root,
    hasTriad: hasTriad,
    quality: quality(root, third, fifth),
    function: rootFunction(root)
  };
};

var rootFunction = function (r) {
  return {
    do: 'tonic',
    re: 'predominant',
    me: 'tonic',
    mi: 'tonic',
    fa: 'predominant',
    fi: 'diminished',
    sol: 'dominant',
    le: 'predominant',
    la: 'tonic',
    te: 'dominant',
    ti: 'dominant'
  }[r];
};

var quality = function (root, third, fifth) {
  if (!root || !third || !fifth) { return; }
  var chromaticDiff = function (l, r) {
    var noteL = new musis.note(musis.key.toPitchclasses([l])[0], 3);
    var noteR = new musis.note(musis.key.toPitchclasses([r])[0], 3).above(noteL);
    return noteR.chromaticDiff(noteL);
  };
  var isMinor = function (l, r) { return chromaticDiff(l, r) === 3; };
  var isMajor = function (l, r) { return chromaticDiff(l, r) === 4; };
  if (isMinor(root, third) && isMinor(third, fifth)) {
    return 'diminished';
  } else if (isMajor(root, third) && isMajor(third, fifth)) {
    return 'augmented';
  } else {
    if (isMajor(root, third)) {
      return 'major';
    } else if (isMinor(root, third)) {
      return 'minor';
    }
  }
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
