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
  var pitchClasses = musis.key.toPitchclasses(solfege);
  this.notes = musis.voicing.assignToVoices(pitchClasses);
console.log("Next Harmony: "+this.notes);
  this.composers = [
//    musis.compose.melody(this.notes),
    musis.compose.blockChords(this.notes)
  ];
  return {
    solfege: solfege,
    harmony: musis.analyse.harmony(solfege),
    tension: musis.tension.calculate(solfege)
    // progression:
    // cadence:
  }
};

musis.music.prototype.beat = function (beat, perform) {
  var events = this.drummer(beat);
  this.composers.map(function (composer) {
    events = events.concat(composer(beat));
  });
  perform(events, this.notes);
};

})();
