(function () {

// Domain

musis.compose = {};

musis.compose.blockChords = function (play, stars, notes) {
  return function (time, duration) {
    var events = [];
    notes.map(function (note) {
      events.push({
        time: time,
        duration: duration,
        note: note
      });
    });
    return events;
  };
};


})();