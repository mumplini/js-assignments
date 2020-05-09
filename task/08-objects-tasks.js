'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    Rectangle.prototype.getArea = () => this.width * this.height;
  }
  
  
  /**
   * Returns the JSON representation of specified object
   *
   * @param {object} obj
   * @return {string}
   *
   * @example
   *    [1,2,3]   =>  '[1,2,3]'
   *    { width: 10, height : 20 } => '{"height":10,"width":20}'
   */
  function getJSON(obj) {
    return JSON.stringify(obj);
  }
  
  
  /**
   * Returns the object of specified type from JSON representation
   *
   * @param {Object} proto
   * @param {string} json
   * @return {object}
   *
   * @example
   *    const r = fromJSON(Circle.prototype, '{"radius":10}');
   *
   */
  function fromJSON(proto, json) {
    const obj = Object.create(proto);
    return Object.assign(obj, JSON.parse(json));
  }
  
  
  /**
   * Css selectors builder
   *
   * Each complex selector can consists of type, id, class, attribute, pseudo-class
   * and pseudo-element selectors:
   *
   *    element#id.class[attr]:pseudoClass::pseudoElement
   *              \----/\----/\----------/
   *              Can be several occurences
   *
   * All types of selectors can be combined using the combinators ' ','+','~','>' .
   *
   * The task is to design a single class, independent classes or classes hierarchy
   * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
   * Each selector should have the stringify() method to output the string repsentation
   * according to css specification.
   *
   * Provided cssSelectorBuilder should be used as facade only to create your own classes,
   * for example the first method of cssSelectorBuilder can be like this:
   *   element: function(value) {
   *       return new MySuperBaseElementSelector(...)...
   *   },
   *
   * The design of class(es) is totally up to you, but try to make it as simple,
   * clear and readable as possible.
   *
   * @example
   *
   *  const builder = cssSelectorBuilder;
   *
   *  builder.id('main').class('container').class('editable').stringify()
   *    => '#main.container.editable'
   *
   *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
   *    => 'a[href$=".png"]:focus'
   *
   *  builder.combine(
   *      builder.element('div').id('main').class('container').class('draggable'),
   *      '+',
   *      builder.combine(
   *          builder.element('table').id('data'),
   *          '~',
   *           builder.combine(
   *               builder.element('tr').pseudoClass('nth-of-type(even)'),
   *               ' ',
   *               builder.element('td').pseudoClass('nth-of-type(even)')
   *           )
   *      )
   *  ).stringify()
   *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
   *
   *  For more examples see unit tests.
   */
  
  
  const cssSelectorBuilder = {
  
    continueBuild(item) {
      if (!this.cssItems) {
        const cssItems = [].concat(item);
        const builder = Object.assign({}, this);;
        builder.cssItems = cssItems;
        return builder;
      }
      this.cssItems = this.cssItems.concat(item);
      return this;
    },
  
  
    isUnique(type) {
      if (this.cssItems && this.cssItems.find((el) => el.type === type)) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      return false;
    },
  
    checkOrder(type) {
      if (this.cssItems && this.cssItems.find((el) => el.type === type)) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      return false;
    },
  
    element(value) {
      const el = { type: 'element', value };
      this.isUnique('element');
      this.checkOrder('id');
      return this.continueBuild(el);
    },
  
    id(value) {
      const el = { type: 'id', value: `#${value}` };
      this.isUnique('id');
      this.checkOrder('class');
      this.checkOrder('pseudoElement');
      const builder = this.continueBuild(el);
      return builder;
    },
  
    class(value) {
      const el = { type: 'class', value: `.${value}` };
      this.checkOrder('attr');
      const builder = this.continueBuild(el);
      return builder;
    },
  
    attr(value) {
      const el = { type: 'attr', value: `[${value}]` };
      this.checkOrder('pseudoClass');
      const builder = this.continueBuild(el);
      return builder;
    },
  
    pseudoClass(value) {
      const el = { type: 'pseudoClass', value: `:${value}` };
      this.checkOrder('pseudoElement');
      const builder = this.continueBuild(el);
      return builder;
    },
  
    pseudoElement(value) {
      const el = { type: 'pseudoElement', value: `::${value}` };
      this.isUnique('pseudoElement');
      const builder = this.continueBuild(el);
      return builder;
    },
  
    combine(selector1, combinator, selector2) {
      const el = [...selector1.cssItems, { type: 'combinator', value: ` ${combinator} ` }, ...selector2.cssItems];
      const builder = this.continueBuild(el);
      return builder;
    },
  
    stringify() {
      const out = this.cssItems.map((el) => el.value).join('');
      this.cssItems = null;
      return out;
    },
  };  


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
