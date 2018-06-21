/**
 * @fileoverview
 */
goog.module('stack.ui.Template');

const Component = goog.require('stack.ui.Component');
const soy = goog.require('goog.soy');

/**
 * A component that takes a soy template and optional args.
 */
class Template extends Component {

  /**
   * @param {!Function} template
   * @param {?Object=} opt_args
   * @param {?goog.dom.DomHelper=} opt_domHelper
   */
  constructor(template, opt_args, opt_domHelper) {
    super(opt_domHelper);

    /** @const @private @type {!Function} */
    this.template_ = template;

    /** @const @private @type {!Object|undefined} */
    this.args_ = opt_args || undefined;
  }

  /**
   * @override
   */
  createDom() {
    this.setElementInternal(soy.renderAsElement(this.template_, this.args_));
  }
  
}

exports = Template;
