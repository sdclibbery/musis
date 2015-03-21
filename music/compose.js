(function () {

// Domain

var voicing = new musis.voicing();

var expandPCs = function (pitchClasses) {
  var num = pitchClasses.length;
  for (var i = num; i < 4; i++) { // at least 4 parts
    pitchClasses[i] = pitchClasses[i-num];
  }
  return pitchClasses;
};

//////

musis.compose = function () {
};

musis.compose.prototype.blockChords = function (play, stars, pitchClasses) {
  pitchClasses = expandPCs(pitchClasses);
  var notes = voicing.assignToVoices(pitchClasses);
  return function (time, duration) {
    notes.map(function (note) {
      play.note(time, note.freq(), duration);
      stars.burst(note.pitchClass);
    });
  };
};


})();