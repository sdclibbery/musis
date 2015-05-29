(function () {

// Domain

var menus = {
  home: {
    title: 'musis',
    items: [
      { name: 'tutorials', action: function () { show(menus.tutorials); } },
      { name: 'free play', action: function () { musis.changeGame(musis.freeplay); } },
      { name: 'settings', action: function () { show(menus.settings); } }
    ]
  },
  tutorials: {
    title: 'tutorials',
    items: [
      { name: 'diatonic harmony', action: function () { musis.changeGame(musis.tutorial.diatonic); } },
      { name: 'chromatic harmony', action: function () { musis.changeGame(musis.tutorial.chromatic); } }
    ]
  },
  settings: {
    title: 'settings',
    items: [
      {
        name: function () { return 'Tuning: '+musis.tuning.name(); },
        action: function () { musis.tuning.swap(); return 'Tuning: '+musis.tuning.name(); }
      },
    ]
  }
};

musis.menus = {};

musis.menus.goHome = function () {
  musis.changeGame(musis.menus);
  show(menus.home);
};

musis.menus.begin = function () {
  show(menus.home);
};

var show = function (menu) {
  musis.ui.menu.clear();
  musis.ui.title(menu.title);
  menu.items.map(function (item) {
    var name = item.name;
    if (typeof(item.name) === 'function') { name = item.name(); }
    musis.ui.menu.item(name, item.action);
  });
};

})();
