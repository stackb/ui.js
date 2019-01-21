goog.provide('stack.ui.app.Event');
goog.provide('stack.ui.app.EventType');

goog.require('goog.events.Event');

/**
 * @public
 * @enum {string}
 */
stack.ui.app.EventType = {
  NOT_FOUND: 'not-found',
};


/**
 * application routing event.
 *
 * @param {string|!goog.events.EventId} type Event Type.
 * @param {!stack.ui.Route} route Reference to the route object that is the target of
 *     this event. 
 * @constructor
 * @extends {goog.events.Event}
 */
stack.ui.app.Event = function(type, route) {
    stack.ui.app.Event.base(this, 'constructor', type, route);

    /**
     * @public
     * @type {!stack.ui.Route}
     */
    this.route = route;
};
goog.inherits(stack.ui.app.Event, goog.events.Event);