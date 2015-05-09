(function () {

// Adapter for drawing stars

var vtxShader2d = ""
+"  uniform float time;"
+"  uniform float size;"
+"  "
+"  attribute float startTimeIn;"
+"  attribute vec2 posIn;"
+"  attribute vec2 velIn;"
+"  attribute vec3 colIn;"
+"  "
+"  varying vec4 col;"
+"  "
+"  void main() {"
+"    float age = (time - startTimeIn)/1000.0;" // age of star in seconds
+"    vec2 vel = velIn + vec2(0, -0.1*age);" // velocity of star including gravity but not drag
+"    float drag = 1.0 - 0.1*age;" // drag factor
+"    vel *= vec2(drag, drag);" // velocity with drag
+"    vec2 pos = posIn + vel*age;" // position when velocity is applied
+"    gl_Position = vec4(pos, 0, 1);"
+"    gl_PointSize = size;"
+"    float life = age/1.5;" // life fraction for star
+"    float flicker = 0.4*sin(life*(1.0+pos.x*pos.y)*1000.0);" // flickering
+"    float brightness = 1.0 - life*life + flicker;" // brightness of star given lifetime
+"    col = vec4(colIn*brightness, 1);"
+"  }";

var frgShader2d = ""
+"  precision mediump float;"
+"  "
+"  varying vec4 col;"
+"  "
+"  void main() {"
+"    vec2 texFull = gl_PointCoord*2.0 - 1.0;" // tex coords in range -1 to 1
+"    float d = length(texFull);" // distance field value at this fragment
+"    float b = 1.0 - smoothstep(0.0, 1.0, d);" // brightness at this fragment
+"    gl_FragColor = col * vec4(b*b,b*b,b*b, 1);" // modulate color with the brightness; sqr to give glowy blur
+"  }";

var size = 0.013;
var program = null;
var numVtxs = 1000;
var vtxTimes = new Float32Array(numVtxs);
var vtxPosns = new Float32Array(numVtxs*2);
var vtxVels = new Float32Array(numVtxs*2);
var vtxCols = new Float32Array(numVtxs*3);
var lastVtxIdx = 0;
var posBuf = null;
var posAttr = null;
var velBuf = null;
var velAttr = null;
var colBuf = null;
var colAttr = null;
var startTimeBuf = null;
var startTimeAttr = null;
var sizeUnif = null;
var timeUnif = null;

musis.draw.prototype.addStar = function (star) {
  var col = this.colours.solfege[star.solfege];
  vtxTimes[lastVtxIdx] = this.time;
  vtxPosns[lastVtxIdx*2+0] = star.x;
  vtxPosns[lastVtxIdx*2+1] = star.y;
  vtxVels[lastVtxIdx*2+0] = this.toX(star.vx);
  vtxVels[lastVtxIdx*2+1] = star.vy;
  vtxCols[lastVtxIdx*3+0] = col[0];
  vtxCols[lastVtxIdx*3+1] = col[1];
  vtxCols[lastVtxIdx*3+2] = col[2];
  lastVtxIdx = (lastVtxIdx+1) % numVtxs;
};

musis.draw.prototype.stars = function () {
  if (program === null) {
    program = this.loadProgram([
      this.loadShader(vtxShader2d, this.gl.VERTEX_SHADER),
      this.loadShader(frgShader2d, this.gl.FRAGMENT_SHADER)
    ]);
    posBuf = this.gl.createBuffer();
    posAttr = this.gl.getAttribLocation(program, "posIn");
    velBuf = this.gl.createBuffer();
    velAttr = this.gl.getAttribLocation(program, "velIn");
    colBuf = this.gl.createBuffer();
    colAttr = this.gl.getAttribLocation(program, "colIn");
    startTimeBuf = this.gl.createBuffer();
    startTimeAttr = this.gl.getAttribLocation(program, "startTimeIn");
    sizeUnif = this.gl.getUniformLocation(program, "size");
    timeUnif = this.gl.getUniformLocation(program, "time");
  }

  this.gl.useProgram(program);

  this.gl.uniform1f(timeUnif, this.time);
  this.gl.uniform1f(sizeUnif, size*this.ch);

  this.loadVertexAttrib(startTimeBuf, startTimeAttr, vtxTimes, 1);
  this.loadVertexAttrib(posBuf, posAttr, vtxPosns, 2);
  this.loadVertexAttrib(velBuf, velAttr, vtxVels, 2);
  this.loadVertexAttrib(colBuf, colAttr, vtxCols, 3);

  this.gl.blendFuncSeparate(this.gl.ONE, this.gl.ONE, this.gl.ZERO, this.gl.ONE);
  this.gl.enable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.POINTS, 0, numVtxs);
};

})();
