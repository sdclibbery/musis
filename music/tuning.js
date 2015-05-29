(function () {

// Domain

musis.tuning = {
  cur: 'just'
};

musis.tuning.current = function () {
  return this.cur;
};

musis.tuning.swap = function () {
  this.cur = (this.cur === 'just') ? '12tet' : 'just';
};

})();
