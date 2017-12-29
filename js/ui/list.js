goog.module('js.ui.List');

const Component = goog.require('js.ui.Component');
const dom = goog.require('goog.dom');
const soy = goog.require('goog.soy');
const ui = goog.require('soy.js.ui');

class List extends Component {
  
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
    this.setElementInternal(soy.renderAsElement(ui.List));
  }

}

exports = List;
