(function () {

// Domain

var trigger = function (value, motion) {
  this.value = value;
  this.motion = motion;
  this.selected = false;
  this.p = { x: 0, y: 0 };
  this.size = 0.1;
};

trigger.prototype.update = function (t) {
  this.p = this.motion(t);
};

trigger.prototype.render = function (draw) {
  draw.trigger(this.p.x, this.p.y, this.size, this.value, this.selected);
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

trigger.prototype.touch = function (sel, s, e) {
  if (this.selected) { return; }
  var p = { x: this.p.x, y: this.p.y };
  var sqrDist = sqrDistToSegment(p, s, e);
  if (sqrDist <= sqr(this.size*0.8)) {
    this.selected = true;
    sel.push(this.value);
  }
};

//////

var expanding = function (a) {
  return function (t) {
    return {
      x: Math.pow(t, 0.3)/4*Math.sin(a),
      y: Math.pow(t, 0.3)/4*Math.cos(a)
    };
  };
}

var solfege = ["la", "do", "mi", "sol", "ti", "re", "fa"];
musis.triggers = function () {
  this.t = 0;
  this.triggers = [];
  this.selected = [];
  var num = solfege.length;
  for (var i = 0; i < num; i++) {
    this.triggers[i] = new trigger(solfege[i], expanding((i-2)*6.28/num));
  }
};

musis.triggers.prototype.update = function (dt) {
  this.t += dt;
  var t = this.t;
  this.triggers.map(function(trigger) { trigger.update(t); });
};

musis.triggers.prototype.render = function (draw) {
  this.triggers.map(function(trigger) { trigger.render(draw); });
};

musis.triggers.prototype.touch = function (tx, ty) {
  var sel = this.selected;
  this.triggers.map(function(trigger) { trigger.touch(sel, tx, ty); });
};

musis.triggers.prototype.nextHarmony = function () {
  return this.selected;
};

})();