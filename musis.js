(function () {

// This is the glue code

musis = {}

var metronome;
var triggers;
var music;
var game;

musis.begin = function () {
  draw = new musis.draw();
  musis.ui.draw = draw;
  play = new musis.play();
  metronome = new musis.metronome();
  music = new musis.music();
  this.changeGame(musis.freeplay);
};

musis.changeGame = function (next) {
  musis.ui.menu.clear();
  musis.ui.title('');
  musis.ui.hint('');
  game = next;
  game.begin();
  triggers = createSolfegeTriggers();
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
  s = null;
  var nextHarmony = triggers.nextHarmony();
  if (!nextHarmony) { return; }
  if (nextHarmony.length > 0) {
    toNextHarmony(nextHarmony);
  }
};

musis.frame = function (t, dt, gl, cw, ch) {
  if (s) {
    triggers.touch(s, s);
  }

  if (dt > 0.1) { console.log("Long frame: "+dt); }

  metronome.update(play.timeNow(), function (beat) {
    music.beat(beat, function (events, notes) {
      musis.perform.beat(play, events);
    });
  });
  triggers.update(dt);

  draw.frameStart(t, gl, cw, ch);
  triggers.render(draw);
};

var createSolfegeTriggers = function () {
  if (!game.solfegeTriggers) { return new musis.triggers([]); }
  var enabled = game.solfegeTriggers();
  var info = [                    { value: 'do', acc: 'nat' },
    { value: 'me', acc: 'flat' }, { value: 'mi', acc: 'nat' },
                                  { value: 'sol', acc: 'nat' },
    { value: 'te', acc: 'flat' }, { value: 'ti', acc: 'nat' },
                                  { value: 're', acc: 'nat' },
                                  { value: 'fa', acc: 'nat' },  { value: 'fi', acc: 'sharp' },
    { value: 'le', acc: 'flat' }, { value: 'la', acc: 'nat' }
  ].filter(function (t) {
    return enabled.indexOf(t.value) >= 0;
  });
  return new musis.triggers(info, "solfege");
};

var toNextHarmony = function (nextHarmony) {
  var analysis = music.nextHarmony(nextHarmony);
  triggers = createSolfegeTriggers();
};

})();
