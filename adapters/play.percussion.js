// Adapter for percussion audio

musis.play.prototype.hat = function (time) {
  var attack = 0.03;
  var decay = 0.07;
  var duration = attack + decay;
  var vca = this.audio.createGain();
  this._mix(vca);
  vca.gain.value = 0.0;
  var vco = this.audio.createOscillator();
  vco.setPeriodicWave(this.createNoiseTable(2048));
  vco.frequency.value = 1/duration;
  vco.connect(vca);
  vco.start(time);
  vca.gain.linearRampToValueAtTime(0.3, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};

musis.play.prototype.snare = function (time) {
  var attack = 0.02;
  var decay = 0.3;
  var duration = attack + decay;
  var vca = this.audio.createGain();
  this._mix(vca);
  vca.gain.value = 0.0;
  var vco = this.audio.createOscillator();
  vco.setPeriodicWave(this.createNoiseTable(2048));
  vco.frequency.value = 1/duration;
  vco.connect(vca);
  vco.start(time);
  vca.gain.linearRampToValueAtTime(0.7, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};

musis.play.prototype.kick = function (time) {
  var attack = 0.02;
  var decay = 0.11;
  var duration = attack + decay;
  var vca = this.audio.createGain();
  this._mix(vca);
  vca.gain.value = 0.0;
  var vco = this.audio.createOscillator();
  vco.setPeriodicWave(this.createNoiseTable(128));
  vco.frequency.value = 1/duration;
  vco.connect(vca);
  vco.start(time);
  vca.gain.linearRampToValueAtTime(1.0, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};

musis.play.prototype.createNoiseTable = function (size) {
  var real = [0];
  var imag = [0];
  for (var i = 1; i < size; i++){
    real[i] = (Math.random())*2 - 1;
    imag[i] = (Math.random())*2 - 1;
  }
  return this.audio.createPeriodicWave(new Float32Array(real), new Float32Array(imag));
};
