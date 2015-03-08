musis = {}


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



var t = 0;
var selected = false;
var rx = 0;
var ry = 0;
var rs = 0.04;
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


  t = t+dt/1000;
  rx = Math.sin(t*(1+t/100));
  ry = Math.cos(t*2);


  cv2d.shadowOffsetX = 0;
  cv2d.shadowOffsetY = 0;
  cv2d.shadowBlur = 10;
  cv2d.lineWidth = 3;


  cv2d.fillStyle = "rgba(0, 0, 0, 0.2)";
  cv2d.shadowColor = "black";
  cv2d.fillRect(0, 0, cw, ch);

  cv2d.fillStyle = "hsl(120, 100%, 45%)";
  cv2d.shadowColor = "hsl(120, 100%, 55%)";
  cv2d.fillRect(xcoord(rx), ycoord(ry), hcoord(rs), hcoord(rs));
  if (selected) {
    cv2d.shadowColor = "white";
    cv2d.strokeStyle = "white";
  } else {
    cv2d.strokeStyle = "hsl(120, 100%, 55%)";
  }
  cv2d.strokeRect(xcoord(rx), ycoord(ry), hcoord(rs), hcoord(rs));
};

musis.touchstart = function (x, y, cw, ch) {
};

musis.touchmove = function (x, y, cw, ch) {
  tx = 2*x/cw - 1;
  ty = 2*y/ch - 1;
  if (tx >= rx && tx <= rx+rs && ty >= ry && ty <= ry+rs) {
    selected = true;
  }
};

musis.touchend = function (x, y, cw, ch) {
};
