/**
 * @fileoverview
 */
goog.module('stack.ui.Select');

const TabEvent = goog.require('stack.ui.TabEvent');
const Template = goog.require('stack.ui.Template');
const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const { Component, Route } = goog.require('stack.ui');

/**
 * Component with routing capability such that only one named child
 * component is visible at one one time.
 */
class Select extends Component {

  /**
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(opt_domHelper) {
    super(opt_domHelper);

    /**
     * A mapping from tab name to component id.
     *
     * @const @private @type {!Object<string,string>}
     */
    this.name2id_ = {};

    /**
     * The current tab name.
     * @private @type {?string}
     */
    this.current_ = null;

    /**
     * The previous tab name.
     * @private @type {?string}
     */
    this.prev_ = null;
  }

  /**
   * @return {?string}
   */
  getCurrentTabName() {
    return this.current_;
  }

  /**
   * @param {string} name
   * @param {!Component} c
   * @return {!Component}
   */
  addTab(name, c) {
    var name2id = this.name2id_;
    if (name2id[name]) {
      throw new Error('Duplicate tab: ' + name);
    }
    name2id[name] = asserts.assertString(c.getId());
    c.setName(name);
    this.addChild(c, true);
    c.hide();
    this.registerDisposable(c);
    this.prev_ = name;
    this.dispatchEvent(new TabEvent("tab-added", name, c));
    return c;
  }

  /**
   * Remove a tab by name.  This always unrenders the component but does not
   * dispose it (responsibility of the caller).
   * @param {string} name 
   * @return {?Component}
   */
  removeTab(name) {
    let tab = this.getTab(name);
    if (!tab) {
      return null;
    }
    this.removeChild(tab, true);
    delete this.name2id_[name];
    if (this.current_ === name) {
      this.current_ = "";
      if (this.prev_) {
        this.showTab(this.prev_);
      }
    }
    return tab;
  }

  /**
   * @param {string} name
   * @return {?Component}
   */
  showTab(name) {
    var tab = this.getTab(name);
    if (tab) {
      this.hideCurrent();
      this.current_ = name;
      //var path = this.getPath();
      //path.push(name);
      tab.show();
    }
    return tab;
  }

  /**
   * @param {string} name
   * @return {?Component}
   */
  getTab(name) {
    asserts.assertString(name, 'Name argument not defined');
    var tab = /** @type {?Component} */ (
      this.child(this.name2id_[name])
    );
    return tab;
  }

  /**
   * Get a tab that we don't ever expect to be null.
   * @param {string} name
   * @return {!Component}
   */
  getTabStrict(name) {
    return asserts.assertObject(this.getTab(name));
  }

  /**
   * @return {!Array<string>}
   */
  getTabNames() {
    return Object.keys(this.name2id_);
  }

  /**
   * @override
   * @param {!Route} route
   */
  goHere(route) {
    if (this.current_) {
      this.select(this.current_, route);
      return;
    }
    this.selectHere(route);
  }

  /**
   * @param {!Route} route
   */
  selectHere(route) {
    super.goHere(route);
  }

  /**
   * @override
   * @param {!Route} route
   */
  goDown(route) {
    var name = route.peek();
    //console.log('select.goDown("' + name + '")', this);
    if (name) {
      this.select(name, route);
    } else {
      if (this.prev_) {
        this.select(this.prev_, route);
      } else {
        route.fail(this, 'No selectable tab pane');
      }
    }
  }

  /**
   * @param {string} name
   * @param {!Route} route
   */
  select(name, route) {
    asserts.assertString(name);
    var tab = this.showTab(name);
    if (tab) {
      tab.go(route);
    } else {
      this.selectFail(name, route);
    }
  }

  /**
   * @param {string} name
   * @param {!Route} route
   */
  selectFail(name, route) {
    const notFound = this.getNotFoundTemplate();
    if (notFound) {
      this.selectNotFound(name, route, notFound);
    } else {
      route.fail(this, `No tab for ${name} in ${JSON.stringify(this.name2id_)}`);
    }
  }

  /**
   * The base case when the tab is not found.
   * @param {string} name
   * @param {!Route} route
   * @param {!Function} template
   */
  selectNotFound(name, route, template) {
    this.addTab(name, new Template(template, {
      name: name,
      route: route,
    }, {
      pathURL: this.getPathUrl(),
    }));
    this.select(name, route);
  }

  /**
   * Get the current tab.
   *
   * @return {?Component}
   */
  getCurrent() {
    if (this.current_) {
      return this.getTab(this.current_);
    }
    return null;
  }

  /**
   * Hide the current tab and make it the previous.
   * @return {?Component}
   */
  hideCurrent() {
    var prev = null;
    if (this.current_) {
      this.prev_ = this.current_;
      prev = this.getTab(this.prev_);
      if (prev) {
        prev.hide();
      }
    }
    this.current_ = null;
    return prev;
  }

  /**
   * A function to be overridden by subclasses to opt-in
   * to the not-found template.
   * @returns {?Function} template
   */
  getNotFoundTemplate() {
    return null;
  }
}

exports = Select;
