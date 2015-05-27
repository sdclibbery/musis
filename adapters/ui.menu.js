(function () {

// Adapter for drawing and updating menus

musis.ui = musis.ui || {};

musis.ui.menu = {};

musis.ui.menu.item = function (name) {
  document.getElementById('menu').innerHTML = '<div class="menu-item">'+name+'</div>';
};

})();
