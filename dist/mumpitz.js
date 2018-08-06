(function () {
  'use strict';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  (function (global) {
    'use strict';

    if (!global.Symbol || !global.Symbol.iterator || !document.querySelectorAll || !document.addEventListener || !document.documentElement || !document.documentElement.matches) {
      throw Error('browser not supported');
    }

    // tags
    var ITERATOR_TAG = global.Symbol.iterator;
    // const TOSTRING_TAG = global.Symbol.toString;

    /**
     * Mumpitz wrapper class
     */

    var Mumpitz = function () {
      createClass(Mumpitz, null, [{
        key: 'init',

        /**
         * static initializer
         *
         * @param  {String} sel
         * @param  {Element|null} ctx
         * @return {Mumpitz}
         */
        value: function init(sel, ctx) {
          if (!ctx) {
            ctx = document;
          }
          return new Mumpitz(ctx.querySelectorAll(sel));
        }

        /**
         * constructor
         *
         * @param  {NodeList} nodes
         */

      }]);

      function Mumpitz(nodes) {
        classCallCheck(this, Mumpitz);

        this.nodes = nodes;
        this.length = nodes.length;
      }

      /**
       * iterator
       *
       */


      createClass(Mumpitz, [{
        key: ITERATOR_TAG,
        value: function value() {
          // newer engines support Symbol.iterator on NodeList's
          if (this.nodes[ITERATOR_TAG]) {
            return this.nodes[ITERATOR_TAG]();
          }

          var i = 0;
          var l = this.length;
          var n = this.nodes;

          return function () {
            if (i + 1 >= l) {
              return {
                value: undefined,
                done: true
              };
            }
            return {
              value: n[i++],
              done: false
            };
          };
        }

        /**
         * returns the first node
         *
         * @return {Element}
         */

      }, {
        key: 'top',
        value: function top() {
          if (!this.length) {
            throw Error('top() called on empty collection');
          }
          return this.nodes[0];
        }

        /**
         * check if an element matches a selector
         *
         * @param  {String}  sel
         * @return {Boolean}
         */

      }, {
        key: 'is',
        value: function is(sel) {
          return this.top().matches(sel);
        }

        /**
         * searches for elements in the top-element
         *
         * @param  {String} sel
         * @return {Mumpitz}
         */

      }, {
        key: 'find',
        value: function find(sel) {
          return Mumpitz.init(sel, this.top());
        }

        /**
         * checks if the first element has a class-name
         *
         * @param  {String}  cn
         * @return {Boolean}
         */

      }, {
        key: 'hasClass',
        value: function hasClass(cn) {
          return this.top().classList.contains(cn);
        }

        /**
         * removes a class-name
         *
         * @param  {String} cn
         * @return {Mumpitz}
         */

      }, {
        key: 'removeClass',
        value: function removeClass(cn) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var e = _step.value;

              e.classList.remove(cn);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return this;
        }

        /**
         * adds a class-name
         *
         * @param {String} cn
         */

      }, {
        key: 'addClass',
        value: function addClass(cn) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var e = _step2.value;

              e.classList.add(cn);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return this;
        }

        /**
         * toggles a class
         *
         * @param  {String} cn
         * @return {Mumpitz}
         */

      }, {
        key: 'toggleClass',
        value: function toggleClass(cn) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var e = _step3.value;

              e.classList.toggle(cn);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          return this;
        }
      }]);
      return Mumpitz;
    }();

    /* exports */


    global.Mumpitz = Mumpitz.init;
    global.Mumpitz.$ = global.$;
    global.Mumpitz.fn = Mumpitz.prototype;
    global.Mumpitz.noConflict = function () {
      global.$ = global.Mumpitz.$;
      return Mumpitz.init;
    };

    /* $ alias */
    global.$ = global.Mumpitz;
  })(self);

}());

//# sourceMappingURL=mumpitz.js.map