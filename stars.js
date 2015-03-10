var star = function (x, y, note) {
  this.x = x;
  this.y = y;
  this.l = 0;
  var speed = 0.1+Math.random()*0.2;
  var theta = Math.random()*6.28;
  this.vx = speed*Math.cos(theta);
  this.vy = 0.2 + speed*Math.sin(theta);
  this.vl = 0.5+0.3*Math.random();
  this.note = note;
};

star.prototype.update = function (dt) {
  this.x += this.vx*dt;
  this.y += this.vy*dt;
  this.vy -= 0.1 * dt;
  this.vx *= 1 - dt;
  this.vy *= 1 - dt;
  this.l += this.vl*dt;
  return this.l < 1;
};

star.prototype.render = function (ctx) {
  ctx.draw.star(this.x, this.y, this.note, this.l);
};

//////

musis.stars = function () {
  this.stars = [];
};

musis.stars.prototype.update = function (dt) {
  var nextStars = [];
  this.stars.map(function (star) {
    if (star.update(dt)) {
      nextStars.push(star);
    }
  });
  this.stars = nextStars;
};

musis.stars.prototype.render = function (ctx) {
  this.stars.map(function (star) { star.render(ctx); } );
};

musis.stars.prototype.burst = function (x, y, note) {
  for (var i=0; i < 10; i++) {
    this.stars.push(new star(x, y, note));
  }
};
