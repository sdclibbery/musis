(function () {

// Adapter for drawing info text

musis.draw.prototype.title = function (t) {
  document.getElementById("title").innerHTML = t;
};

musis.draw.prototype.hint = function (t) {
  document.getElementById("hint").innerHTML = t;
};

})();
