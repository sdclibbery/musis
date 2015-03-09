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
    xToCanvas: function (x) {
      return 0.5*(this.cw + this.ch*x);
    },
    yToCanvas: function (y) {
      return 0.5 * this.ch * (1+y);
    },
    xFromCanvas: function (x) {
      return (x*2 - this.cw) / this.ch;
    },
    yFromCanvas: function (y) {
      return y*2/this.ch - 1;
    },
    hToCanvas: function (h) {
      return 0.5 * this.ch * h;
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
      var s = this.hToCanvas(size);
      var hs = s/2;

      this.cv2d.shadowOffsetX = 0;
      this.cv2d.shadowOffsetY = 0;
      this.cv2d.shadowBlur = 10;
      this.cv2d.lineWidth = 3;

      this.cv2d.fillStyle = "hsl("+hue+", 100%, 45%)";
      this.cv2d.shadowColor = "hsl("+hue+", 100%, 55%)";
      this.cv2d.fillRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);

      if (selected) {
        this.cv2d.shadowColor = "white";
        this.cv2d.strokeStyle = "white";
      } else {
        this.cv2d.strokeStyle = "hsl("+hue+", 100%, 55%)";
      }
      this.cv2d.strokeRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);
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

musis.touchstart = function (x, y) {
};

musis.touchmove = function (x, y) {
  var tx = ctx.draw.xFromCanvas(x);
  var ty = ctx.draw.yFromCanvas(y);
  triggers.touch(tx, ty);
};

musis.touchend = function (x, y) {
};
