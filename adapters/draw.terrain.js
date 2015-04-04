(function () {

// Adapter for drawing stars

var vtxShader = ""
+"  uniform float timeIn;"
+"  uniform float bpsIn;"
+"  uniform mat4 perspIn;"
+"  "
+"  attribute vec3 posIn;"
+"  "
+"  void main() {"
+"    float repeatSize = 4.0;"
+"    float speed = repeatSize * bpsIn;"
+"    float delta = mod(timeIn/1000.0 * speed, repeatSize);"
+"    gl_Position = perspIn * vec4(posIn.x, posIn.y, posIn.z + delta, 1);"
+"  }";

var frgShader = ""
+"  precision mediump float;"
+"  "
+"  void main() {"
+"    gl_FragColor = vec4(0.2, 0.4, 0.6, 1);"
+"  }";

var program = null;
var posAttr = null;
var perspUnif = null;
var timeUnif = null;
var bpsUnif = null;


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
    indexes[i+3] = v;
    indexes[i+4] = v+1;
    indexes[i+5] = v+vtxResX+1;
  }
}


musis.draw.prototype.terrain = function (bpm) {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader, this.gl.FRAGMENT_SHADER)
    ]);
    posAttr = this.gl.getAttribLocation(program, "posIn");
    perspUnif = this.gl.getUniformLocation(program, "perspIn");
    timeUnif = this.gl.getUniformLocation(program, "timeIn");
    bpsUnif = this.gl.getUniformLocation(program, "bpsIn");
    indexBuffer = this.createIndexBuffer(indexes);
  }

  this.gl.useProgram(program);

  this.gl.uniform1f(timeUnif, this.time);
  this.gl.uniform1f(bpsUnif, bpm/60);

  var perspectiveMatrix = this.perspectiveMatrix(1.7, 0.001, 100);
  this.gl.uniformMatrix4fv(perspUnif, false, perspectiveMatrix);

  this.loadVertexAttrib(posAttr, vtxPosns, 3);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawElements(this.gl.TRIANGLES, numIndices, this.gl.UNSIGNED_SHORT, 0);
};

})();