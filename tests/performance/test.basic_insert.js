'use strict';

var test = require('tape');

var PouchDB = require('../../');
var db, time;
function mainTest(t) {
  var num = 1000;
  function after(err) {
    if (err) {
      t.error(err);
    }
    num--;
    if (num) {
      process.nextTick(function () {
        db.put({'yo': 'dawg'}, '' + num, after);
      });
    } else {
      t.end();
    }
  }

  db.put({'yo': 'dawg'}, '' + num, after);
}

function tearDown(t) {
  t.ok(true, Date.now() - time + ' ms');
  db.destroy(function (err) {
    if (err) {
      t.error(err, 'no error destoying db');
    }
    t.end();
  });
}

test('benchmarking local', function (t) {
  

  t.test('setup', function (t) {
    new PouchDB('test' + Math.random()).then(function (d) {
      db = d;
      time = Date.now();
      t.end();
    });
  });

  t.test('meat', mainTest);

  t.test('teardown', tearDown);
});
test('benchmarking http', function (t) {
  t.test('setup', function (t) {
    new PouchDB('http://localhost:5984/perftest' + Math.random().toString().slice(2)).then(function (d) {
      db = d;
      time = Date.now();
      t.end();
    });
  });
  t.test('meat', mainTest);
  t.test('teardown', tearDown);
});
