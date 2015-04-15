(function () {

// Domain

musis.music = function () {
  this.composer = function() { return []; };
};

musis.music.prototype.nextHarmony = function (solfege) {
  this.notes = evaluateNextHarmony(solfege);
  console.log("Next Harmony: "+this.notes+". tension: "+this.notes.tension);
  this.composer = musis.compose.blockChords(this.notes);
};

musis.music.prototype.beat = function (metronome, perform) {
  var events = this.composer(metronome.nextBeatAt(), metronome.beatDuration()); // Compose for the next beat
  perform(events, this.notes);
};

var evaluateNextHarmony = function (nextSolfege) {
  var pitchClasses = musis.key.toPitchclasses(nextSolfege);
  var notes = musis.voicing.assignToVoices(pitchClasses);
  notes.tension = musis.tension.calculate(nextSolfege);
  return notes;
};

})();
