musis.triggers = function () {
  this.t = 0;
  this.selected = false;
  this.rx = 0;
  this.ry = 0;
  this.rs = 0.04;
};

musis.triggers.prototype.update = function (dt) {
  this.t += dt/1000;
  this.rx = Math.sin(this.t*(1 + this.t/100));
  this.ry = Math.cos(this.t*2);
};

musis.triggers.prototype.render = function (ctx) {
  ctx.cv2d.shadowOffsetX = 0;
  ctx.cv2d.shadowOffsetY = 0;
  ctx.cv2d.shadowBlur = 10;
  ctx.cv2d.lineWidth = 3;

  ctx.cv2d.fillStyle = "hsl(120, 100%, 45%)";
  ctx.cv2d.shadowColor = "hsl(120, 100%, 55%)";
  ctx.cv2d.fillRect(ctx.xcoord(this.rx), ctx.ycoord(this.ry), ctx.hcoord(this.rs), ctx.hcoord(this.rs));
  if (this.selected) {
    ctx.cv2d.shadowColor = "white";
    ctx.cv2d.strokeStyle = "white";
  } else {
    ctx.cv2d.strokeStyle = "hsl(120, 100%, 55%)";
  }
  ctx.cv2d.strokeRect(ctx.xcoord(this.rx), ctx.ycoord(this.ry), ctx.hcoord(this.rs), ctx.hcoord(this.rs));
};

musis.triggers.prototype.touch = function (tx, ty) {
  if (tx >= this.rx && tx <= this.rx+this.rs && ty >= this.ry && ty <= this.ry+this.rs) {
    this.selected = true;
  }
};

