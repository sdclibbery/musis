(function () {

// This is the glue code

musis = {}

var stars;
var metronome;
var triggers;
var music;
var terrain;

musis.begin = function () {
  draw = new musis.draw();
  play = new musis.play();
  stars = new musis.stars();
  metronome = new musis.metronome();
  triggers = createSolfegeTriggers(draw);
  music = new musis.music();
  terrain = new musis.terrain();
  musis.game.begin();
};

var s = null;
musis.touchstart = function (x, y) {
  s = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
  triggers.touch(s, s);
};

musis.touchmove = function (x, y) {
  var e = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
  if (s === null) { s = e; }
  triggers.touch(s, e);
  s = { x: draw.xFromCanvas(x), y: draw.yFromCanvas(y) };
};

musis.touchend = function () {
  var nextHarmony = triggers.nextHarmony();
  if (nextHarmony.length > 0) {
    toNextHarmony(nextHarmony);
  }
  s = null;
};

musis.frame = function (t, dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }

  if (dt > 0.1) { console.log("Long frame: "+dt); }

  metronome.update(play.timeNow(), function (beat) {
    music.beat(beat, function (events, notes) {
      musis.perform.beat(play, stars, events);
    });
  });
  triggers.update(dt);

  draw.frameStart(t, gl, cw, ch);
  terrain.render(draw, metronome);
  stars.render(draw);
  triggers.render(draw);
};

var createSolfegeTriggers = function (draw) {
  return new musis.triggers(musis.game.solfegeTriggers(), "solfege");
};

var toNextHarmony = function (nextHarmony) {
  var analysis = music.nextHarmony(nextHarmony);
console.log(analysis);
  terrain.nextHarmony(analysis);
  triggers = createSolfegeTriggers(draw);
  if (musis.game.nextHarmony(analysis)) {
    stars.bigBurst();
  }
};

})();
