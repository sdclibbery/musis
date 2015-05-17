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
  var analysis = {};
  analysis.solfege = solfege;
  analysis.harmony = musis.harmony.analyse(solfege);
  analysis.tension = musis.tension.analyse(solfege);
  analysis.cadence = musis.cadence.analyse(analysis);
  this.notes = musis.voicing.assignToVoices(pitchClasses);
  this.composers = [
//    musis.compose.melody(this.notes),
    musis.compose.blockChords(this.notes)
  ];
  console.log("Next Harmony: "+this.notes);
  return analysis;
};

musis.music.prototype.beat = function (beat, perform) {
  var events = this.drummer(beat);
  this.composers.map(function (composer) {
    events = events.concat(composer(beat));
  });
  perform(events, this.notes);
};

})();
