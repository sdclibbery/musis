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

var sqr = function(x) { return x * x };
var dist2 = function(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) };
var sqrDistToSegment = function(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t*(w.x - v.x), y: v.y + t*(w.y - v.y) });
};

trigger.prototype.touch = function (s, e) {
  var p = { x: this.rx, y: this.ry };
  var sqrDist = sqrDistToSegment(p, s, e);
  if (sqrDist <= sqr(this.size*0.7)) {
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

