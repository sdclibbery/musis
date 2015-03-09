var trigger = function (hue) {
  this.hue = hue;
  this.t = hue/10;
  this.selected = false;
  this.rx = 0;
  this.ry = 0;
  this.size = 0.08;
};

trigger.prototype.update = function (dt) {
  this.t += dt/1000;
  this.rx = 0.3*Math.sin(this.t*(1 + this.t/100));
  this.ry = 0.3*Math.cos(this.t*2);
};

trigger.prototype.render = function (ctx) {
  ctx.draw.trigger(this.rx, this.ry, this.size, this.hue, this.selected);
};

trigger.prototype.touch = function (tx, ty) {
  var hs = this.size / 2;
  if (tx >= this.rx-hs && tx <= this.rx+hs && ty >= this.ry-hs && ty <= this.ry+hs) {
    this.selected = true;
  }
};


musis.triggers = function () {
  this.triggers = [
    new trigger(0),
    new trigger(30),
    new trigger(60),
    new trigger(120),
    new trigger(180),
    new trigger(200),
    new trigger(240),
    new trigger(300)
  ];
};

musis.triggers.prototype.update = function (dt) {
  this.triggers.map(function(t) { t.update(dt); });
};

musis.triggers.prototype.render = function (ctx) {
  this.triggers.map(function(t) { t.render(ctx); });
};

musis.triggers.prototype.touch = function (tx, ty) {
  this.triggers.map(function(t) { t.touch(tx, ty); });
};

