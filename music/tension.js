(function () {

// Domain

musis.tension = {};

var tensions = {
  do: 0,
  re: 4,
  mi: 2,
  fa: 5,
  sol: 1,
  la: 3,
  ti: 6
};

musis.tension.analyse = function (solfege) {
  var sum = 0;
  solfege.map(function (s) {
    sum += tensions[s];
  });
  return sum;
};

})();
