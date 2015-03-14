(function () {

// This is the glue code

musis = {}

var stars;
var metronome;
var triggers;

musis.begin = function () {
  draw = new musis.draw();
  play = new musis.play();
  stars = new musis.stars();
  metronome = new musis.metronome();
  triggers = new musis.triggers();
};

var s = null;
musis.touchstart = function (x, y) {
  s = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
  triggers.touch(s, s);
};

musis.touchmove = function (x, y) {
  var e = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
  triggers.touch(s, e);
  s = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
};

musis.touchend = function () {
  if (triggers.anySelected()) {
    triggers.play(play, stars, metronome);
    triggers = new musis.triggers();
  }
  s = null;
};

musis.frame = function (dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }
  metronome.update(play);
  stars.update(dt);
  triggers.update(dt);

  draw.frameStart(gl, cw, ch);
  stars.render(draw);
  triggers.render(draw);
};

})();