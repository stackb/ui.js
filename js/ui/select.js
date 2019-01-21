/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
goog.module('stack.ui.Select');

const Component =  goog.require('stack.ui.Component');
const ItemEvent =  goog.require('goog.ui.ItemEvent');
const asserts =  goog.require('goog.asserts');
const dom =  goog.require('goog.dom');
const soy =  goog.require('goog.soy');

/**
 * @private
 * @type {?Function}
 */
let defaultFailTemplate_ = null;

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
      throw new Error('Duplicate: ' + name);
    }
    name2id[name] = asserts.assertString(c.getId());
    c.setName(name);
    this.addChild(c, true);
    c.hide();
    this.registerDisposable(c);
    this.prev_ = name;
    this.dispatchEvent(new ItemEvent('tab-added', c, null));
    return c;
  }

  /**
   * @param {string} name
   * @return {?Component}
   */
  showTab(name) {
    var tab = this.getTab(name);
    if (tab) {
      this.showTabInternal(name, tab);
    }
    return tab;
  }

  /**
   * @private
   * @param {string} name
   * @param {!Component} tab
   */
  showTabInternal(name, tab) {
    this.hideCurrent();
    this.current_ = name;
    tab.show();
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
   * @param {string} name
   * @return {boolean}
   */
  hasTab(name) {
    return goog.isDefAndNotNull(this.getTab(name));
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
   */
  goDown(route) {
    var name = route.peek();
    //console.log('select.goDown("' + name + '")' + this.getTabNames(), this.name2id_);
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
   * @param {!stack.ui.Route} route
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
   * @param {!stack.ui.Route} route
   */
  selectFail(name, route) {
    const message = `No route to "${name}" from /${route.matchedPath().join("/")}`;
    if (defaultFailTemplate_) {
      this.fail(name, route, defaultFailTemplate_, {
        name: name,
        matched: route.matchedPath(),
        code: 404,
        message: message,
      });
      return;
    }
    route.fail(this, message);
    const fail = this.getFailTab();
    fail.renderText(message);
    this.showTabInternal("__fail__", fail); // TODO: use 'name' here?
  }

  /**
   * Render a failed component, using the given soy template and data.
   * @param {string} name
   * @param {!stack.ui.Route} route
   * @param {?function(ARG_TYPES, ?Object<string, *>=):*|?function(ARG_TYPES, null=, ?Object<string, *>=):*} template The Soy template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @param {?Object=} opt_injectedData The injected data for the template.
   * @template ARG_TYPES
   */
  fail(name, route, template, opt_templateData, opt_injectedData) {
    const message = `No route to "${name}" from /${route.matchedPath()}`;
    route.fail(this, message);
    this.showError(template, opt_templateData, opt_injectedData);
  }

  /**
   * Render a failed component, using the given soy template and data.
   * @param {?function(ARG_TYPES, ?Object<string, *>=):*|?function(ARG_TYPES, null=, ?Object<string, *>=):*} template The Soy template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @param {?Object=} opt_injectedData The injected data for the template.
   * @template ARG_TYPES
   */
  showError(template, opt_templateData, opt_injectedData) {
    const fail = this.getFailTab();
    fail.renderTemplate(template, opt_templateData, opt_injectedData);
    this.showTabInternal("__fail__", fail);
  }

  /**
   * Get the special tab for routing failure.
   * @private
   * @return {!FailComponent}
   */
  getFailTab() {
    let tab = this.getTab("__fail__");
    if (!tab) {
      tab = this.addTab("__fail__", new FailComponent());
    } 
    return /** @type {!FailComponent} */(tab);
  }


  
  /**
   * Get the current tab.
   *
   * @return {?Component}
   */
  getCurrent() {
    if (this.current_) {
      return this.getTab(this.current_);
    } else {
      return null;
    }
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
  
}

class FailComponent extends Component {

  /**
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(opt_domHelper) {
    super(opt_domHelper);
  }

  /** 
   * Render the given fail message.
   * 
   * @param {?function(ARG_TYPES, ?Object<string, *>=):*|?function(ARG_TYPES, null=, ?Object<string, *>=):*} template The Soy template defining the element's content.
   * @param {ARG_TYPES=} opt_templateData The data for the template.
   * @param {?Object=} opt_injectedData The injected data for the template.
   * @template ARG_TYPES
   * */
  renderTemplate(template, opt_templateData, opt_injectedData) {
    soy.renderElement(this.getElement(), template, opt_templateData, opt_injectedData);
  }

  /** 
   * Render the given fail message 
   * 
   * @param {string} message
   * */
  renderText(message) {
    const el = this.getElementStrict();
    dom.removeChildren(el);
    dom.append(el, dom.createTextNode(message));
  }

}

/**
 * @param {?Function} t 
 */
Select.setDefaultFailTemplate = function(t) {
  defaultFailTemplate_ = t;
};

exports = Select;
