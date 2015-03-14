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
  vca.gain.value = 0.15;
  var vco = this.audio.createOscillator();
  vco.frequency.value = freqs[note];
  vco.type = "triangle";
  vco.connect(vca);
  vco.start(this.audio.currentTime);
  vco.stop(this.audio.currentTime + 1);
};

musis.play.prototype.tick = function () {
  var vca = this.audio.createGain();
  vca.connect(this.audio.destination);
  vca.gain.value = 0.15;
  var vco = this.audio.createOscillator();
  var real = [0];
  var imag = [0];
  for (var i = 1; i < 4096; i++){
    real[i] = (Math.random())*2 - 1;
    imag[i] = (Math.random())*2 - 1;
  }
  var noiseTable = this.audio.createPeriodicWave(new Float32Array(real), new Float32Array(imag));
  vco.setPeriodicWave(noiseTable);
  vco.frequency.value = 10;
  vco.connect(vca);
  var now = this.audio.currentTime;
  vca.gain.setValueAtTime(0, now);
  vca.gain.linearRampToValueAtTime(1, now + 0.03);
  vca.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  vco.start(now);
  vco.stop(now + 0.1);

};
