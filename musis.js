(function () {

// This is the glue code

musis = {}

var stars;
var metronome;
var triggers;
var voicing;

musis.begin = function () {
  draw = new musis.draw();
  play = new musis.play();
  stars = new musis.stars();
  metronome = new musis.metronome();
  triggers = new musis.triggers();
  voicing = new musis.voicing();
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
    var nextHarmony = triggers.activate();
    triggers = new musis.triggers();
    nextHarmony.map(function (pitchClass) {
      voicing.add(pitchClass);
    });
  }
  s = null;
};

musis.frame = function (t, dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }

  if (dt > 0.1) { console.log("Long frame: "+dt); }
  
  metronome.update(play);
  voicing.update(metronome, play, stars);
  triggers.update(dt);

  draw.frameStart(t, gl, cw, ch);
  stars.render(draw);
  triggers.render(draw);
};

})();