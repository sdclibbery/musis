musis.draw = function () {
  this.gl = null;
  this.cw = 1;
  this.ch = 1;
};

musis.draw.prototype.frameStart = function (gl, cw, ch) {
  if (!this.gl) {
    this.init(gl, cw, ch);
  }

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
};

var colours = {
  C: new Float32Array([0, 0, 1, 1]),
  D: new Float32Array([1, 1, 0, 1]),
  E: new Float32Array([0.8, 0, 1, 1]),
  F: new Float32Array([0, 1, 0, 1]),
  G: new Float32Array([1, 0, 0, 1]),
  A: new Float32Array([0, 1, 1, 1]),
  B: new Float32Array([1, 1, 0, 1])
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

  var colAttr = this.gl.getUniformLocation(this.prg2d, "col");
  this.gl.uniform4fv(colAttr, colours[note]);

  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

  // Need glow, selection and trail

/*
  this.cv2d.shadowOffsetX = 0;
  this.cv2d.shadowOffsetY = 0;
  this.cv2d.shadowBlur = 10;
  this.cv2d.lineWidth = 3;

  this.cv2d.fillStyle = "hsl("+hue+", 100%, 45%)";
  this.cv2d.shadowColor = "hsl("+hue+", 100%, 55%)";
  this.cv2d.fillRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);

  if (selected) {
    this.cv2d.shadowColor = "white";
    this.cv2d.strokeStyle = "white";
  } else {
    this.cv2d.strokeStyle = "hsl("+hue+", 100%, 55%)";
  }
  this.cv2d.strokeRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);
*/
};

musis.draw.prototype.star = function (x, y, note, life) {
/*
  var s = this.hToCanvas(0.015);
  var hs = s/2;
  var hue = hues[note];
  var l = 1 - life*life;
  this.cv2d.fillStyle = "hsla("+hue+", 100%, 50%, "+l+")";
  this.cv2d.shadowColor = "hsla("+hue+", 100%, 45%, "+l+")";
  this.cv2d.fillRect(this.xToCanvas(x)-hs, this.yToCanvas(y)-hs, s, s);
*/
};

//////

musis.draw.prototype.init = function(gl, cw, ch) {
  this.gl = gl;
  this.cw = cw;
  this.ch = ch;
  this.prg2d = createPrg2d(gl, cw, ch);
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

var createPrg2d = function(gl, cw, ch) {
  var vtxShader2d = "attribute vec2 pos; void main() { gl_Position = vec4(pos, 0, 1); }";
  vertexShader = loadShader(gl, vtxShader2d, gl.VERTEX_SHADER);

  var frgShader2d = "precision mediump float; uniform vec4 col; void main() { gl_FragColor = col; }";
  fragmentShader = loadShader(gl, frgShader2d, gl.FRAGMENT_SHADER);

  return loadProgram(gl, [vertexShader, fragmentShader]);
}

var loadShader = function(gl, shaderSource, shaderType) {
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
}

var loadProgram = function(gl, shaders, opt_attribs, opt_locations) {
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
