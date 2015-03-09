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
    },
    trigger: function (x, y, size, hue, selected) {
      this.cv2d.shadowOffsetX = 0;
      this.cv2d.shadowOffsetY = 0;
      this.cv2d.shadowBlur = 10;
      this.cv2d.lineWidth = 3;

      this.cv2d.fillStyle = "hsl("+hue+", 100%, 45%)";
      this.cv2d.shadowColor = "hsl("+hue+", 100%, 55%)";
      this.cv2d.fillRect(this.xcoord(x), this.ycoord(y), this.hcoord(size), this.hcoord(size));

      if (selected) {
        this.cv2d.shadowColor = "white";
        this.cv2d.strokeStyle = "white";
      } else {
        this.cv2d.strokeStyle = "hsl("+hue+", 100%, 55%)";
      }
      this.cv2d.strokeRect(this.xcoord(x), this.ycoord(y), this.hcoord(size), this.hcoord(size));
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
