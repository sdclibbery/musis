musis = {}

var ctx = {}
var triggers;

musis.begin = function () {
  ctx.draw = new musis.draw();
  ctx.play = new musis.play();
  triggers = new musis.triggers();
};

var s = null;
musis.touchstart = function (x, y) {
  s = { x: ctx.draw.xFromCanvas(x), y: ctx.draw.yFromCanvas(y) };
  triggers.touch(s, s);
};

musis.touchmove = function (x, y) {
  var e = { x: ctx.draw.xFromCanvas(x), y: ctx.draw.yFromCanvas(y) };
  triggers.touch(s, e);
  s = { x: ctx.draw.xFromCanvas(x), y: ctx.draw.yFromCanvas(y) };
};

musis.touchend = function () {
  triggers.play(ctx);
};

musis.frame = function (dt, cv2d, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }
  triggers.update(dt);

  ctx.draw.frameStart(cv2d, cw, ch);
  triggers.render(ctx);
};
