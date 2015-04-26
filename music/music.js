(function () {

// Domain

musis.music = function () {
  this.composers = [];

  this.drummer = function(beat) {
    var events = [];
    if (beat.strength === 'down') {
      events.push({ time: beat.time, percussion: 'kick' });
    }
    if (beat.strength === 'up') {
      events.push({ time: beat.time, percussion: 'snare' });
    }
    beat.subBeats.map(function (time) {
      events.push({ time: beat.time + time*beat.duration, percussion: 'hat' });
    });
    return events;
  };
};

musis.music.prototype.nextHarmony = function (solfege) {
  this.notes = evaluateNextHarmony(solfege);
  console.log("Next Harmony: "+this.notes+". tension: "+this.notes.tension);
  this.composers = [
//    musis.compose.melody(this.notes),
    musis.compose.blockChords(this.notes)
  ];
  return musis.music.analyse(solfege);
};

musis.music.prototype.beat = function (beat, perform) {
  var events = this.drummer(beat);
  this.composers.map(function (composer) {
    events = events.concat(composer(beat));
  });
  perform(events, this.notes);
};

var evaluateNextHarmony = function (nextSolfege) {
  var pitchClasses = musis.key.toPitchclasses(nextSolfege);
  var notes = musis.voicing.assignToVoices(pitchClasses);
  notes.tension = musis.tension.calculate(nextSolfege);
  return notes;
};

})();
