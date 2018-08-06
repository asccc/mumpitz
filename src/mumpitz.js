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
     * @param  {String} sel
     * @param  {Element|null} ctx
     * @return {Mumpitz}
     */
    static init (sel, ctx) {
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

      let i = 0;
      let l = this.length;
      let n = this.nodes;

      return () => {
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
    top () {
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
    is (sel) {
      return this.top().matches(sel);
    }

    /**
     * searches for elements in the top-element
     *
     * @param  {String} sel
     * @return {Mumpitz}
     */
    find (sel) {
      return Mumpitz.init(sel, this.top());
    }

    /**
     * checks if the first element has a class-name
     *
     * @param  {String}  cn
     * @return {Boolean}
     */
    hasClass (cn) {
      return this.top().classList.contains(cn);
    }

    /**
     * removes a class-name
     *
     * @param  {String} cn
     * @return {Mumpitz}
     */
    removeClass (cn) {
      for (let e of this) {
        e.classList.remove(cn);
      }
      return this;
    }

    /**
     * adds a class-name
     *
     * @param {String} cn
     */
    addClass (cn) {
      for (let e of this) {
        e.classList.add(cn);
      }
      return this;
    }

    /**
     * toggles a class
     *
     * @param  {String} cn
     * @return {Mumpitz}
     */
    toggleClass (cn) {
      for (let e of this) {
        e.classList.toggle(cn);
      }
      return this;
    }
  }

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
