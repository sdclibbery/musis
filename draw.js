musis.draw = function () {
  this.gl = null;
  this.cw = 1;
  this.ch = 1;
};

musis.draw.prototype.frameStart = function (gl, cw, ch) {
  if (!this.gl) {
    this.init(gl, cw, ch);
  }

  this.gl.clearColor(0, 0, 0, 1);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
};

musis.draw.prototype.colours = {
  C: [0, 0, 1],
  D: [1, 1, 0],
  E: [0.7, 0, 1],
  F: [0, 1, 0],
  G: [1, 0, 0],
  A: [0, 1, 1],
  B: [1, 0.5, 0]
};

musis.draw.prototype.trigger = function (x, y, size, note, selected) {
  this.gl.useProgram(this.prg2d);

  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  var vtxs = this.squareVtxs(x, y, size);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vtxs, this.gl.STATIC_DRAW);

  var posAttr = this.gl.getAttribLocation(this.prg2d, "pos");
  this.gl.enableVertexAttribArray(posAttr);
  this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

  var col = this.colours[note];
  var colAttr = this.gl.getUniformLocation(this.prg2d, "col");
  this.gl.uniform4f(colAttr, col[0], col[1], col[2], 1);

  this.gl.disable(this.gl.BLEND);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

  // Need glow, selection and trail, and rounded corners?
};

//////

musis.draw.prototype.init = function(gl, cw, ch) {
  this.gl = gl;
  this.cw = cw;
  this.ch = ch;
  this.prg2d = this.createPrg2d(gl, cw, ch);
};

musis.draw.prototype.xFromCanvas = function (x) {
  return (x*2 - this.cw) / this.ch;
};
musis.draw.prototype.yFromCanvas = function (y) {
  return 1 - y*2/this.ch;
};
musis.draw.prototype.toX = function (x) {
  return x * this.ch / this.cw;
};

musis.draw.prototype.squareVtxs = function (x, y, size) {
  var hs = size/2;
  var l = this.toX(x - hs);
  var r = this.toX(x + hs);
  var b = y - hs;
  var t = y + hs;
  return new Float32Array([
    l, t,
    r, t,
    l, b,
    l, b,
    r, t,
    r, b]);
};

musis.draw.prototype.createPrg2d = function(gl, cw, ch) {
  var vtxShader2d = "attribute vec2 pos; void main() { gl_Position = vec4(pos, 0, 1); }";
  vertexShader = this.loadShader(gl, vtxShader2d, gl.VERTEX_SHADER);

  var frgShader2d = "precision mediump float; uniform vec4 col; void main() { gl_FragColor = col; }";
  fragmentShader = this.loadShader(gl, frgShader2d, gl.FRAGMENT_SHADER);

  return this.loadProgram(gl, [vertexShader, fragmentShader]);
};

musis.draw.prototype.loadShader = function(gl, shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    console.log("*** Error compiling shader :" + gl.getShaderInfoLog(shader) + "\nSource: " + shaderSource);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

musis.draw.prototype.loadProgram = function(gl, shaders, opt_attribs, opt_locations) {
  var program = gl.createProgram();
  for (var ii = 0; ii < shaders.length; ++ii) {
    gl.attachShader(program, shaders[ii]);
  }
  if (opt_attribs) {
    for (var ii = 0; ii < opt_attribs.length; ++ii) {
      gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[ii] : ii,
          opt_attribs[ii]);
    }
  }
  gl.linkProgram(program);

  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
      console.log("Error in program linking:" + gl.getProgramInfoLog (program));
      gl.deleteProgram(program);
      return null;
  }
  return program;
};
