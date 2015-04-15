(function () {

// Domain

musis.music = function () {
  this.nextSolfege = [];
  this.composer = function() { return []; };
};

musis.music.prototype.nextHarmony = function (solfege) {
  this.nextSolfege = solfege;
};

musis.music.prototype.beat = function (metronome, perform) {
  if (this.nextSolfege.length > 0) {
    this.toNextHarmony();
    this.nextSolfege = [];
  }
  var events = this.composer(metronome.nextBeatAt(), metronome.beatDuration()); // Compose for the next beat
  perform(events, this.notes);
};

musis.music.prototype.toNextHarmony = function () {
  this.notes = evaluateNextHarmony(this.nextSolfege);
  console.log("Next Harmony: "+this.notes+". tension: "+this.notes.tension);
  this.composer = musis.compose.blockChords(this.notes);
};

var evaluateNextHarmony = function (nextSolfege) {
  var pitchClasses = musis.key.toPitchclasses(nextSolfege);
  var notes = musis.voicing.assignToVoices(pitchClasses);
  notes.tension = musis.tension.calculate(nextSolfege);
  return notes;
};

})();
