(function () {

// Domain

musis.music = function () {
  this.composer = function() { return []; };

  this.drummer = function(beat) {
    var events = [];
    events.push({ time: beat.time, percussion: 'tick' });
    if (beat.strength === 'down') {
      events.push({ time: beat.time, percussion: 'kick' });
    }
    return events;
  };
};

musis.music.prototype.nextHarmony = function (solfege) {
  this.notes = evaluateNextHarmony(solfege);
  console.log("Next Harmony: "+this.notes+". tension: "+this.notes.tension);
  this.composer = musis.compose.blockChords(this.notes);
};

musis.music.prototype.beat = function (beat, perform) {
  var events = []
    .concat(this.composer(beat))
    .concat(this.drummer(beat));
  perform(events, this.notes);
};

var evaluateNextHarmony = function (nextSolfege) {
  var pitchClasses = musis.key.toPitchclasses(nextSolfege);
  var notes = musis.voicing.assignToVoices(pitchClasses);
  notes.tension = musis.tension.calculate(nextSolfege);
  return notes;
};

})();
