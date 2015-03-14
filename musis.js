(function () {

// This is the glue code

musis = {}

var ctx = {}
var triggers;
var metronome;

musis.begin = function () {
  ctx.draw = new musis.draw();
  ctx.play = new musis.play();
  ctx.stars = new musis.stars();
  ctx.metronome = new musis.metronome();
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
  if (triggers.anySelected()) {
    triggers.play(ctx);
    triggers = new musis.triggers();
  }
  s = null;
};

musis.frame = function (dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }
  ctx.metronome.update(dt, ctx);
  ctx.stars.update(dt);
  triggers.update(dt);

  ctx.draw.frameStart(gl, cw, ch);
  ctx.stars.render(ctx);
  triggers.render(ctx);
};

})();