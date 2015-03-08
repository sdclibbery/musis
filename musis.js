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


var hue = 120;
musis.frame = function (dt, cv2d, cw, ch) {

  var xcoord = function (x) {
    return 0.5 * cw * (1+x);
  };
  var ycoord = function (y) {
    return 0.5 * ch * (1+y);
  };
  var hcoord = function (h) {
    return ch * h;
  };

  cv2d.shadowOffsetX = 0;
  cv2d.shadowOffsetY = 0;
  cv2d.shadowBlur = 10;

  cv2d.fillStyle = "rgba(0, 0, 0, 0.2)";
  cv2d.shadowColor = "black";
  cv2d.fillRect(0, 0, cw, ch);

  cv2d.fillStyle = "hsl("+hue+", 100%, 45%)";
  cv2d.shadowColor = "hsl("+hue+", 100%, 55%)";
  cv2d.fillRect(xcoord(Math.sin(t*(1+t/100))), ycoord(Math.cos(t*2)), hcoord(0.04), hcoord(0.04));
  t = t+dt/1000;
};

musis.dragstart = function (x, y, cw, ch) {
  hue += 30;
  hue %= 360;
};
