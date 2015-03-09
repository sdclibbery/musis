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

ctx = {
  draw: {
    cv2d: null,
    cw: 100,
    ch: 100,
    xcoord: function (x) {
      return 0.5 * this.cw * (1+x);
    },
    ycoord: function (y) {
      return 0.5 * this.ch * (1+y);
    },
    hcoord: function (h) {
      return this.ch * h;
    },
    frameStart: function (cv2d, cw, ch) {
      this.cv2d = cv2d;
      this.cw = cw;
      this.ch = ch;
      this.cv2d.fillStyle = "rgba(0, 0, 0, 0.2)";
      this.cv2d.shadowColor = "black";
      this.cv2d.fillRect(0, 0, this.cw, this.ch);
    }
  }
}

var triggers;

musis.init = function () {
  triggers = new musis.triggers();
};

musis.frame = function (dt, cv2d, cw, ch) {

  // Update
  triggers.update(dt);

  // Render
  ctx.draw.frameStart(cv2d, cw, ch);
  triggers.render(ctx);
};

musis.touchstart = function (x, y, cw, ch) {
};

musis.touchmove = function (x, y, cw, ch) {
  var tx = 2*x/cw - 1;
  var ty = 2*y/ch - 1;
  triggers.touch(tx, ty);
};

musis.touchend = function (x, y, cw, ch) {
};
