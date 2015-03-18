(function () {

// Domain

var numStarInBurst = 10;

musis.stars = function () {
  this.bursts = [];
};

musis.stars.prototype.render = function (draw) {
  this.bursts.map(function (burst) {
    for (var i = 0; i < numStarInBurst; i++) {
      var speed = 0.1+Math.random()*0.2;
      var theta = Math.random()*6.28;
      draw.addStar({
        pitchClass: burst,
        x: Math.random()*1.8-0.9,
        y: Math.random()*1.3-0.4,
        vx: speed*Math.cos(theta),
        vy: 0.2 + speed*Math.sin(theta),
        vl: 1.4+0.3*Math.random()
      });
    }
  });
  this.bursts = [];
  draw.stars();
};

musis.stars.prototype.burst = function (pitchClass) {
  this.bursts.push(pitchClass);
};

})();