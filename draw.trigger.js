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
+"  uniform bool selected;"
+"  "
+"  varying vec2 tex;"
+"  "
+"  void main() {"
+"    vec2 texFull = tex*2.0 - 1.0;" // tex coords in range -1 to 1
+"    float d = 1.0 - length(max(abs(texFull)-0.2, 0.0));" // distance field value at this fragment
+"    if (d < 0.35) {"
+"      float b = smoothstep(0.1, 0.3, d);" // border brightness
+"      gl_FragColor = (selected ? vec4(1,1,1,1) : col) * vec4(b,b,b,1);" // border color: white if trigger is selected
+"    } else {"
+"      float b = 0.5 + 0.5*smoothstep(0.5, 0.35, d);" // interior brightness
+"      gl_FragColor = col * vec4(b,b,b,1);" // interior color
+"    }"
+"  }";

musis.draw.prototype.trigger = function (x, y, size, note, selected) {
  if (!program) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
  }

  this.gl.useProgram(program);

  var vtxData = this.squareVtxs(x, y, size);
  this.loadVertexAttrib(program, vtxData.vtx, "pos", 2);
  this.loadVertexAttrib(program, vtxData.tex, "texIn", 2);

  var col = this.colours[note];
  var colAttr = this.gl.getUniformLocation(program, "col");
  this.gl.uniform4f(colAttr, col[0], col[1], col[2], 1);

  var selAttr = this.gl.getUniformLocation(program, "selected");
  this.gl.uniform1i(selAttr, selected);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};

})();