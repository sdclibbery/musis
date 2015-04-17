(function () {

// Domain

musis.perform = {};

musis.perform.beat = function (play, stars, events, terrain, notes) {
  terrain.nextHarmony(notes);
  events.map(function (event) {
    if (event.note) {
      play.chorus(event.time, event.note.freq(), event.duration);
      stars.burst(event.note); // if event is later in the beat, this should be delayed
    } else if (event.percussion) {
      play[event.percussion](event.time);
    }
  });
};


})();
