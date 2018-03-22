/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
goog.module('stack.ui.Router');

const Component = goog.require('stack.ui.Component');
const ComponentEventType = goog.require('goog.ui.Component.EventType');
const EventHandler = goog.require('goog.events.EventHandler');
const EventTarget = goog.require('goog.events.EventTarget');
//const HEvent =  goog.require('stack.ui.history.Event');
//const HEventType =  goog.require('goog.history.EventType');
const History_ =  goog.require('stack.ui.History');
const Promise_ =  goog.require('goog.Promise');
const Route =  goog.require('stack.ui.Route');
const RouteEvent =  goog.require('stack.ui.route.Event');
const asserts =  goog.require('goog.asserts');
//const events =  goog.require('goog.events');
//const strings =  goog.require('goog.string');

/**
 * Manages a current route in-progress.  Fires
 * goog.ui.Component.EventType.ACTION when a now route is created.
 */
class Router extends EventTarget {

  /**
   * @param {!Component} root
   * @param {!History_} history
   */
  constructor(root, history) {
    super();

    /**
     * @private
     * @type {!EventHandler}
     */
    this.handler_ = new EventHandler(this);

    /**
     * The root component to start.
     * @private
     * @type {!Component}
     */
    this.root_ = root;

    // /**
    //  * The root component to start.
    //  * @private
    //  * @type {!Object<!History_>}
    //  */
    // this.history_ = history;
    // //events.listen(this.history_, HEventType.NAVIGATE, this.handleHistoryNavigate.bind(this));

    /**
     * A route in-progress.
     * @private
     * @type {?Route}
     */
    this.route_ = null;
    
  }

  /**
   * Get the current route if it exists.
   *
   * @return {?Route}
   */
  getCurrentRoute() {
    return this.route_;
  }

  // /**
  //  * Go to the current window location.
  //  * @return {!Promise_<!Route>}
  //  */
  // goWindowLocation() {
  //   var loc = window.location.pathname;
  //   if (strings.startsWith(loc, '/')) {
  //     loc = loc.substring(1);
  //   }
  //   return this.route(loc);
  // }

  // /**
  //  * Route to the given path
  //  * @param {string} path
  //  * @return {!Promise_<!Route>} 
  //  */
  // route(path) {
  //   console.log('route: ' + path);
  //   asserts.assertString(path, 'Routing path must be a string');
  //   if (this.route_) {
  //     console.warn(`cannot route to ${path} due to existing route`, this.route_);
  //     return Promise_.reject(
  //       'Already routing to ' + this.route_.getPath()
  //     );
  //   }

  //   // Remove empty path segments
  //   const list = path.split('/').filter(s => s.trim() !== '');
  //   list.unshift(''); // prepend empty segment for the root component to consume
  //   var route = new Route(list);

  //   this.history_.setToken(list.join("/"));
  //   return route.getPromise();
  // }

  
  /**
   * Get a component if registered.
   *i
   * @param {string} path
   * @return {!Promise_<!Route>}
   */
  go(path) {
    console.log('go: ' + path);
    asserts.assertString(path, 'Routing path must be a string');
    if (this.route_) {
      console.warn(`cannot route to ${path} due to existing route`, this.route_);
      return Promise_.reject(
        'Already routing to ' + this.route_.getPath()
      );
    }

    // Remove empty path segments
    const list = path.split('/').filter(s => s.trim() !== '');
    list.unshift(''); // prepend empty segment for the root component to consume
    var route = new Route(list);
    this.listenRoute(route);

    this.dispatchEvent(new RouteEvent(
      ComponentEventType.ACTION,
      route
    ));

    this.root_.go(route);

    // Set a backup timer to reset the route if not completed in time.
    setTimeout(() => {
      //console.log('Checking timeout', route);
      if (route.inProgress()) {
        route.timeout();
      }
    }, 10000);

    return route.getPromise();
  }

  /** @param {!RouteEvent} e */
  handleProgress(e) {
    console.log(e.target.index() + '. Progress ' + e.target.pathMatched(), e.component);
  }

  /** @param {!RouteEvent} e */
  handleDone(e) {
    console.log('Done! ' + e.target.pathMatched(), e.component);
    this.unlistenRoute();
  }

  /** @param {!RouteEvent} e */
  handleFail(e) {
    console.warn('Route Failed: ' + e.target.getFailReason());
    this.unlistenRoute();
  }

  /** @param {!RouteEvent} e */
  handleTimeout(e) {
    console.warn('Route Timeout', e);
    this.unlistenRoute();
  }

  /** @param {!Route} route */
  listenRoute(route) {
    var handler = this.handler_;
    handler.listenWithScope(route, Route.EventType.PROGRESS, this.handleProgress, false, this);
    handler.listenWithScope(route, Route.EventType.DONE, this.handleDone, false, this);
    handler.listenWithScope(route, Route.EventType.FAIL, this.handleFail, false, this);
    handler.listenWithScope(route, Route.EventType.TIMEOUT, this.handleTimeout, false, this);
    this.route_ = route;
  }

  unlistenRoute() {
    var route = this.route_;
    this.route_ = null;
    var handler = this.handler_;
    handler.unlisten(route, Route.EventType.PROGRESS, this.handleProgress, false, this);
    handler.unlisten(route, Route.EventType.DONE, this.handleDone, false, this);
    handler.unlisten(route, Route.EventType.FAIL, this.handleFail, false, this);
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    delete this.route_;
  }

}

exports = Router;
