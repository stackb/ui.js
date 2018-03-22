goog.module('stack.ui.Menu');

const Component = goog.require('stack.ui.Component');
const ComponentEventType = goog.require('goog.ui.Component.EventType');
const EventType = goog.require('goog.events.EventType');
const RouteEvent =  goog.require('stack.ui.route.Event');
const dom = goog.require('goog.dom');
const main = goog.require('soy.stack.ui');
const soy = goog.require('goog.soy');

class Menu extends Component {

  /**
   * @param {!Component} search
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(search, opt_domHelper) {
    super(opt_domHelper);

    /**
     * THe component where we put search results.
     * @private
     * @type {!Component}
     */
    this.search_ = search;

    /**
     * This is the <input> wrapped with <div class="ui input">
     * @private
     * @type {!HTMLInputElement}
     */
    this.inputElement_;
    
  }

  /**
   * @override
   */
  createDom() {
    var el = soy.renderAsElement(main.Menu);
    this.setElementInternal(el);
    this.inputElement_ = /** @type {!HTMLInputElement} */ (dom.getElementByClass('input', el).firstElementChild);
  }

  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    this.getHandler()
      .listen(this.inputElement_, EventType.CHANGE, this.handleInputChange)
      .listen(this.getApp().getRouter(), ComponentEventType.ACTION, this.handleRouterAction);
  }

  /**
   * @param {!goog.events.Event} e
   */
  handleInputChange(e) {
    this.handleSearchBegin();
  }

  
  /**
   * Before search happens.
   */
  handleSearchBegin() {
    this.search_.setLoading(true);
    this.search_.removeChildren(true).forEach(child => child.dispose());
  }
    


  /**
   * @param {!RouteEvent} e
   */
  handleRouterAction(e) {
    const path = e.route.path();
    if (path.length === 1) {
      this.inputElement_.focus();
    }
  }

  /**
   * @return {!stack.ui.App}
   */
  getApp() {
    return /** @type {!stack.ui.App} */ (this.getRoot());
  }
  
}


exports = Menu;
