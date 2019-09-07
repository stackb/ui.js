/**
 * @fileoverview
 */
goog.module('stack.ui.Router');

const Component = goog.require('stack.ui.Component');
const ComponentEventType = goog.require('goog.ui.Component.EventType');
const EventHandler = goog.require('goog.events.EventHandler');
const EventTarget = goog.require('goog.events.EventTarget');
const History_ =  goog.require('stack.ui.History');
const Promise_ =  goog.require('goog.Promise');
const Route =  goog.require('stack.ui.Route');
const RouteEvent =  goog.require('stack.ui.route.Event');
const asserts =  goog.require('goog.asserts');

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
     * @const @private
     * @type {!EventHandler}
     */
    this.handler_ = new EventHandler(this);

    /**
     * The root component to start.
     * @const @private
     * @type {!Component}
     */
    this.root_ = root;

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
  
  /**
   * Get a component if registered.
   *i
   * @param {string} path
   * @return {!Promise_<!Route>}
   */
  go(path) {
    //console.log('go: ' + path);
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
    }, 100000);

    return route.getPromise();
  }

  /** @param {!RouteEvent} e */
  handleProgress(e) {
    this.dispatchEvent(e);
    //console.log(e.target.index() + '. Progress ' + e.target.pathMatched(), e.component);
  }

  /** @param {!RouteEvent} e */
  handleDone(e) {
    this.dispatchEvent(e);
    //console.log('Done! ' + e.target.matchedPath(), e.component);
    this.unlistenRoute();
  }

  /** @param {!RouteEvent} e */
  handleFail(e) {
    this.dispatchEvent(e);
    const target = /** @type {!Route} */(e.target);
    console.warn('Route Failed: ' + target.getFailReason());
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
    handler.unlisten(route, Route.EventType.TIMEOUT, this.handleTimeout, false, this);
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    delete this.route_;
  }

}

exports = Router;
