(function () {

// Adapter for drawing stars

var vtxShader = ""
+"  attribute vec3 posIn;"
+"  uniform mat4 perspIn;"
+"  "
+"  void main() {"
+"    gl_Position = perspIn * vec4(posIn, 1);"
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


var numVtxs = 4;
var vtxPosns = new Float32Array(numVtxs*3);

vtxPosns[0] = -10;
vtxPosns[1] = -1;
vtxPosns[2] = 0;

vtxPosns[3] = -10;
vtxPosns[4] = -1;
vtxPosns[5] = -20;

vtxPosns[6] = 10;
vtxPosns[7] = -1;
vtxPosns[8] = 0;

vtxPosns[9] = 10;
vtxPosns[10] = -1;
vtxPosns[11] = -20;


var numIndices = 6;
var indexBuffer = null;
var indexes = new Uint16Array([ 0,1,2, 1,2,3 ]);


musis.draw.prototype.terrain = function () {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader, this.gl.FRAGMENT_SHADER)
    ]);
    posAttr = this.gl.getAttribLocation(program, "posIn");
    perspUnif = this.gl.getUniformLocation(program, "perspIn");
    indexBuffer = this.createIndexBuffer(indexes);
  }

  this.gl.useProgram(program);

  var perspectiveMatrix = this.perspectiveMatrix(1.7, 0.001, 100);
  this.gl.uniformMatrix4fv(perspUnif, false, perspectiveMatrix);

  this.loadVertexAttrib(posAttr, vtxPosns, 3);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawElements(this.gl.TRIANGLES, numIndices, this.gl.UNSIGNED_SHORT, 0);
};

})();