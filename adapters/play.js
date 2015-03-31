// Adapter for audio playback

musis.play = function () {
  this.audio = new AudioContext();
};

var fadeInOut = [0, 0.309, 0.588, 0.809, 0.951, 1, 0.951, 0.809, 0.588, 0.309, 0];

musis.play.prototype.note = function (time, freq, duration) {
  var vca = this.audio.createGain();
  vca.connect(this.audio.destination);
  vca.gain.value = 0.0;
  fadeInOut.map(function (g,i,a) {
    var f = i / a.length;
    vca.gain.linearRampToValueAtTime(0.12*g, time + f*duration*2);
  });
  var vco = this.audio.createOscillator();
  vco.frequency.value = freq;
  vco.type = "triangle";
  vco.connect(vca);
  vco.start(time);
  vco.stop(time + duration*2);
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
  vca.gain.linearRampToValueAtTime(0.3, time + attack);
  vca.gain.exponentialRampToValueAtTime(0.001, time + duration);
  vco.stop(time + duration);
};
