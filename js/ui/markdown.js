/**
 * @fileoverview
 */
goog.module('stack.ui.Markdown');

const Component = goog.require('stack.ui.Component');
const dom = goog.require('goog.dom');

/**
 * A template that does marked rendering from a soy template.
 */
class Markdown extends Component {

  /**
   * @param {?string=} opt_text
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(opt_text, opt_domHelper) {
    super(opt_domHelper);

    /** @private @type {string} */
    this.text_ = opt_text || "";
  }

  /**
   * @override
   */
  createDom() {
    this.setElementInternal(this.getDomHelper().createDom(dom.TagName.DIV, 'markdown-body'));
  }
  
  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    this.renderMarkdown();
  }

  /**
   * @param {string} text
   */
  setText(text) {
    this.text_ = text;
    if (this.isInDocument()) {
      this.renderMarkdown();
    }
  }
  
  
  /**
   * Convert text to markdown and set as innerHTML
   * @suppress {reportUnknownTypes}
   */
  renderMarkdown() {
    const el = /** @type{!HTMLElement} */(this.getElementStrict());
    try {
      const options = {
        'highlight': (code, lang) => {
          return goog.global['hljs']['highlightAuto'](code)['value'];
        },
      };
      el.innerHTML = goog.global["marked"](this.text_, options);
    } catch (err) {
      console.warn('markdown error', err);
    }
  }
  
}

exports = Markdown;
