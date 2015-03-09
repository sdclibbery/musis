var trigger = function (hue) {
  this.hue = hue;
  this.t = hue/10;
  this.selected = false;
  this.rx = 0;
  this.ry = 0;
  this.rs = 0.04;
};

trigger.prototype.update = function (dt) {
  this.t += dt/1000;
  this.rx = 0.3*Math.sin(this.t*(1 + this.t/100));
  this.ry = 0.3*Math.cos(this.t*2);
};

trigger.prototype.render = function (ctx) {
  ctx.draw.cv2d.shadowOffsetX = 0;
  ctx.draw.cv2d.shadowOffsetY = 0;
  ctx.draw.cv2d.shadowBlur = 10;
  ctx.draw.cv2d.lineWidth = 3;

  ctx.draw.cv2d.fillStyle = "hsl("+this.hue+", 100%, 45%)";
  ctx.draw.cv2d.shadowColor = "hsl("+this.hue+", 100%, 55%)";
  ctx.draw.cv2d.fillRect(ctx.draw.xcoord(this.rx), ctx.draw.ycoord(this.ry), ctx.draw.hcoord(this.rs), ctx.draw.hcoord(this.rs));
  if (this.selected) {
    ctx.draw.cv2d.shadowColor = "white";
    ctx.draw.cv2d.strokeStyle = "white";
  } else {
    ctx.draw.cv2d.strokeStyle = "hsl("+this.hue+", 100%, 55%)";
  }
  ctx.draw.cv2d.strokeRect(ctx.draw.xcoord(this.rx), ctx.draw.ycoord(this.ry), ctx.draw.hcoord(this.rs), ctx.draw.hcoord(this.rs));
};

trigger.prototype.touch = function (tx, ty) {
  if (tx >= this.rx && tx <= this.rx+this.rs && ty >= this.ry && ty <= this.ry+this.rs) {
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

