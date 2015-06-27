(function () {

// Domain

var trigger = function (value, motion, acc) {
  this.value = value;
  this.motion = motion;
  this.selected = false;
  this.p = { x: 0, y: 0 };
  this.accidental = acc;
  this.size = 0.13;
};

trigger.prototype.update = function (t) {
  this.p = this.motion(t);
};

trigger.prototype.render = function (draw, type) {
  var state = this.selected ? 'selected' : 'none'
  draw.trigger(this.p.x, this.p.y, this.size, this.value, type, state, this.accidental);
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

var static = function (x, y) {
  return function (t) {
    return {
      x: x,
      y: y
    };
  };
}

musis.triggers = function (infos, type) {
  this.t = 0;
  this.triggers = [];
  this.selected = [];
  this.type = type;
  var num = infos.length;
  var self = this;
  for (var y=0; y<=5; y++) {
    for (var x=-5; x<=5; x++) {
      var i = infos[Math.floor(Math.random()*infos.length)];
      var motion = static(x/7, y/7);
      self.triggers.push( new trigger(i.value, motion, i.acc) );
    }
  }
};

musis.triggers.prototype.update = function (dt) {
  this.t += dt;
  var t = this.t;
  this.triggers.map(function(trigger) { trigger.update(t); });
};

musis.triggers.prototype.render = function (draw) {
  var self = this;
  this.triggers.map(function(trigger) { trigger.render(draw, self.type); });
};

musis.triggers.prototype.touch = function (tx, ty) {
  var sel = this.selected;
  this.triggers.map(function(trigger) { trigger.touch(sel, tx, ty); });
};

musis.triggers.prototype.nextHarmony = function () {
  return this.selected;
};

})();
