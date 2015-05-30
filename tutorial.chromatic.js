(function () {

// Domain

var levels = [
  {
    title: 'Play the Secondary Dominant',
    hint: 'Swipe the highlighted triggers',
    solfegeTriggers: ['re', 'fi', 'la'],
    complete: function (analysis, game) {
      return (analysis.harmony.root === 're' && analysis.harmony.hasTriad && analysis.harmony.quality === 'major');
    }
  },
  {
    title: 'Finished!',
    solfegeTriggers: ['do', 're', 'mi', 'me', 'fa', 'fi', 'sol', 'la', 'le', 'ti', 'te'],
    complete: function (analysis, game) { return false; }
  }
];

musis.tutorial.chromatic = musis.tutorial.create(levels);

})();
