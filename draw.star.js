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
+"  "
+"  void main() {"
+"    gl_FragColor = col;"
+"  }";

// Todo: shape, sparkle, glow, trail

musis.draw.prototype.star = function (x, y, note, life) {
  if (!program) {
    program = this.loadProgram(this.gl, [
      this.loadShader(this.gl, vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(this.gl, frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  var vtxs = this.squareVtxs(x, y, 0.015);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vtxs, this.gl.STATIC_DRAW);

  var posAttr = this.gl.getAttribLocation(program, "pos");
  this.gl.enableVertexAttribArray(posAttr);
  this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

  var col = this.colours[note];
  var a = 1 - life*life + 0.2*Math.sin(life*(1+x*y)*100);
  var colAttr = this.gl.getUniformLocation(program, "col");
  this.gl.uniform4f(colAttr, col[0]*a, col[1]*a, col[2]*a, 1);

  this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE, this.gl.ZERO, this.gl.ONE);
  this.gl.enable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};
