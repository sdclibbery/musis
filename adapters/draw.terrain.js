(function () {

// Adapter for drawing terrain

var vtxShader = ""
+"  uniform float timeIn;"
+"  uniform float bpsIn;"
+"  uniform float tensionIn;"
+"  uniform bool triadIn;"
+"  uniform mat4 perspIn;"
+"  uniform vec3 colsIn[4];"
+"  "
+"  attribute vec3 posIn;"
+"  "
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    float repeatSize = 4.0;" // size of one square in the terrain grid
+"    float speed = repeatSize * bpsIn;" // speed of terrain motion in metres per second
+"    float distance = timeIn * speed;" // current distance the grid origin should have reached
+"    float delta = mod(distance, repeatSize);" // amount to move the drawn grid so it lines up with where the grid should be
+"    float index = distance-posIn.z-delta;" // value to use that moves with the grid without snapping back on the repeat
+"    float spike = tensionIn/2.0*max(pow(sin(sin(posIn.x)*distance*tensionIn/6.0 + 0.18*cos(posIn.z*0.5)), 20.0*(7.0-tensionIn)), 0.0);"
+"    float wave = 0.5*(sin(posIn.x*(0.1+tensionIn*0.04))+sin(index*(0.1+tensionIn*0.03)));"
+"    gl_Position = perspIn * vec4(posIn.x, posIn.y+wave*3.0+spike, posIn.z + delta, 1);" // apply the delta to give the sense of motion
+"    float b = index/10.0 + abs(posIn.x)*100.0;" // value to use to look up the colour
+"    colour = colsIn[ int(mod(b + spike, 2.0)) ] * 0.7 + vec3(spike, spike, spike) * 0.2;"
//+"    colour = colour*pow(min(max(abs(wave), 0.0), 1.0), triadIn?1.0:5.0);"
+"    colour = colour*(triadIn?1.0:0.6)*(0.3 + pow(abs(wave), triadIn?1.5:3.0));"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  "
+"  varying vec3 colour;"
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(colour, 1);"
+"  }";

var resX = 50;
var resY = 50;
var vtxResX = resX+1;
var vtxResY = resY+1;
var size = 200;

var numVtxs = vtxResX*vtxResY;
var vtxPosns = new Float32Array(numVtxs*3);
for (var y = 0; y < vtxResY; y++) {
  for (var x = 0; x < vtxResX; x++) {
    var v = (x + y*vtxResX) * 3;
    vtxPosns[v+0] = (x - vtxResX/2)*size/vtxResX;
    vtxPosns[v+1] = -10;
    vtxPosns[v+2] = -y*size/vtxResY;
  }
}


var numIndices = resX*resY*6;
var indexBuffer = null;
var indexes = new Uint16Array(numIndices);
for (var y = 0; y < resY; y++) {
  for (var x = 0; x < resX; x++) {
    var i = (x + y*resX) * 6;
    var v = x + y*vtxResX;
    indexes[i+0] = v;
    indexes[i+1] = v+vtxResX;
    indexes[i+2] = v+1;
    indexes[i+3] = v+vtxResX;
    indexes[i+4] = v+1;
    indexes[i+5] = v+vtxResX+1;
  }
}


var program = null;
var posAttr = null;
var posBuf = null;
var perspUnif = null;
var timeUnif = null;
var bpsUnif = null;
var tensionUnif = null;
var triadUnif = null;
var colsUnif = null;
var tensionUnif = null;


musis.draw.prototype.terrain = function (bpm, tension, root, func, triad) {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader, this.gl.FRAGMENT_SHADER)
    ]);
    posBuf = this.gl.createBuffer();
    posAttr = this.gl.getAttribLocation(program, "posIn");
    perspUnif = this.gl.getUniformLocation(program, "perspIn");
    timeUnif = this.gl.getUniformLocation(program, "timeIn");
    bpsUnif = this.gl.getUniformLocation(program, "bpsIn");
    tensionUnif = this.gl.getUniformLocation(program, "tensionIn");
    triadUnif = this.gl.getUniformLocation(program, "triadIn");
    colsUnif = this.gl.getUniformLocation(program, "colsIn");
    indexBuffer = this.createIndexBuffer(indexes);
  }

  this.gl.useProgram(program);

  this.gl.uniform1f(timeUnif, this.time/1000);
  this.gl.uniform1f(tensionUnif, tension);
  this.gl.uniform1f(triadUnif, !!triad);
  this.gl.uniform1f(bpsUnif, bpm/60);

  var cols = [];
  var funcCol = this.colours.solfege[{tonic:'do', subdominant:'fa', dominant:'sol'}[func] || 'none'];
  cols.push(funcCol[0], funcCol[1], funcCol[2]);
  var rootCol = this.colours.solfege[root || 'none'];
  cols.push(rootCol[0], rootCol[1], rootCol[2]);
  this.gl.uniform3fv(colsUnif, new Float32Array(cols));

  var perspectiveMatrix = this.perspectiveMatrix(1.7, 0.001, 100);
  this.gl.uniformMatrix4fv(perspUnif, false, perspectiveMatrix);

  this.loadVertexAttrib(posBuf, posAttr, vtxPosns, 3);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawElements(this.gl.TRIANGLES, numIndices, this.gl.UNSIGNED_SHORT, 0);
};

})();
