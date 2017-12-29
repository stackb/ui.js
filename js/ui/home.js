goog.module('js.ui.Home');

const Component = goog.require('js.ui.Component');
const dom = goog.require('goog.dom');
const main = goog.require('soy.js.ui');
const soy = goog.require('goog.soy');

class Home extends Component {
  
  /**
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(opt_domHelper) {
    super(opt_domHelper);
  }
  
  /**
   * @override
   */
  createDom() {
    var el = soy.renderAsElement(main.Home);
    this.setElementInternal(el);
  }
    
}

exports = Home;
