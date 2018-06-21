/**
 * @fileoverview
 */
goog.module('stack.ui.Tab');

const Select =  goog.require('stack.ui.Select');

/**
 * Select implemntation that takes a function for the 
 * failure case.
 */
class Tab extends Select {

  /**
   * @param {function(string,!stack.ui.Route)} failHandler
   * @param {?goog.dom.DomHelper=} opt_domHelper
   */
  constructor(failHandler, opt_domHelper) {
    super(opt_domHelper);

    /**
     * A mapping from tab name to component id.
     *
     * @const @private @type {function(string,!stack.ui.Route)}
     */
    this.failHandler_ = failHandler;

  }
  
  /**
   * @override
   */
  selectFail(name, route) {
    this.failHandler_(name, route);
  }
  
}

exports = Tab;
