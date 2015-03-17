(function () {

// Domain

var makeChordComposer = function (metronome, play, note, stars, pitchClasses) {
  var notes = [];
  var octave = 3;
  var lastFreq = 0;
  for (i = 0; i < pitchClasses.length; i++) {
    var pc = pitchClasses[i];
    var freq = note.freq(pc, octave);
    if (freq/lastFreq < Math.pow(2, 3/12)) {
      octave++;
      freq = note.freq(pc, octave);
    }
    notes.push({freq: freq, pitchClass: pc});
    lastFreq = freq;
  }

  return function () {
    var time = metronome.nextBeatAt();
    var duration = metronome.beatDuration();
    notes.map(function (note) {
      play.note(time, note.freq, duration);
      stars.burst(note.pitchClass);
    });
  };
};

//////

musis.voicing = function () {
  this.nextPitchClasses = [];
  this.lastPlayedTime = 0;
};

musis.voicing.prototype.update = function (metronome, play, note, stars) {
  if (this.nextPitchClasses.length > 0) {
    this.composer = makeChordComposer(metronome, play, note, stars, this.nextPitchClasses);
    this.nextPitchClasses = [];
  }

  var time = metronome.nextBeatAt();
  var duration = metronome.beatDuration();
  if (this.lastPlayedTime + duration - 0.05 <= time) {
    this.lastPlayedTime = time;
    if (this.composer) { this.composer(); }
  }
};

musis.voicing.prototype.add = function (pitchClass) {
  this.nextPitchClasses.push(pitchClass);
};

})();