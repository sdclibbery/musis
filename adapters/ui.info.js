(function () {

// Adapter for drawing info text

musis.ui = musis.ui || {};

musis.ui.title = function (t) {
  setInfo(this.draw, 'title', t);
};

musis.ui.hint = function (t) {
  setInfo(this.draw, 'hint', t);
};

var setInfo = function (draw, type, t) {
  Object.keys(draw.colours.function).map(function (name) {
    var col = draw.colours.function[name];
    var colStyle = Math.floor(col[0]*255)+','+Math.floor(col[1]*255)+','+Math.floor(col[2]*255);
    var re = new RegExp(' '+name+'', 'gi');
    t = t.replace(re, '<span style="color:rgb('+colStyle+')"> '+name+'</span>');
  });
  document.getElementById(type).innerHTML = t;
};

})();
