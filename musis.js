musis = {}

var t = 0;

var audio = new AudioContext();

/* VCO */
var vco = audio.createOscillator();
vco.type = vco.SINE;
vco.frequency.value = this.frequency;
vco.start(0);

/* VCA */
var vca = audio.createGain();
vca.gain.value = 0;

/* Connections */
vco.connect(vca);
vca.connect(audio.destination);

var f = 110;
vco.frequency.value = f;

/*
canvas.onmousedown = function () {
  vco.frequency.value = f;
  f *= Math.pow(2, 1/12);
  console.log(f);
  vca.gain.value = 1;
};

canvas.onmouseup = function () {
  vca.gain.value = 0;
};
*/


musis.frame = function (dt, cv2d, w, h) {

  var xcoord = function (x) {
    return 0.5 * w * (1+x);
  };
  var ycoord = function (y) {
    return 0.5 * h * (1+y);
  };

  cv2d.shadowOffsetX = 0;
  cv2d.shadowOffsetY = 0;
  cv2d.shadowBlur = 10;

  cv2d.fillStyle = "rgba(0, 0, 0, 0.05)";
  cv2d.shadowColor = "black";
  cv2d.fillRect(0, 0, w, h);

  cv2d.fillStyle = "green";
  cv2d.shadowColor = "#00ff00";
  cv2d.fillRect(xcoord(Math.sin(t*(1+t/100))), ycoord(Math.cos(t*2)), 10, 10);
  t = t+dt/1000;
}