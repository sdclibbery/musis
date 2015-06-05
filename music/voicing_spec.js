var jsc = require("jsverify");
var fs = require("fs");
musis = {};
eval(fs.readFileSync('./music/tuning.js', 'utf8'));
eval(fs.readFileSync('./music/note.js', 'utf8'));
eval(fs.readFileSync('./music/voicing.js', 'utf8'));

var arbPcs = jsc.nearray(jsc.elements(['C', 'E', 'G', 'B', 'D', 'F', 'A', 'F#', 'Eb', 'Ab', 'Bb']));

var property = function (name, cond) {
  jsc.property(name, arbPcs, function (pcs) {
    var notes = musis.voicing.assignToVoices(pcs);
    if (!cond(pcs, notes)) {
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

  property("produces four voices", function (pcs, ns) { return ns.length === 4; } );

  property("all of first four pcs are represented", function (pcs, ns) {
    return pcs.slice(0, 4).every(function (pc) {
      return ns.some(function (n) {
        return n.pitchClass === pc;
      });
    });
  } );

  property("voices are in order of pitch", function (pcs, ns) {
    for (i=1; i<4; i++) {
      if (ns[i].chromaticDiff(ns[i-1]) < 0) { return false; }
    }
    return true;
  } );

  property("lowest note is bass pc", function (pcs, ns) { return ns[0].pitchClass === pcs[0]; } );

  property("bass is in range", function (pcs, ns) { return inRange(ns[0], 'E2', 'E4'); } );
  property("tenor is in range", function (pcs, ns) { return inRange(ns[1], 'C3', 'C5'); } );
  property("alto is in range", function (pcs, ns) { return inRange(ns[2], 'G3', 'F5'); } );
  property("soprano is in range", function (pcs, ns) { return inRange(ns[3], 'C4', 'C6'); } );

  property("at least a fourth between bass and tenor", function (pcs, ns) { return ns[1].chromaticDiff(ns[0]) >= 5; } );

  // property("voices do not cross", function (pcs, ns) { return ; } );

  // property("voices do not overlap", function (pcs, ns) { return ; } );

  // property("smooth movement", function (pcs, ns) { return ; } );

  // property("no consecutive octaves", function (pcs, ns) { return ; } );

  // property("no consecutive fifths", function (pcs, ns) { return ; } );

});
