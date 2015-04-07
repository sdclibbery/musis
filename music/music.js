(function () {

// Domain

musis.music = function () {
  this.nextSolfege = [];
  this.lastBeatAt = 0;
  this.composer = { beat: function() { return []; }, end: function () {} };
};

musis.music.prototype.nextHarmony = function (solfege) {
  this.nextSolfege = solfege;
};

musis.music.prototype.update = function (metronome, perform) {
  var nextBeatAt = metronome.nextBeatAt();
  var timeToNextBeat = nextBeatAt - play.timeNow();
  var beatDuration = metronome.beatDuration();
  if (this.nextSolfege.length > 0) {
    this.composer.end(nextBeatAt, beatDuration);
    this.toNextHarmony();
    this.nextSolfege = [];
  }
  if (nextBeatAt > this.lastBeatAt && timeToNextBeat < 0.1) {
    var events = this.composer.beat(nextBeatAt, beatDuration); // Compose and perform for the next beat
    perform(events, this.notes);
    this.lastBeatAt = nextBeatAt;
  }
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