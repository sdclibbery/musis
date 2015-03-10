musis.play = function () {
  this.audio = new AudioContext();

  /* VCO */
  this.vco = this.audio.createOscillator();
  this.vco.type = this.vco.SINE;
  this.vco.frequency.value = 110;
  this.vco.start(0);

  /* VCA */
  this.vca = this.audio.createGain();
  this.vca.gain.value = 0;

  /* Connections */
  this.vco.connect(this.vca);
  this.vca.connect(this.audio.destination);
};

var freqs = {
  C: 440*Math.pow(2, -5/12),
  D: 440*Math.pow(2, -4/12),
  E: 440*Math.pow(2, -3/12),
  F: 440*Math.pow(2, -2/12),
  G: 440*Math.pow(2, -1/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 1/12)
};
musis.play.prototype.note = function (note) {
  this.vca.gain.value = 1;
  this.vco.frequency.value = freqs[note];
};
