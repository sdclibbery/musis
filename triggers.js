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
var sqrDist = function(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) };
var sqrDistToSegment = function(p, v, w) {
  var l2 = sqrDist(v, w);
  if (l2 == 0) return sqrDist(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return sqrDist(p, v);
  if (t > 1) return sqrDist(p, w);
  return sqrDist(p, { x: v.x + t*(w.x - v.x), y: v.y + t*(w.y - v.y) });
};
var isNeighbouringLocation = function (l, r, size) {
  return sqrDist(l, r) <= sqr(size*1.1);
};
var isNeighbouringThird = function (l, r) {
  // NEEDS DOING PROPERLY in the music domain. Must handle non diatonic too; eg 'me' etc
  var nextThird = { do: 'mi', mi: 'sol', sol: 'ti', ti: 're', re: 'fa', fa: 'la', la: 'do' };
  return nextThird[l] === r || nextThird[r] === l;
};
trigger.prototype.touch = function (sel, s, e) {
  if (this.selected) { return; }
  var self = this;
  var last = sel[sel.length-1];
  if (sel.length > 0 && !isNeighbouringThird(this.value, last.value)) { return; }
  if (sel.length > 0 && !isNeighbouringLocation(self.p, last.p, self.size)) { return; }
  if (sel.some(function (t) { return self.value === t.value;})) { return; }
  var p = { x: this.p.x, y: this.p.y };
  var sqrDist = sqrDistToSegment(p, s, e);
  if (sqrDist <= sqr(this.size*0.8)) {
    this.selected = true;
    sel.push(this);
  }
};

//////

var dropIn = function (x, y) {
  return function (t) {
    return {
      x: x,
      y: y + Math.max(1+y+x/5-t*2, 0)
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
      var motion = dropIn(x/7, y/7);
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
  return this.selected.map(function (t) {
    return t.value;
  });
};

})();
