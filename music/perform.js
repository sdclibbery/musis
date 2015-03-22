(function () {

// Domain

musis.perform = function () {};

musis.perform.prototype.beat = function (play, stars, events) {
  events.map(function (event) {
    play.note(event.time, event.note.freq(), event.duration);
    stars.burst(event.note.pitchClass); // if event is later in the beat, this should be delayed
  });
};


})();