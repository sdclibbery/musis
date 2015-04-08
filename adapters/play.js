// Adapter for audio playback

musis.play = function () {
  this.audio = new AudioContext();
  this._initReverb();
};

musis.play.prototype.timeNow = function () {
  return this.audio.currentTime;
};

var ffts = [];
musis.play.prototype.loadFft = function (name) {
  var fft = musis[name];
  if (!ffts[name]) {
    ffts[name] = this.audio.createPeriodicWave(new Float32Array(fft.real), new Float32Array(fft.imag));
  }
  return ffts[name];
}

var fadeInOut = [0, 0.309, 0.588, 0.809, 0.951, 1, 0.951, 0.809, 0.588, 0.309, 0];
musis.play.prototype.chorus = function (time, freq, duration) {
  var vca = this.audio.createGain();
  this._mix(vca);
  vca.gain.value = 0.0;
  fadeInOut.map(function (g,i,a) {
    var f = i / a.length;
    vca.gain.linearRampToValueAtTime(0.12*g, time + f*duration*2);
  });
  var vco = this.audio.createOscillator();
  vco.frequency.value = freq;
  vco.setPeriodicWave(this.loadFft("celeste_fft"));
  vco.connect(vca);
  vco.start(time);
  vco.stop(time + duration*2);
};

musis.play.prototype.tick = function (time) {
  var attack = 0.03;
  var decay = 0.07;
  var duration = attack + decay;
  var vca = this.audio.createGain();
  this._mix(vca);
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
  vca.gain.linearRampToValueAtTime(0.3, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};


musis.play.prototype._initReverb = function () {
  this.reverb = this.audio.createConvolver();
  var seconds = 1;
  var decay = 5;
  var rate = this.audio.sampleRate;
  var length = rate * seconds;
  var impulse = this.audio.createBuffer(2, length, rate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);
  for (var i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  this.reverb.buffer = impulse;
  this.reverb.connect(this.audio.destination);
};

musis.play.prototype._mix = function (node) {
  node.connect(this.reverb);
  node.connect(this.audio.destination);
};

