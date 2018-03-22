goog.module('stack.ui.Route');

const Event =  goog.require('stack.ui.route.Event');
const EventTarget = goog.require('goog.events.EventTarget');
const Promise_ = goog.require('goog.Promise');
const asserts = goog.require('goog.asserts');

/**
 * A route is a segment of paths and a collection of a components that
 * have traversed along it.
 */
class Route extends EventTarget {

  /**
   * @param {!Array<string>} path
   */
  constructor(path) {
    super();

    /** @private @type {!Array<!string>} */
    this.path_ = asserts.assertArray(path);

    /** @private @type {number} */
    this.index_ = 0;

    /** @private @type {!Array<!stack.ui.Component>} */
    this.progress_ = [];

    /** @private @type {string} */
    this.state_ = Route.EventType.PROGRESS;

    /** @private @type {string|undefined} */
    this.failReason_ = undefined;

    /** @private @type {!goog.promise.Resolver<!stack.ui.Route>} */
    this.resolver_ = Promise_.withResolver();

  }

  /**
   * @return {!Promise_<!Route>}
   */
  getPromise() {
    return this.resolver_.promise;
  }

  /**
   * @return {number}
   */
  index() {
    return this.index_;
  }

  /**
   * @return {!Array<string>}
   */
  path() {
    return this.path_;
  }

  /**
   * Add a path segment to the end of the route.
   * 
   * @param {string} segment
   * @return {!Route}
   */
  add(segment) {
    this.path_.push(segment);
    return this;
  }  
  
  /**
   * Get the indexed progress component or the last one if not set.
   *
   * @param {?number=} index
   * @return {?stack.ui.Component}
   */
  get(index) {
    index = goog.isNumber(index) ? index : this.index_ - 1;
    return this.progress_[index] || null;
  }

  /**
   * @return {string}
   */
  getPath() {
    return this.path_.join('/');
  }

  /**
   * @return {!Array<string>}
   */
  unmatchedPath() {
    return this.path_.slice(this.progress_.length);
  }

  /**
   * Return a slice of the original array corresponding to the
   * segments that matched (as determined by progress).
   *
   * @return {!Array<string>}
   */
  pathMatched() {
    return this.path_.slice(0, this.progress_.length);
  }

  // /** Peek at the next path segment.
  //  * @return {string}
  //  */
  // next() {
  //   return this.path_[this.index_ + 1];
  // }

  /** Get the current path segment.
   * @return {string}
   */
  peek() {
    return this.path_[this.index_];
  }

  /**
   * @return {boolean}
   */
  atEnd() {
    return this.index_ == this.path_.length;
  }

  /**
   * @return {boolean}
   */
  inProgress() {
    return this.state_ == Route.EventType.PROGRESS;
  }

  /**
   * @return {boolean}
   */
  didFail() {
    return this.state_ === Route.EventType.FAIL || this.state_ === Route.EventType.TIMEOUT;
  }

  /**
   * @return {string|undefined}
   */
  getFailReason() {
    return this.failReason_;
  }

  /**
   * @throws {Error}
   */
  assertInProgress() {
    //console.trace("checking in-progress");
    asserts.assert(this.inProgress(), 'Expected in-progress, but the route state was: ' + this.state_);
  }

  /**
   * Record a non-contributing hop along the path, used mainly
   * for debugging.
   * @param {!stack.ui.Component} component
   */
  touch(component) {
    //console.log('touch:', component);
    this.notifyEvent(Route.EventType.TOUCH, component);
  }

  /**
   * Trigger a timeout on the route.
   */
  timeout() {
    console.log('timeout:', this);
    this.state_ = Route.EventType.TIMEOUT;
    this.failReason_ = 'Timeout while navigating to ' + this.getPath();
    this.notifyEvent(Route.EventType.TIMEOUT, this.progress_[this.progress_.length - 1]);
    this.resolver_.reject(this);
  }

  /**
   * @param {!stack.ui.Component} component
   */
  progress(component) {
    //console.log('progress: in progress?', this.inProgress());
    this.assertInProgress();
    var index = this.index_++;
    this.progress_[index] = component;
    //console.log('progress made: ' + this.path_[index] + '=', component);
    component.show();
    this.notifyEvent(Route.EventType.PROGRESS, component);
  }

  /**
   * @param {!stack.ui.Component} component
   */
  done(component) {
    this.assertInProgress();
    this.state_ = Route.EventType.DONE;
    this.notifyEvent(Route.EventType.DONE, component);
    this.resolver_.resolve(this);
    //console.log('Done!', component);
  }

  /**
   * @param {!stack.ui.Component} component
   * @param {string=} opt_reason
   */
  fail(component, opt_reason) {
    this.assertInProgress();
    this.state_ = Route.EventType.FAIL;
    this.failReason_ = opt_reason || 'No route to ' + this.getPath();
    this.notifyEvent(Route.EventType.FAIL, component);
    this.resolver_.reject(this);
    //console.log('Fail!', component);
  }

  /**
   * @param {string} type
   * @param {?stack.ui.Component} component
   */
  notifyEvent(type, component) {
    this.dispatchEvent(new Event(type, this, component));
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    delete this.progress_;
  }

}

/**
 * @enum {string}
 */
Route.EventType = {
  DONE: 'done',
  FAIL: 'fail',
  PROGRESS: 'progress',
  TOUCH: 'touch',
  TIMEOUT: 'timeout'
};

exports = Route;
