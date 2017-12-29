goog.module('js.ui.route.Event');

const GEvent = goog.require('goog.events.Event');

class Event extends GEvent {

  /**
   * Event class for routing.
   *
   * @param {string} type Event Type.
   * @param {!js.ui.Route} target Reference to the initiating route.
   * @param {?js.ui.Component=} component The component relevant to the event.
   */
  constructor(type, target, component) {
    super(type, target);

    /**
     * @type {!js.ui.Route}
     */
    this.route = target;
    
    /**
     * @type {?js.ui.Component|undefined}
     */
    this.component = component;
  }

}

exports = Event;
