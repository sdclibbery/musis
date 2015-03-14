// Adapter for audio playback

musis.play = function () {
  this.audio = new AudioContext();
};

musis.play.prototype.freqs = {
  C: 440*Math.pow(2, -9/12),
  D: 440*Math.pow(2, -7/12),
  E: 440*Math.pow(2, -5/12),
  F: 440*Math.pow(2, -4/12),
  G: 440*Math.pow(2, -2/12),
  A: 440*Math.pow(2, 0/12),
  B: 440*Math.pow(2, 2/12)
};

musis.play.prototype.note = function (time, note, duration) {
  var vca = this.audio.createGain();
  vca.connect(this.audio.destination);
  vca.gain.value = 0.15;
  var vco = this.audio.createOscillator();
  vco.frequency.value = this.freqs[note];
  vco.type = "triangle";
  vco.connect(vca);
  vco.start(time);
  vco.stop(time + duration);
};

musis.play.prototype.timeNow = function () {
  return this.audio.currentTime;
};

musis.play.prototype.tick = function (time) {
  var attack = 0.03;
  var decay = 0.07;
  var duration = attack + decay;
  var vca = this.audio.createGain();
  vca.connect(this.audio.destination);
  vca.gain.value = 0.0;
  var vco = this.audio.createOscillator();
  var real = [0];
  var imag = [0];
  for (var i = 1; i < 4096; i++){
    real[i] = (Math.random())*2 - 1;
    imag[i] = (Math.random())*2 - 1;
  }
  var noiseTable = this.audio.createPeriodicWave(new Float32Array(real), new Float32Array(imag));
  vco.setPeriodicWave(noiseTable);
  vco.frequency.value = 1/duration;
  vco.connect(vca);
  vco.start(time);
  vca.gain.linearRampToValueAtTime(1, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};
