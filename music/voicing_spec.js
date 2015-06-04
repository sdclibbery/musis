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
    return !!cond(notes);
  });
};

describe("voicing", function() {

  property("produces four voices", function (ns) { return ns.length === 4; } );

  // property("all of first four pcs are represented", function (ns) { return ; } );

  // property("voices are in order of pitch", function (ns) { return ; } );

  // property("lowest note is bass pc", function (ns) { return ; } );

  // property("bass is in range", function (ns) { return ; } );

  // property("tenor is in range", function (ns) { return ; } );

  // property("alto is in range", function (ns) { return ; } );

  // property("soprano is in range", function (ns) { return ; } );

  // property("either open or closed voicing", function (ns) { return ; } );

  // property("voices do not cross", function (ns) { return ; } );

  // property("voices do not overlap", function (ns) { return ; } );

  // property("smooth movement", function (ns) { return ; } );

  // property("no consecutive octaves", function (ns) { return ; } );

  // property("no consecutive fifths", function (ns) { return ; } );

});
