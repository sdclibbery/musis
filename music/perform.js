(function () {

// Domain

musis.perform = {};

musis.perform.beat = function (play, stars, events) {
  events.map(function (event) {
    play.note(event.time, event.note.freq(), event.duration);
    stars.burst(event.note.solfege); // if event is later in the beat, this should be delayed
  });
};


})();