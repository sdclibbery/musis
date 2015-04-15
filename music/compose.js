(function () {

// Domain

musis.compose = {};

musis.compose.blockChords = function (notes) {
  return function (time, beatDuration) {
    var events = [];
    notes.map(function (note) {
      events.push({
        time: time,
        duration: beatDuration,
        note: note
      });
    });
    return events;
  };
};


})();
