(function () {

// Domain

var menus = {
  home: {
    title: 'musis',
    items: [
      { name: 'tutorials', action: function () { show(menus.tutorials); } },
      { name: 'free play' },
      { name: 'settings' }
    ]
  },
  tutorials: {
    title: 'tutorials',
    items: [
      { name: 'diatonic harmony' },
      { name: 'chromatic harmony' }
    ]
  }
};

musis.menus = {};

musis.menus.begin = function () {
  musis.ui.hint('');
  show(menus.home);
};

var show = function (menu) {
  musis.ui.menu.clear();
  musis.ui.title(menu.title);
  menu.items.map(function (item) {
    musis.ui.menu.item(item.name, item.action);
  });
};

})();
