(function () {

// Domain

var numStarInBurst = 50;
var numStarInBigBurst = 500;

musis.stars = function () {
  this.bursts = [];
};

musis.stars.prototype.render = function (draw) {
  this.bursts.map(function (burst) {
    var x = Math.random()*1.8-0.9;
    var y = burst.absChromatic()/70 - 0.3;//Math.random()*0.5;
    var size = 0.1+Math.random()*0.3;
    for (var i = 0; i < numStarInBurst; i++) {
      var speed = size*Math.pow(Math.random(), 0.25);
      var theta = Math.random()*6.28;
      draw.addStar({
        solfege: burst.solfege,
        x: x,
        y: y,
        vx: speed*Math.cos(theta),
        vy: 0.2 + speed*Math.sin(theta),
        vl: 1.4+0.3*Math.random()
      });
    }
  });
  this.bursts = [];
  if (this.doBigBurst) {
    this.doBigBurst = undefined;
    for (var i = 0; i < numStarInBigBurst; i++) {
      draw.addStar({
        solfege: 'none',
        x: Math.random()*2-1,
        y: -0.1,
        vx: 0,
        vy: Math.random(),
        vl: 1.7+0.3*Math.random()
      });
    }
  }
  draw.stars();
};

musis.stars.prototype.burst = function (note) {
  this.bursts.push(note);
};

musis.stars.prototype.bigBurst = function () {
  this.doBigBurst = true;
};

})();
