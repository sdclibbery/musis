(function () {

// Adapter for drawing triggers

var program = null;

var vtxShader2d = ""
+"  attribute vec2 posIn;"
+"  attribute vec2 texIn;"
+"  "
+"  varying vec2 tex;"
+"  "
+"  void main() {"
+"    gl_Position = vec4(posIn, 0, 1);"
+"    tex = texIn;"
+"  }";

var frgShader2d = ""
+"  precision mediump float;"
+"  uniform vec4 col;"
+"  uniform int accidental;"
+"  uniform bool selected;"
+"  uniform bool disabled;"
+"  "
+"  varying vec2 tex;"
+"  "
+"  void main() {"
+"    vec2 texFull = tex*2.0 - 1.0;" // tex coords in range -1 to 1
+"    float d;" // distance field value at this fragment
+"    if (accidental == 0) {" // flat
+"      d = 1.0 - 0.8*length(abs(texFull));"
+"    } else if (accidental == 2) {" // sharp
+"      vec2 t = pow(abs(texFull), vec2(0.8, 0.8));"
+"      d = 1.0 - 0.7*abs(t.x+t.y);"
+"    } else {"
+"      d = 1.0 - length(max(abs(texFull)-0.2, 0.0));"
+"    }"
+"    float dis = (disabled ? 0.3 : 1.0);" // alpha value for disabled status
+"    if (d < 0.35) {"
+"      float b = dis*smoothstep(0.1, 0.3, d);" // border brightness
+"      gl_FragColor = (selected ? vec4(1,1,1,1) : col) * vec4(b,b,b, d<0.3 ? 0.0 : 0.8);" // border color: white if trigger is selected
+"    } else {"
+"      float b = dis*(0.5 + 0.5*smoothstep(0.5, 0.35, d));" // interior brightness
+"      gl_FragColor = col * vec4(b,b,b,0.4);" // interior color
+"    }"
+"  }";

var posAttr = null;
var texAttr = null;
var accUnif = null;
var colUnif = null;
var selUnif = null;
var disUnif = null;
var posBuf = null;
var texBuf = null;


musis.draw.prototype.trigger = function (x, y, size, value, type, state, accidental) {
  if (!program) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
    posBuf = this.gl.createBuffer();
    posAttr = this.gl.getAttribLocation(program, "posIn");
    texBuf = this.gl.createBuffer();
    texAttr = this.gl.getAttribLocation(program, "texIn");
    colUnif = this.gl.getUniformLocation(program, "col");
    accUnif = this.gl.getUniformLocation(program, "accidental");
    selUnif = this.gl.getUniformLocation(program, "selected");
    disUnif = this.gl.getUniformLocation(program, "disabled");
  }

  this.gl.useProgram(program);

  var vtxData = this.squareVtxs(x, y, size);
  this.loadVertexAttrib(posBuf, posAttr, vtxData.vtx, 2);
  this.loadVertexAttrib(texBuf, texAttr, vtxData.tex, 2);

  var col = this.colours[type][value];
  this.gl.uniform4f(colUnif, col[0], col[1], col[2], 1);

  var acc = { flat: 0, nat: 1, sharp: 2 };
  this.gl.uniform1i(accUnif, acc[accidental]);

  this.gl.uniform1i(selUnif, state === 'selected');
  this.gl.uniform1i(disUnif, state === 'disabled');

  this.gl.enable(this.gl.BLEND);
  this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};

})();
