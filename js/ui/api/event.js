goog.module('js.ui.api.Event');

const GEvent = goog.require('goog.events.Event');

class Event extends GEvent {

  /**
   * Event class for routing.
   *
   * @param {string} type Event Type.
   * @param {!js.ui.Api} target Reference to the initiating route.
   * @param {?string} message The component relevant to the event.
   */
  constructor(type, target, message) {
    super(type, target);

    /**
     * @public @type {?string}
     */
    this.message = message;
  }

}

exports = Event;
