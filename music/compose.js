(function () {

// Domain

musis.compose = {};

musis.compose.blockChords = function (notes) {
  return function (beat) {
    var events = [];
    notes.map(function (note) {
      events.push({
        time: beat.time,
        duration: beat.duration,
        note: note
      });
    });
    return events;
  };
};


})();
