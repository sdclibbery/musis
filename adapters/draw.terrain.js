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
var numVtxs = 3;
var vtxPosns = new Float32Array(numVtxs*3);
var posAttr = null;
var perspUnif = null;

musis.draw.prototype.terrain = function () {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader, this.gl.FRAGMENT_SHADER)
    ]);
    posAttr = this.gl.getAttribLocation(program, "posIn");
    perspUnif = this.gl.getUniformLocation(program, "perspIn");
  }

  this.gl.useProgram(program);

  var perspectiveMatrix = this.perspectiveMatrix(3.14/2, 0.001, 100);
  this.gl.uniformMatrix4fv(this.perspUnif, false, perspectiveMatrix);

  vtxPosns[0] = -10;
  vtxPosns[1] = -10;
  vtxPosns[2] = 0;

  vtxPosns[3] = -10;
  vtxPosns[4] = -10;
  vtxPosns[5] = -20;

  vtxPosns[6] = 10;
  vtxPosns[7] = -10;
  vtxPosns[8] = -20;

  this.loadVertexAttrib(posAttr, vtxPosns, 3);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, numVtxs);
};

})();