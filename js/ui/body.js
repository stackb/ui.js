goog.module('js.ui.Body');

const Home = goog.require('js.ui.Home');
const List = goog.require('js.ui.List');
const Menu = goog.require('js.ui.Menu');
const Select = goog.require('js.ui.Select');
const main = goog.require('soy.js.ui');
const soy = goog.require('goog.soy');

class Body extends Select {

  /**
   * @param {?goog.dom.DomHelper=} opt_domHelper
   */
  constructor(opt_domHelper) {
    super(opt_domHelper);
    this.addTab('home', new Home());
    this.addTab('search', new List());
  }
    
  /**
   * Modifies behavior to use touch rather than progress to
   * not advance the path pointer.
   * @override
   */
  go(route) {
    route.touch(this);
    if (route.atEnd()) {
      this.goHere(route);
    } else {
      this.goDown(route);
    }
  }

  /**
   * @override
   */
  goHere(route) {
    this.select('home', route.add('home'));
  }
  
  /**
   * @override
   */
  createDom() {
    var el = soy.renderAsElement(main.Body);
    //el.className = "ui basic segment";
    this.setElementInternal(el);
  }

  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    this.addChild(new Menu(this.getTabStrict('search'), this.getDomHelper()), true);
  }
 
}

exports = Body;
