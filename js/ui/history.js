/**
 * @fileoverview
 */
goog.module('stack.ui.History');

const EventTarget = goog.require('goog.events.EventTarget');
const EventType = goog.require('goog.events.EventType');
// const HEvent =  goog.require('stack.ui.history.Event');
const HistoryEvent = goog.require('goog.history.Event');
const HistoryEventType = goog.require('goog.history.EventType');
const Html5History = goog.require('goog.history.Html5History');
const TagName = goog.require('goog.dom.TagName');
const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const strings = goog.require('goog.string');

/**
 * Maintains the history and listens for <a> click events. Fires a
 * 'action' event if the anchor hash matches '#/'.
 */
class History extends EventTarget {

  /**
   * Create a new history object.
   */
  constructor() {
    super();

    /** @const @private @type {?string} */
    this.current_ = null;

    /** @const @private @type {!Html5History} */
    var history = this.history_ = new Html5History();
    history.setUseFragment(false);

    events.listen(history, HistoryEventType.NAVIGATE, this.handleNavigate.bind(this));
    events.listen(goog.global.document, EventType.CLICK, this.handleDocumentClick.bind(this));
  }

  /**
   * @param {boolean} b
   */
  setEnabled(b) {
    this.history_.setEnabled(b);
  }

  /**
   * @param {!events.BrowserEvent} e
   */
  handleDocumentClick(e) {
    //console.log("history; click!");

    // Element that was clicked could be a child of of the <a>, so
    // look up through the ancestry chain.
    let anchor = /** @type {?HTMLAnchorElement} */ (
      dom.getAncestor(asserts.assertElement(e.target),
        el => el instanceof HTMLElement && el.tagName === TagName.A.toString(),
        true)
    );
    if (!anchor) {
      return;
    }
    let hash = anchor.hash;
    if (!hash) {
      return;
    }
    if (!strings.startsWith(hash, '#/')) {
      return;
    }
    e.preventDefault();
    // e.stopPropagation();

    if (e.ctrlKey) {
      const href = anchor.href.replace("/#/", "/");
      window.open(href, "_blank");
      return;
    }
    hash = hash.substring(2);
    //this.history_.replaceToken(hash);
    //this.replaceToken(hash);
    //if (!hash.startsWith("/")) {
    //  hash = window.location.href + "/" + hash;
    //}

    //this.history_.setToken(hash);
    this.setLocation(hash);
  }

  /**
   * @param {string} token
   */
  replaceToken(token) {
    console.log('Replace token', token);
    this.history_.replaceToken(token);
  }

  /**
   * @param {string} token
   */
  setLocation(token) {
    this.history_.setToken(token);
  }

  /**
   * @param {!HistoryEvent} e
   */
  handleNavigate(e) {
    var target = this.history_.getToken();
    // target = decodeURIComponent(target);
    //console.log(`handleNavigate target = "${target}", token="${this.history_.getToken()}"`);
    if (target != this.current_) {
      this.dispatchEvent(e);
    } else {
      console.log('Skipping navigate (no difference)', target);
    }
  }

  /**
   * @override
   */
  disposeInternal() {
    super.disposeInternal();
    this.history_.dispose();
  }

}

exports = History;
