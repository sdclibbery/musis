// Adapter for visual rendering

musis.draw = function () {
  this.time = 0;
  this.gl = null;
  this.cw = 1;
  this.ch = 1;
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

musis.draw.prototype.frameStart = function (t, gl, cw, ch) {
  this.time = t;
  if (!this.gl) {
    this.gl = gl;
    this.cw = cw;
    this.ch = ch;
  }

  this.gl.clearColor(0, 0, 0, 1);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
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
  return {
    vtx: new Float32Array([
      l, t,
      r, t,
      l, b,
      l, b,
      r, t,
      r, b]),
    tex: new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ])};
};

musis.draw.prototype.loadVertexAttrib = function (program, data, attr, stride) {
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  var attrLoc = this.gl.getAttribLocation(program, attr);
  this.gl.enableVertexAttribArray(attrLoc);
  this.gl.vertexAttribPointer(attrLoc, stride, this.gl.FLOAT, false, 0, 0);
};

musis.draw.prototype.loadShader = function(shaderSource, shaderType) {
  var gl = this.gl;
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

musis.draw.prototype.loadProgram = function(shaders, opt_attribs, opt_locations) {
  var gl = this.gl;
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
