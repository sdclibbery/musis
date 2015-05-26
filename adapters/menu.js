(function () {

// Adapter for drawing and updating menus

musis.menu = {};

musis.menu.item = function (name) {
  document.getElementById('menu').innerHTML = '<div class="menu-item">'+name+'</div>';
};

})();
