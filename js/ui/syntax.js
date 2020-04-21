/**
 * @fileoverview
 */
goog.module('stack.ui.Syntax');

const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const { Component } = goog.require('stack.ui');

/**
 * A component that does prism.js syntax highlighting.
 */
class Syntax extends Component {

  /**
   * @param {string} language
   * @param {string=} opt_text
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(language, opt_text, opt_domHelper) {
    super(opt_domHelper);

    /** @private @type {string} */
    this.language_ = language;

    /** @private @type {string} */
    this.text_ = opt_text || "";
  }


  /**
   * @override
   */
  createDom() {
    const pre = this.getDomHelper().createDom(dom.TagName.PRE);
    const code = this.getDomHelper().createDom(dom.TagName.CODE, "language-" + this.language_, this.text_);
    dom.append(pre, code);
    this.setElementInternal(pre);
  }

  /** 
   * @return {!HTMLSpanElement}
   */
  getCodeElement() {
    return /** @type{!HTMLSpanElement} */(
      asserts.assertElement(
        /** @type{!HTMLElement} */(
          this.getElementStrict()
        ).firstElementChild
      )
    );
  }

  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();
    if (this.text_) {
      this.highlight(this.getCodeElement());
    }
  }


  /**
   * @param {?Element} el
   */
  highlight(el) {
    try {
      goog.global["hljs"]["highlightBlock"](el);
    } catch (err) {
      //console.warn("Highlighting failed", err);
    }
  }


  /** 
   * Update the text and re-highlight.
   *
   * @param {string} text
   */
  setText(text) {
    this.text_ = text;
    const code = this.getCodeElement();
    dom.setTextContent(code, text);
    if (text) {
      this.highlight(code);
    }
  }

}

exports = Syntax;
