(function () {

// This is the glue code

musis = {}

var stars;
var metronome;
var triggers;
var music;
var terrain;
var game;

musis.begin = function () {
  draw = new musis.draw();
  play = new musis.play();
  stars = new musis.stars();
  metronome = new musis.metronome();
  music = new musis.music();
  terrain = new musis.terrain();
  game = musis.tutorial.diatonic;
  game.begin(draw);
  triggers = createSolfegeTriggers(draw);
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
  var enabled = game.solfegeTriggers();
  var info = [
    [ null,                            { value: 'do', size: 'large', disabled: true },  null,                             ],
    [ { value: 'me', disabled: true }, { value: 'mi', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 'sol', size: 'large', disabled: true }, null,                             ],
    [ { value: 'te', disabled: true }, { value: 'ti', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 're', size: 'small', disabled: true },  null,                             ],
    [ null,                            { value: 'fa', size: 'large', disabled: true },  { value: 'fi', disabled: true },  ],
    [ { value: 'le', disabled: true }, { value: 'la', size: 'small', disabled: true },  null,                             ]
  ].map(function (a) {
    return a.map(function (t) {
      if (t && enabled.indexOf(t.value) >= 0) { t.disabled = false; }
      return t;
    });
  });
  return new musis.triggers(info, "solfege");
};

var toNextHarmony = function (nextHarmony) {
  var analysis = music.nextHarmony(nextHarmony);
console.log(analysis);
  terrain.nextHarmony(analysis);
  if (game.nextHarmony(draw, analysis)) { stars.bigBurst(); }
  triggers = createSolfegeTriggers(draw);
};

})();
