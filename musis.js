musis = {}

var t = 0;

musis.frame = function (dt, ctx2d, w, h) {

ctx2d.shadowOffsetX = 0;
ctx2d.shadowOffsetY = 0;
ctx2d.shadowBlur = 10;

  ctx2d.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx2d.shadowColor = "black";
  ctx2d.fillRect(0, 0, w, h);

  ctx2d.fillStyle = "green";
  ctx2d.shadowColor = "#00ff00";
  ctx2d.fillRect(100+100*Math.sin(t*3), 100+100*Math.cos(t*2), 10, 10);
  t = t+dt/1000;
}