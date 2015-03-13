var program = null;

var vtxShader2d = ""
+"  attribute vec2 pos;"
+"  "
+"  void main() {"
+"    gl_Position = vec4(pos, 0, 1);"
+"  }";

var frgShader2d = ""
+"  precision mediump float;"
+"  uniform vec4 col;"
+"  uniform bool selected;"
+"  "
+"  void main() {"
+"    gl_FragColor = selected ? vec4(1,1,1,1) : col;"
+"  }";

// Todo: glow, selection and trail, and rounded corners?

musis.draw.prototype.trigger = function (x, y, size, note, selected) {
  if (!program) {
    program = this.loadProgram(this.gl, [
      this.loadShader(this.gl, vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(this.gl, frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  var vtxs = this.squareVtxs(x, y, size);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vtxs, this.gl.STATIC_DRAW);

  var posAttr = this.gl.getAttribLocation(program, "pos");
  this.gl.enableVertexAttribArray(posAttr);
  this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

  var col = this.colours[note];
  var colAttr = this.gl.getUniformLocation(program, "col");
  this.gl.uniform4f(colAttr, col[0], col[1], col[2], 1);

  var selAttr = this.gl.getUniformLocation(program, "selected");
  this.gl.uniform1i(selAttr, selected);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};
