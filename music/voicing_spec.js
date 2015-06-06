var jsc = require("jsverify");
var fs = require("fs");
musis = {};
eval(fs.readFileSync('./music/tuning.js', 'utf8'));
eval(fs.readFileSync('./music/note.js', 'utf8'));
eval(fs.readFileSync('./music/voicing.js', 'utf8'));

var arbPcs = jsc.nearray(jsc.elements(['C', 'E', 'G', 'B', 'D', 'F', 'A', 'F#', 'Eb', 'Ab', 'Bb']));

var property = function (name, cond) {
  jsc.property(name, arbPcs, function (pcs) {
    var prevNotes = musis.voicing.previous;
    var notes = musis.voicing.assignToVoices(pcs);
    if (!cond(pcs, notes, prevNotes)) {
      console.log('prev: ');
      prevNotes.map(function (n) { console.log(n.toString()); });
      console.log('next: ');
      notes.map(function (n) { console.log(n.toString()); });
      return false;
    }
    return true;
  });
};

var inRange = function (n, l, h) {
  if (n.isLowerThan(new musis.note(l))) { return false; }
  if (n.isHigherThan(new musis.note(h))) { return false; }
  return true;
};

describe("voicing", function() {
  var bass = 0;
  var tenor = 1;
  var alto = 2;
  var soprano = 3;

  property("produces four voices", function (pcs, ns) { return ns.length === 4; } );

  property("all of first four pcs are represented", function (pcs, ns) {
    return pcs.slice(0, 4).every(function (pc) {
      return ns.some(function (n) {
        return n.pitchClass === pc;
      });
    });
  } );

  property("bass is lower than tenor", function (pcs, ns) { return ns[bass].chromaticDiff(ns[tenor]) < 0; } );
  property("tenor is not higher than alto", function (pcs, ns) { return ns[tenor].chromaticDiff(ns[alto]) <= 0; } );
  property("alto is not higher than soprano", function (pcs, ns) { return ns[alto].chromaticDiff(ns[soprano]) <= 0; } );

  property("at least a fourth between bass and tenor", function (pcs, ns) { return ns[tenor].chromaticDiff(ns[bass]) >= 5; } );

  property("first pc becomes the bass note", function (pcs, ns) { return ns[bass].pitchClass === pcs[bass]; } );

  property("bass is in range", function (pcs, ns) { return inRange(ns[bass], 'E2', 'E4'); } );
  property("tenor is in range", function (pcs, ns) { return inRange(ns[tenor], 'C3', 'C5'); } );
  property("alto is in range", function (pcs, ns) { return inRange(ns[alto], 'G3', 'F5'); } );
  property("soprano is in range", function (pcs, ns) { return inRange(ns[soprano], 'C4', 'C6'); } );

  property("bass moves smoothly", function (pcs, ns, prevNs) { return Math.abs(ns[bass].chromaticDiff(prevNs[bass])) <= 12; } );
  property("tenor moves smoothly", function (pcs, ns, prevNs) { return Math.abs(ns[tenor].chromaticDiff(prevNs[tenor])) <= 12; } );
  property("alto moves smoothly", function (pcs, ns, prevNs) { return Math.abs(ns[alto].chromaticDiff(prevNs[alto])) <= 12; } );
  property("soprano moves smoothly", function (pcs, ns, prevNs) { return Math.abs(ns[soprano].chromaticDiff(prevNs[soprano])) <= 12; } );

  // leading note resolution..?

  // property("no consecutive octaves", function (pcs, ns) { return ; } );

  // property("no consecutive fifths", function (pcs, ns) { return ; } );

});
