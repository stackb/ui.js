goog.module('stack.ui.route.Event');

const GEvent = goog.require('goog.events.Event');

class Event extends GEvent {

  /**
   * Event class for routing.
   *
   * @param {string} type Event Type.
   * @param {!stack.ui.Route} target Reference to the initiating route.
   * @param {?stack.ui.Component=} component The component relevant to the event.
   */
  constructor(type, target, component) {
    super(type, target);

    /**
     * @public @const @type {!stack.ui.Route}
     */
    this.route = target;
    
    /**
     * @public @const @type {?stack.ui.Component|undefined}
     */
    this.component = component;
  }

}

exports = Event;
