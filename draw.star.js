(function () {

// Adapter for drawing stars

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
+"    vec2 texFull = tex*2.0 - 1.0;" // tex coords in range -1 to 1
+"    float d = length(texFull);" // distance field value at this fragment
+"    float b = 1.0 - smoothstep(0.3, 1.0, d);" // brightness at this fragment
+"    gl_FragColor = col * vec4(b,b,b, 1);" // modulate color with the brightness
+"  }";

musis.draw.prototype.star = function (x, y, note, life) {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  var vtxData = this.squareVtxs(x, y, 0.015);
  this.loadVertexAttrib(program, vtxData.vtx, "pos", 2);
  this.loadVertexAttrib(program, vtxData.tex, "texIn", 2);

  var col = this.colours[note];
  var a = 1 - life*life + 0.2*Math.sin(life*(1+x*y)*100);
  var colAttr = this.gl.getUniformLocation(program, "col");
  this.gl.uniform4f(colAttr, col[0]*a, col[1]*a, col[2]*a, 1);

  this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE, this.gl.ZERO, this.gl.ONE);
  this.gl.enable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};

})();