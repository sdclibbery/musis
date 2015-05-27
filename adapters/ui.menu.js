(function () {

// Adapter for drawing and updating menus

musis.ui = musis.ui || {};

musis.ui.menu = {};

musis.ui.menu.clear = function () {
  var menu = document.getElementById('menu');
  menu.innerHTML = '';
};

musis.ui.menu.item = function (name, action) {
  var menu = document.getElementById('menu');
  var item = document.createElement('div');
  item.className = 'menu-item';
  item.innerHTML = name;
  item.onclick = action;
  menu.appendChild(item);
};

})();
