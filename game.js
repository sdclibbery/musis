(function () {

// Domain

musis.game = {};

musis.game.begin = function () {
  musis.info.title('Play a Tonic Triad');
};

musis.game.solfegeTriggers = function () {
  return [
    { value: "do", size: "large", disabled: false },
    { value: "mi", size: "small", disabled: false },
    { value: "sol", size: "large", disabled: false },
    { value: "ti", size: "small", disabled: true },
    { value: "re", size: "small", disabled: true },
    { value: "fa", size: "large", disabled: true },
    { value: "la", size: "small", disabled: true }
  ];
};

musis.game.nextHarmony = function (analysis) {
  if (analysis.harmony.root === 'do' && analysis.harmony.hasTriad) {
    console.log('done!');
  }
};


})();
