(function () {
var program = null;

var vtxShader2d = ""
+"  attribute vec2 pos;"
+"  attribute vec2 texIn;"
+"  "
+"  varying vec2 tex;"
+"  "
+"  void main() {"
+"    gl_Position = vec4(pos, 0, 1);"
+"    tex = texIn;"
+"  }";

var frgShader2d = ""
+"  precision mediump float;"
+"  uniform vec4 col;"
+"  "
+"  varying vec2 tex;"
+"  "
+"  void main() {"
+"    vec2 texWide = tex*2.0 - 1.0;"
+"    float r = 1.0 - smoothstep(0.7, 1.0, length(max(abs(texWide)-0.2, 0.0)));"
+"    gl_FragColor = col*vec4(r,r,r, 1);"
+"  }";

// Todo: glow, selection and trail, and rounded corners?

musis.draw.prototype.trigger = function (x, y, size, note, selected) {
  if (!program) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  var vtxData = this.squareVtxs(x, y, size);
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vtxData.vtx, this.gl.STATIC_DRAW);
  var posAttr = this.gl.getAttribLocation(program, "pos");
  this.gl.enableVertexAttribArray(posAttr);
  this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vtxData.tex, this.gl.STATIC_DRAW);
  var texAttr = this.gl.getAttribLocation(program, "texIn");
  this.gl.enableVertexAttribArray(texAttr);
  this.gl.vertexAttribPointer(texAttr, 2, this.gl.FLOAT, false, 0, 0);

  var col = this.colours[note];
  var colAttr = this.gl.getUniformLocation(program, "col");
  this.gl.uniform4f(colAttr, col[0], col[1], col[2], 1);

  var selAttr = this.gl.getUniformLocation(program, "selected");
  this.gl.uniform1i(selAttr, selected);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};

})();