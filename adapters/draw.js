// Adapter for visual rendering

musis.draw = function () {
  this.time = 0;
  this.gl = null;
  this.cw = 1;
  this.ch = 1;
};

var sharp = function (col) {
  return col.map(function (v) {
    return 0.3+v*0.8;
  });
};
var flat = function (col) {
  return col.map(function (v) {
    return 0.2+v*0.4;
  });
};

var grey = [0.3, 0.3, 0.3];
var blue = [0.0, 0.1, 1.0];
var green = [0.0, 0.8, 0.2];
var red = [0.8, 0.0, 0.2];
var yellow = [0.8, 0.7, 0.0];
var orange = [0.9, 0.4, 0.0];
var cyan = [0.0, 0.6, 0.8];
var purple = [0.6, 0.0, 0.7];
musis.draw.prototype.colours = {
  solfege: {
    none: grey,
    do: blue,
    re: orange,
    mi: cyan,
    me: flat(cyan),
    fa: red,
    fi: sharp(red),
    sol: green,
    la: purple,
    le: flat(purple),
    ti: yellow,
    te: flat(yellow)
  },
  function: {
    none: grey,
    tonic: blue,
    predominant: red,
    dominant: green,
    diminished: cyan
  }
};

musis.draw.prototype.frameStart = function (t, gl, cw, ch) {
  this.time = t;
  if (!this.gl) {
    this.gl = gl;
  }
  this.cw = cw;
  this.ch = ch;

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

musis.draw.prototype.perspectiveMatrix = function (fovy, near, far) {
    var aspect = this.cw / this.ch;
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var out = new Float32Array(16);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
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

musis.draw.prototype.createIndexBuffer = function (indexes) {
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indexes, this.gl.STATIC_DRAW);
  return buffer;
};

musis.draw.prototype.loadVertexAttrib = function (buffer, attr, data, stride) {
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  this.gl.enableVertexAttribArray(attr);
  this.gl.vertexAttribPointer(attr, stride, this.gl.FLOAT, false, 0, 0);
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
