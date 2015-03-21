(function () {

// Domain

musis.compose = {};

musis.compose.blockChords = function (play, stars, notes) {
  return function (time, duration) {
    notes.map(function (note) {
      play.note(time, note.freq(), duration);
      stars.burst(note.pitchClass);
    });
  };
};


})();