/* global QUnit, Mumpitz, NodeList, Element */
QUnit.test('Mumpitz.noConflict restores original $-variable', function (assert) {
  var m = Mumpitz.noConflict();
  assert.ok(typeof window.$ === 'object', '$ still exists');
  assert.ok('test' in window.$, '$ shape looks valid');
  assert.ok(window.$.test === 1, '$ properties look valid');
  assert.ok(m === Mumpitz, 'return value is valid');
});

QUnit.test('Mumpitz dies on invalid selectors', function (assert) {
  assert.throws(
    function () {
      Mumpitz('$%&/()=?');
    },
    'Mumpitz throws if a invalid selector is passed'
  );
  assert.throws(
    function () {
      Mumpitz('div').find('!"§$%&/()');
    },
    'Mumpitz#find throws if a invalid selector is passed'
  );
});

QUnit.test('Mumpitz dies on invalid contexts', function (assert) {
  assert.throws(
    function () {
      var m = Mumpitz('div');
      Mumpitz('div', m);
    },
    'Mumpitz as context throws'
  );
  assert.throws(
    function () {
      Mumpitz('div', null);
    },
    'NULL as context throws'
  );
  assert.ok(Mumpitz('div', undefined), 'UNDEFINED as context must use default');
});

QUnit.test('Mumpitz#[Symbol.iterator] specification', function (assert) {
  var m = Mumpitz('div');
  var l = m.length;
  var i = m[Symbol.iterator]();
  assert.ok(l > 1, 'Found something to test');
  assert.ok(typeof i.next === 'function', 'iterator has a next() method');
  assert.ok(i.next().done === false, 'iterator is not done yet');
  assert.ok(i.next().value instanceof Element, 'iterator returns html elements');
  for (var c = 2; c < l; ++c) {
    i.next();
  }
  assert.ok(i.next().done, 'iterator is done');
  assert.ok(i.next().done, 'iterator is still done');
  try {
    (function () {
      var s = Mumpitz('#qunit');
      eval('for (let e of s) { assert.ok(e === s.nodes[0], "for-of works as expected"); break; }');
    })();
  } catch (e) {
    assert.ok(1, 'for-of is not supported (no test)');
  }
});

QUnit.test('Mumpitz#get specification', function (assert) {
  assert.ok(Mumpitz('div').get() instanceof NodeList, 'get() returns the original nodelist');
  assert.ok(Mumpitz('div').get(0) instanceof Element, 'get(0) returns one element');

  var m = Mumpitz('div');
  var first = m.nodes[0];
  var last = m.nodes[m.nodes.length - 1];

  assert.ok(m.get(0) === first, 'get(0) returns the first element');
  assert.ok(m.get(-1) === last, 'get(-1) returns the last element');
  assert.ok(m.get(-m.nodes.length) === first, 'get(-length) returns the first element');

  assert.throws(
    function () {
      m.get(m.nodes.length);
    },
    'get() out of bounds throws'
  );

  assert.throws(
    function () {
      m.get(-(m.nodes.length + 1));
    },
    'get() out of bounds throws #2'
  );
});
