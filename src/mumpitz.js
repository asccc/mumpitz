/* global self */

(function (global) {
  'use strict';

  if ((
    !global.Symbol ||
    !global.Symbol.iterator ||
    !document.querySelectorAll ||
    !document.addEventListener ||
    !document.documentElement ||
    !document.documentElement.matches
  )) {
    throw Error('browser not supported');
  }

  // tags
  const ITERATOR_TAG = global.Symbol.iterator;
  // const TOSTRING_TAG = global.Symbol.toString;

  /**
   * Mumpitz wrapper class
   */
  class Mumpitz {
    /**
     * static initializer
     *
     * @param  {String} selector
     * @param  {Element|Document|null} context
     * @return {Mumpitz}
     */
    static init (selector, context = document) {
      return new Mumpitz(context.querySelectorAll(selector));
    }

    /**
     * constructor
     *
     * @param  {NodeList} nodes
     */
    constructor (nodes) {
      this.nodes = nodes;
      this.length = nodes.length;
    }

    /**
     * iterator
     *
     */
    [ITERATOR_TAG] () {
      // newer engines support Symbol.iterator on NodeList's
      if (this.nodes[ITERATOR_TAG]) {
        return this.nodes[ITERATOR_TAG]();
      }

      const count = this.length;
      const nodes = this.nodes;
      let index = 0;

      return {
        next () {
          if (index < count) {
            return {
              value: nodes[index++],
              done: false
            };
          }
          return {
            done: true
          };
        }
      };
    }

    /**
     * returns a node at the given index (zero-based)
     * or all nodes if no index was specified
     *
     * @param {Number|null} index
     * @return {Element}
     */
    get (index = null) {
      if (index === null) {
        return this.nodes;
      }
      let offset = index;
      let length = this.length;
      if (length === 0) {
        throw Error(
          'get(...) called on empty collection'
        );
      }
      if (offset < 0) {
        offset += length;
      }
      if (offset < 0 || offset >= length) {
        throw Error(
          `get(...): index out of bounds ` +
          `(offset: ${offset}, length: ${length})`
        );
      }
      return this.nodes[offset];
    }

    /**
     * check if an element matches a selector
     *
     * @param  {String}  sel
     * @return {Boolean}
     */
    is (selector) {
      return this.get(0).matches(selector);
    }

    /**
     * jquery compatible each()
     *
     * @param  {Function} func
     * @return {Mumpitz}
     */
    each (func) {
      // jQuery variant
      const count = this.length;
      const nodes = this.nodes;
      for (let i = 0; i < count; ++i) {
        func.call(nodes[i], i, nodes[i]);
      }
      return this;
    }

    /**
     * standard forEach
     *
     * @param  {Function} func
     * @param  {Object} context optional
     */
    forEach (func, context) {
      const count = this.length;
      const nodes = this.nodes;
      const bound = context ? func.bind(context) : func;
      for (let i = 0; i < count; ++i) {
        bound(nodes[i], i, nodes);
      }
    }

    /**
     * searches for elements in the top-element
     *
     * @param  {String} sel
     * @return {Mumpitz}
     */
    find (selector) {
      return Mumpitz.init(selector, this.get(0));
    }

    /**
     * checks if the first element has a class-name
     *
     * @param  {String}  cn
     * @return {Boolean}
     */
    hasClass (className) {
      return this.get(0).classList.contains(className);
    }

    /**
     * removes a class-name
     *
     * @param  {String} className
     * @return {Mumpitz}
     */
    removeClass (className) {
      for (let e of this) {
        e.classList.remove(className);
      }
      return this;
    }

    /**
     * adds a class-name
     *
     * @param {String} className
     */
    addClass (className) {
      for (let e of this) {
        e.classList.add(className);
      }
      return this;
    }

    /**
     * toggles a class
     *
     * @param  {String} className
     * @return {Mumpitz}
     */
    toggleClass (className) {
      for (let e of this) {
        e.classList.toggle(className);
      }
      return this;
    }
  }

  /* exports */
  global.Mumpitz = Mumpitz.init;
  global.Mumpitz.$ = global.$;
  global.Mumpitz.fn = Mumpitz.prototype;
  global.Mumpitz.noConflict = function () {
    if (typeof global.Mumpitz.$ !== 'undefined') {
      global.$ = global.Mumpitz.$;
      delete global.Mumpitz.$;
    }
    return Mumpitz.init;
  };

  /* $ alias */
  global.$ = global.Mumpitz;
})(self);
