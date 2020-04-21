/**
 * @fileoverview
 */
goog.module('stack.ui.TabEvent');

const GoogEvent = goog.require('goog.events.Event');
const { Component } = goog.require('stack.ui');

/**
 * Custom event that signals a new tab child.
 */
class TabEvent extends GoogEvent {

  /**
   * Construct a new event
   * @param {string} eventName The name of the event
   * @param {string} name The name of the tab added/removed
   * @param {!Component} child The child added
   */
  constructor(eventName, name, child) {
    super(eventName);

    /** @public @const */
    this.name = name;

    /** @public @const */
    this.child = child;
  }
}

exports = TabEvent;
