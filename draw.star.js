(function () {

// Adapter for drawing stars

/*
star.prototype.update = function (dt) {
  this.x += this.vx*dt;
  this.y += this.vy*dt;
  this.vy -= 0.1 * dt;
  this.vx *= 1 - dt;
  this.vy *= 1 - dt;
  this.l += this.vl*dt;
  return this.l < 1;
};
*/

var vtxShader2d = ""
+"  attribute vec2 posIn;"
+"  attribute vec3 colIn;"
+"  "
+"  varying vec4 col;"
+"  "
+"  void main() {"
+"    gl_Position = vec4(posIn, 0, 1);"
+"    gl_PointSize = 60.0;"
+"    col = vec4(colIn, 1);"
+"  }";

var frgShader2d = ""
+"  precision mediump float;"
+"  "
+"  varying vec4 col;"
+"  "
+"  void main() {"
+"    vec2 texFull = gl_PointCoord*2.0 - 1.0;" // tex coords in range -1 to 1
+"    float d = length(texFull);" // distance field value at this fragment
+"    float b = 1.0 - smoothstep(0.3, 1.0, d);" // brightness at this fragment
+"    gl_FragColor = col * vec4(b,b,b, 1);" // modulate color with the brightness
+"  }";

var program = null;
var numVtxs = 100;
var vtxPosns = new Float32Array(numVtxs*2);
var vtxCols = new Float32Array(numVtxs*3);
var lastVtxIdx = 0;

musis.draw.prototype.addStar = function (star) {
  var col = this.colours[star.pitchClass];
  vtxPosns[lastVtxIdx*2+0] = star.x;
  vtxPosns[lastVtxIdx*2+1] = star.y;
  vtxCols[lastVtxIdx*3+0] = col[0];
  vtxCols[lastVtxIdx*3+1] = col[1];
  vtxCols[lastVtxIdx*3+2] = col[2];
  lastVtxIdx++;
  lastVtxIdx = lastVtxIdx % numVtxs;
};

musis.draw.prototype.stars = function () {
  if (vtxPosns === null) { return; }

  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  this.loadVertexAttrib(program, vtxPosns, "posIn", 2);
  this.loadVertexAttrib(program, vtxCols, "colIn", 3);

  this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE, this.gl.ZERO, this.gl.ONE);
  this.gl.enable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.POINTS, 0, numVtxs);
};

})();