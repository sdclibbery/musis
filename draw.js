musis.draw = function () {
  this.cv2d = null;
  this.cw = 1;
  this.ch = 1;
};

musis.draw.prototype.xToCanvas = function (x) {
  return 0.5*(this.cw + this.ch*x);
};
musis.draw.prototype.yToCanvas = function (y) {
  return 0.5 * this.ch * (1-y);
};
musis.draw.prototype.xFromCanvas = function (x) {
  return (x*2 - this.cw) / this.ch;
};
musis.draw.prototype.yFromCanvas = function (y) {
  return 1 - y*2/this.ch;
};
musis.draw.prototype.hToCanvas = function (h) {
  return 0.5 * this.ch * h;
};

musis.draw.prototype.frameStart = function (cv2d, cw, ch) {
  this.cv2d = cv2d;
  this.cw = cw;
  this.ch = ch;
  this.cv2d.fillStyle = "rgba(0, 0, 0, 0.2)";
  this.cv2d.shadowColor = "black";
  this.cv2d.fillRect(0, 0, this.cw, this.ch);
};

var hues = {
  C: 240,
  D: 60,
  E: 300,
  F: 120,
  G: 0,
  A: 180,
  B: 30
};

musis.draw.prototype.trigger = function (x, y, size, note, selected) {
  var s = this.hToCanvas(size);
  var hs = s/2;
  var hue = hues[note];

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
};

musis.draw.prototype.star = function (x, y, note, life) {
  var s = this.hToCanvas(0.015);
  var hs = s/2;
  var hue = hues[note];
  var l = Math.floor(70*(1-life*life)) + "%";
  this.cv2d.fillStyle = "hsl("+hue+", 100%, "+l+")";
  this.cv2d.shadowColor = "hsl("+hue+", 100%, "+l+")";
  this.cv2d.fillRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);
};
