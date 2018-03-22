/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
goog.module('stack.ui.Tabs');

const Select =  goog.require('stack.ui.Select');
const TagName =  goog.require('goog.dom.TagName');
const asserts =  goog.require('goog.asserts');
const classlist =  goog.require('goog.dom.classlist');
const dataset =  goog.require('goog.dom.dataset');
const dom = goog.require('goog.dom');

/**
 * Select component that maintains a set of tabs.
 */
class Tabs extends Select {

  /**
   * @param {?dom.DomHelper=} opt_domHelper
   * @param {?HTMLElement=} opt_menuElement
   * @param {?string=} opt_defaultTabName
   */
  constructor(opt_domHelper, opt_menuElement, opt_defaultTabName) {
    super(opt_domHelper);

    /**
     * @private @type {?HTMLElement}
     */
    this.menuElement_ = opt_menuElement || null;

    /**
     * @private @type {string}
     */
    this.defaultTabName_ = opt_defaultTabName || "";
  }


  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    if (!this.menuElement_) {
      this.menuElement_ = this.insertMenuElement();
    }
  }

  
  /**
   * Add the menu element if one was not provided to the constructor.
   * @return {!HTMLElement}
   */
  insertMenuElement() {
    const menu = this.createMenuElement();
    const el = this.getElementStrict();
    dom.insertChildAt(el, menu, 0);
    return menu;
  }
  

  /**
   * @return {!HTMLElement}
   */
  createMenuElement() {
    return /** @type{!HTMLElement} */(this.getDomHelper().createDom(TagName.DIV, this.getMenuElementClass()));
  }

  
  /**
   * @return {string}
   */
  getMenuElementClass() {
    return 'ui menu';
  }
  
  
  /**
   * @return {?HTMLElement}
   */
  getMenuElement() {
    return this.menuElement_;
  }

  
  /**
   * @override
   */
  goHere(route) {
    if (this.defaultTabName_) {
      this.select(this.defaultTabName_, route.add(this.defaultTabName_));
    } else {
      super.goHere(route);
    }
  }
  
  /**
   * @override
   */
  addTab(name, c) {
    super.addTab(name, c);
    const itemElement = this.createItemElement(name, c);
    this.menuElement_.appendChild(itemElement);
    return c;
  }

  /**
   * @override
   */
  showTab(name) {
    var tab = super.showTab(name);
    if (tab) {
      const el = this.getItemElement(name);
      if (el) {
        classlist.add(el, 'active');
      }
    }
    return tab;
  }

  /**
   * @override
   */
  hideCurrent() {
    const name = this.getCurrentTabName();
    if (name) {
      const el = this.getItemElement(name);
      if (el) {
        classlist.remove(el, 'active');
        asserts.assert(!classlist.contains(el, 'active'));
      }
    }
    return super.hideCurrent();
  }
  
  /**
   * @param {string} name
   * @param {!stack.ui.Component} c
   * @return {!HTMLElement}
   */
  createItemElement(name, c) {
    const a = this.getDomHelper().createDom(TagName.A, 'item');
    a.href = `/#/${c.getPathUrl()}`;
    dataset.set(a, 'name', name);
    dom.append(a, c.getComponentLabel(name));
    return a;
  }

  /**
   * @param {string} name
   * @return {?HTMLElement}
   */
  getItemElement(name) {
    let el = this.menuElement_.firstElementChild;
    while (el) {
      if (dataset.get(el, 'name') === name) {
        return /** @type {!HTMLElement} */(el);
      }
      el = el.nextElementSibling;
    }
    return null;
  }
  
}

exports = Tabs;
