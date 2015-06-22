(function () {

// Domain

musis.perform = {};

musis.perform.beat = function (play, events) {
  events.map(function (event) {
    if (event.note) {
      play[event.instrument](event.time, event.note.freq(), event.duration);
    } else if (event.percussion) {
      play[event.percussion](event.time);
    }
  });
};


})();
