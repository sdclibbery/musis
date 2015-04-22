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
        note: note,
        instrument: 'chorus'
      });
    });
    return events;
  };
};

musis.compose.melody = function (notes) {
  var note = notes[3];
  return function (beat) {
    var events = [];
    var next = function () {
      note = note.shift(Math.floor(Math.random()*3)-1);
      if (Math.random > 0.8) { note = notes[3]; }
      note.solfege = "none"; // !!!
      return note;
    }
    var chooser = Math.random();
    if (chooser < 0.5) {
      events.push({
        time: beat.time,
        duration: beat.duration,
        note: next(),
        instrument: 'lead'
      });
    } else if (beat.subBeats[0] && chooser < 0.8) {
      events.push({
        time: beat.time,
        duration: beat.duration*beat.subBeats[0],
        note: next(),
        instrument: 'lead'
      });
      events.push({
        time: beat.time+beat.duration*beat.subBeats[0],
        duration: beat.duration*(1-beat.subBeats[0]),
        note: next(),
        instrument: 'lead'
      });
    }
    return events;
  };
};


})();
