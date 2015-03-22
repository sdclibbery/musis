(function () {

// This is the glue code

musis = {}

var stars;
var metronome;
var triggers;
var music;

musis.begin = function () {
  draw = new musis.draw();
  play = new musis.play();
  stars = new musis.stars();
  metronome = new musis.metronome();
  triggers = new musis.triggers();
  music = new musis.music();
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
  var nextHarmony = triggers.nextHarmony();
  if (nextHarmony.length > 0) {
    music.nextHarmony(nextHarmony);
    triggers = new musis.triggers();
  }
  s = null;
};

musis.frame = function (t, dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }

  if (dt > 0.1) { console.log("Long frame: "+dt); }
  
  metronome.update(play);
  music.update(metronome, play, stars);
  triggers.update(dt);

  draw.frameStart(t, gl, cw, ch);
  stars.render(draw);
  triggers.render(draw);
};

})();