musis.play = function () {
  this.audio = new AudioContext();
};

var freqs = {
  C: 440*Math.pow(2, -9/12),
  D: 440*Math.pow(2, -7/12),
  E: 440*Math.pow(2, -5/12),
  F: 440*Math.pow(2, -4/12),
  G: 440*Math.pow(2, -2/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 2/12)
};
musis.play.prototype.note = function (note) {
  var vca = this.audio.createGain();
  vca.connect(this.audio.destination);
  vca.gain.value = 0.1;
  var vco = this.audio.createOscillator();
  vco.type = 'sawtooth';
  vco.frequency.value = freqs[note];
  vco.connect(vca);
  vco.start(this.audio.currentTime);
  vco.stop(this.audio.currentTime + 1);
};
