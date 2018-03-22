/**
 * @fileoverview
 */
goog.module('stack.ui.history.Event');

const GoogEvent =  goog.require('goog.events.Event');

/**
 * History Event object.
 */
class HEvent extends GoogEvent {

  /**
   * @param {string} eventType
   * @param {string} path
   */
  constructor(eventType, path) {
    super(eventType);
    /** @public @type {string} */
    this.path = path;
  }
  
}

exports = HEvent;
