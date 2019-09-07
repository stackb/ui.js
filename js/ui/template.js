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
   * @param {!Object} args
   * @param {?Object=} opt_inject
   * @param {?goog.dom.DomHelper=} opt_domHelper
   */
  constructor(template, args, opt_inject, opt_domHelper) {
    super(opt_domHelper);

    /** @const @private */
    this.template_ = template;

    /** @const @private */
    this.args_ = args;

    /** @const @private */
    this.inject_ = opt_inject || undefined;
  }

  /**
   * @override
   */
  createDom() {
    this.setElementInternal(soy.renderAsElement(this.template_, this.args_, this.inject_));
  }

  /**
   * Re-render the component.
   * @param {!Object} args
   * @param {?Object=} opt_inject
   */
  renderElement(args, opt_inject) {
    soy.renderElement(this.getElementStrict(), this.template_, args, opt_inject);
  }

}

exports = Template;
