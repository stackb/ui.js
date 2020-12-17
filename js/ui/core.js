/**
 * @fileoverview
 */
goog.module('stack.ui');

const BgColorTransform = goog.require('goog.fx.dom.BgColorTransform');
const ComponentEventType = goog.require('goog.ui.Component.EventType');
const EventHandler = goog.require('goog.events.EventHandler');
const EventTarget = goog.require('goog.events.EventTarget');
const GoogPromise = goog.require('goog.Promise');
const GoogUiComponent = goog.require('goog.ui.Component');
const GoogUiControl = goog.require('goog.ui.Control');
const HistoryEvent = goog.require('goog.history.Event');
const HistoryEventType = goog.require('goog.history.EventType');
const History_ = goog.require('stack.ui.History');
const Injector = goog.require('stack.ui.Injector');
const Keyboard = goog.require('stack.ui.Keyboard');
const Resolver = goog.require('goog.promise.Resolver');
const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const easing = goog.require('goog.fx.easing');
const events = goog.require('goog.events');
const objects = goog.require('goog.object');
const strings = goog.require('goog.string');
const style = goog.require('goog.style');


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

        /** @const @private @type {!Array<!string>} */
        this.path_ = asserts.assertArray(path);

        /** @private @type {number} */
        this.index_ = 0;

        /** @private @type {!Array<!Component>} */
        this.progress_ = [];

        /** @private @type {string} */
        this.state_ = RouteEventType.PROGRESS;

        /** @private @type {string|undefined} */
        this.failReason_ = undefined;

        /** @const @private @type {!Resolver<!Route>} */
        this.resolver_ = GoogPromise.withResolver();

    }

    /**
     * @return {!GoogPromise<!Route>}
     */
    getPromise() {
        return this.resolver_.promise;
    }

    /**
     * @return {number}
     */
    size() {
        return this.path_.length;
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
     * Get the path segment at the given index.
     *
     * @param {number} index
     * @return {?string}
     */
    at(index) {
        return this.path_[index] || null;
    }

    /**
     * Get the path segment at the given index.
     *
     * @param {number} n
     * @return {!Route}
     */
    advance(n) {
        this.index_ += n;
        return this;
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
     * @return {?Component}
     */
    get(index) {
        index = typeof index === "number" ? index : this.index_ - 1;
        return this.progress_[index] || null;
    }

    /**
     * @return {string}
     */
    getPath() {
        return this.path_.join('/');
    }

    /**
     * @param {?number=} opt_max
     * @return {!Array<string>}
     */
    unmatchedPath(opt_max) {
        const size = this.size();
        const end = typeof opt_max === "number" ? this.index_ + opt_max : size;
        return this.path_.slice(this.index_, end);
    }

    /**
     * Return a slice of the original array corresponding to the
     * segments that matched (as determined by progress).
     *
     * @return {!Array<string>}
     */
    matchedPath() {
        return this.path_.slice(0, this.index_);
    }

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
        return this.index_ >= this.path_.length;
    }

    /**
     * @return {boolean}
     */
    inProgress() {
        return this.state_ == RouteEventType.PROGRESS;
    }

    /**
     * @return {boolean}
     */
    didFail() {
        return this.state_ === RouteEventType.FAIL || this.state_ === RouteEventType.TIMEOUT;
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
        asserts.assert(this.inProgress(), 'Expected in-progress, but the route state was: ' + this.state_);
    }

    /**
     * Record a non-contributing hop along the path, used mainly
     * for debugging.
     * @param {!Component} component
     */
    touch(component) {
        this.notifyEvent(RouteEventType.TOUCH, component);
    }

    /**
     * Trigger a timeout on the route.
     */
    timeout() {
        this.state_ = RouteEventType.TIMEOUT;
        this.failReason_ = 'Timeout while navigating to ' + this.getPath();
        this.notifyEvent(RouteEventType.TIMEOUT, this.progress_[this.progress_.length - 1]);
        this.resolver_.reject(this);
    }

    /**
     * @param {!Component} component
     */
    progress(component) {
        this.assertInProgress();
        var index = this.index_++;
        this.progress_[index] = component;
        component.show();
        this.notifyEvent(RouteEventType.PROGRESS, component);
    }

    /**
     * @param {!Component} component
     */
    done(component) {
        this.state_ = RouteEventType.DONE;
        this.notifyEvent(RouteEventType.DONE, component);
        this.resolver_.resolve(this);
    }

    /**
     * @param {!Component} component
     * @param {string=} opt_reason
     */
    fail(component, opt_reason) {
        this.state_ = RouteEventType.FAIL;
        this.failReason_ = opt_reason || 'No route to ' + this.getPath();
        this.notifyEvent(RouteEventType.FAIL, component);
        this.resolver_.reject(this);
    }

    /**
     * @param {string} type
     * @param {?Component} component
     */
    notifyEvent(type, component) {
        this.dispatchEvent(new RouteEvent(type, this, component));
    }

    /** @override */
    disposeInternal() {
        super.disposeInternal();
        delete this.progress_;
    }

}

exports.Route = Route;

/**
 * @enum {string}
 */
const RouteEventType = {
    DONE: 'done',
    FAIL: 'fail',
    PROGRESS: 'progress',
    TOUCH: 'touch',
    TIMEOUT: 'timeout'
};

exports.RouteEventType = RouteEventType;

/**
 * Subclass of Event that holds a reference to the route in plays.
 */
class RouteEvent extends events.Event {

    /**
     * Event class for routing.
     *
     * @param {string} type Event Type.
     * @param {!Route} target Reference to the initiating route.
     * @param {?Component=} component The component relevant to the event.
     */
    constructor(type, target, component) {
        super(type, target);

        /**
         * @type {!Route}
         */
        this.route = target;

        /**
         * @type {?Component|undefined}
         */
        this.component = component;
    }

}

exports.RouteEvent = RouteEvent;


/**
 * Manages a current route in-progress.  Fires
 * goog.ui.Component.EventType.ACTION when a now route is created.
 */
class Router extends EventTarget {

    /**
     * @param {!Component} root
     */
    constructor(root) {
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

        /**
         * Strict mode means that an existing route that hasn't finished yet will fail a new attempt.
         * @private
         * @type {boolean}
         */
        this.strict_ = true;
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
     * Set the strict mode
     * @param {boolean} b 
     */
    setStrict(b) {
        this.strict_ = b;
    }

    /**
     * Get a component if registered.
     *i
     * @param {string} path
     * @return {!GoogPromise<!Route>}
     */
    go(path) {
        //console.log('go: ' + path);
        asserts.assertString(path, 'Routing path must be a string');
        if (this.strict_ && this.route_) {
            console.warn(`cannot route to ${path} due to existing route "${this.route_.matchedPath()}" --> "${this.route_.unmatchedPath()}"`);
            return GoogPromise.reject(
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
            if (route.inProgress()) {
                route.timeout();
            }
        }, 100000);

        return route.getPromise();
    }

    /** @param {!RouteEvent} e */
    handleProgress(e) {
        this.dispatchEvent(e);
    }

    /** @param {!RouteEvent} e */
    handleDone(e) {
        this.dispatchEvent(e);
        this.unlistenRoute();
    }

    /** @param {!RouteEvent} e */
    handleFail(e) {
        this.dispatchEvent(e);
        this.unlistenRoute();
    }

    /** @param {!RouteEvent} e */
    handleTimeout(e) {
        this.unlistenRoute();
    }

    /** @param {!Route} route */
    listenRoute(route) {
        var handler = this.handler_;
        handler.listenWithScope(route, RouteEventType.PROGRESS, this.handleProgress, false, this);
        handler.listenWithScope(route, RouteEventType.DONE, this.handleDone, false, this);
        handler.listenWithScope(route, RouteEventType.FAIL, this.handleFail, false, this);
        handler.listenWithScope(route, RouteEventType.TIMEOUT, this.handleTimeout, false, this);
        this.route_ = route;
    }

    unlistenRoute() {
        var route = this.route_;
        this.route_ = null;
        var handler = this.handler_;
        handler.unlisten(route, RouteEventType.PROGRESS, this.handleProgress, false, this);
        handler.unlisten(route, RouteEventType.DONE, this.handleDone, false, this);
        handler.unlisten(route, RouteEventType.FAIL, this.handleFail, false, this);
        handler.unlisten(route, RouteEventType.TIMEOUT, this.handleTimeout, false, this);
    }

    /** @override */
    disposeInternal() {
        super.disposeInternal();
        delete this.route_;
    }

}

exports.Router = Router;


/**
 * A component that adds routing capabilities.
 */
class Component extends GoogUiComponent {

    /**
     * @param {?dom.DomHelper=} opt_domHelper
     */
    constructor(opt_domHelper) {
        super(opt_domHelper);

        /** @private @type {?string} */
        this.name_ = null;

        /** @private @type {?BgColorTransform} */
        this.fx_ = null;
    }

    /**
     * @param {string} name
     */
    setName(name) {
        this.name_ = name;
    }

    /**
     * @return {?string}
     */
    getName() {
        return this.name_;
    }

    /**
     * @param {string} name
     * @return {!Node}
     */
    getComponentLabel(name) {
        if (name) {
            name = strings.capitalize(name);
        }
        return this.getDomHelper().createTextNode(name);
    }

    /**
     * @return {!Array<string>}
     */
    getPath() {
        var current = this;
        var path = [];
        while (current) {
            var name = current.getName();
            if (name) {
                path.push(name);
            }
            current = current.parent();
        }
        path.reverse();
        return path;
    }

    /**
     * @return {string}
     */
    getPathUrl() {
        return this.getPath().join('/');
    }

    /**
     * @param {!Route} route
     */
    go(route) {
        route.progress(this);
        if (route.atEnd()) {
            this.goHere(route);
        } else {
            this.goDown(route);
        }
    }

    /**
     * @param {!Route} route
     */
    goHere(route) {
        this.show();
        route.done(this);
    }

    /**
     * @param {!Route} route
     */
    goDown(route) {
        route.fail(this);
    }

    /**
     * @return {?Component}
     */
    parent() {
        return /** @type {?Component} */ (
            this.getParent()
        );
    }

    /**
     * Callback function that bubbles up the active component along the component
     * hairarachy. 
     * @param {!Component} target
     */
    handleComponentActive(target) {
        const parent = this.parent();
        if (parent) {
            parent.handleComponentActive(target);
        }
    }

    /**
     * @param {string} id
     * @return {?Component}
     */
    child(id) {
        return /** @type {?Component} */ (
            this.getChild(id)
        );
    }

    /**
     * @param {number} index
     * @return {!Component}
     */
    childAt(index) {
        return /** @type {!Component} */ (
            asserts.assertObject(this.getChildAt(index))
        );
    }

    /**
     * @param {string} id
     * @return {!Component}
     */
    strictchild(id) {
        return /** @type {!Component} */ (
            asserts.assertObject(this.getChild(id))
        );
    }

    /**
     * Return the root component.
     * 
     * @return {!Component}
     */
    getRoot() {
        /** @type {?Component} */
        let current = this;
        while (current) {
            if (!current.parent()) {
                return current;
            }
            current = current.parent();
        }
        throw new ReferenceError('Root reference not available');
    }

    /**
     * @return {!stack.ui.App}
     */
    getApp() {
        return /** @type {!stack.ui.App} */ (this.getRoot());
    }

    /**
     * Default is no-op.
     */
    focus() {
    }

    /**
     * Show this component.
     */
    show() {
        style.setElementShown(this.getShowHideElement(), true);
        this.dispatchEvent(ComponentEventType.SHOW);
    }

    /**
     * Flash this component.
     */
    flash() {
        style.setElementShown(this.getShowHideElement(), true);
    }

    /**
     * Hide this component.
     */
    hide() {
        style.setElementShown(this.getShowHideElement(), false);
        this.dispatchEvent(ComponentEventType.HIDE);
    }

    /**
     * @return {!Element}
     */
    getShowHideElement() {
        return this.getElementStrict();
    }

    /**
     * @param {!Array<number>=} opt_start 3D Array for RGB of start color.
     * @param {!Array<number>=} opt_end 3D Array for RGB of end color.
     * @param {number=} opt_time Length of animation in milliseconds.
     * @param {?Function=} opt_accel Acceleration function, returns 0-1 for inputs 0-1.
     * @param {?Element=} opt_element Dom Node to be used in the animation.
     * @param {?events.EventHandler=} opt_eventHandler Optional event handler
     *     to use when listening for events.
     */
    bgColorFadeIn(opt_start, opt_end, opt_time, opt_accel, opt_element, opt_eventHandler) {
        var fx = this.fx_;
        if (fx) {
            fx.stop();
            fx.dispose();
        }

        var start = opt_start || [128, 128, 128];
        var end = opt_end || [256, 256, 256];
        var time = opt_time || 250;
        var accel = opt_accel || easing.easeOutLong;
        var element = opt_element || asserts.assertElement(this.getContentElement());

        fx = this.fx_ =
            new BgColorTransform(element, start, end, time, accel);

        fx.play();
    }

    /**
     * @param {string} src
     */
    setBackgroundImage(src) {
        var style = this.getContentElement().style;
        var url = `url(${src})`;
        style.backgroundImage = url;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center center';
        style.height = '100%';
    }

    /**
     * @return {?Array<!GoogUiControl>}
     */
    getMenuItems() {
        return null;
    }

}

exports.Component = Component;

class App extends Component {

    /**
     * @param {?dom.DomHelper=} opt_domHelper
     */
    constructor(opt_domHelper) {
        super(opt_domHelper);

        /**
         * @const @private
         * @type {!Injector}
         */
        this.injector_ = new Injector();

        /**
         * A registry of components that can be accessed by a common name.
         * @const @private
         * @type {!Object<string,!Component>}
         */
        this.components_ = {};

        /** @const @private @type {!History_} */
        this.history_ = new History_();
        this.getHandler().listen(this.history_, HistoryEventType.NAVIGATE, this.handleHistoryNavigate);
        this.registerDisposable(this.history_);

        /** @const @private @type {!Keyboard} */
        this.kbd_ = new Keyboard();
        this.registerDisposable(this.kbd_);

        /** @const @private @type {!Router} */
        var router = this.router_ = new Router(this);
        this.registerDisposable(router);
    }

    start() {
        this.history_.setEnabled(true);
    }

    /**
     * @param {!HistoryEvent} e
     */
    handleHistoryNavigate(e) {
        this.router_.go(e.token).thenCatch(err => {
            console.warn(`Routing failure while nagivating to ${e.token}`);
        });
    }

    /**
     * @param {!Component} c
     * @param {!boolean} b
     */
    setLoading(c, b) {
    }

    /**
     * @return {!Keyboard}
     */
    getKbd() {
        return this.kbd_;
    }

    /**
     * @return {!Router}
     */
    getRouter() {
        return this.router_;
    }

    /**
     * @return {!Injector}
     */
    getInjector() {
        return this.injector_;
    }

    /**
     * @param {string} msg
     */
    notifyError(msg) {
        console.error(msg);
    }

    /**
     * Register a component, only required if it wants to expose itself
     * via the main app registry.
     *
     * @param {string} name
     * @param {!Component} c
     */
    registerComponent(name, c) {
        var map = this.components_;
        if (map[name]) {
            throw new Error('Duplicate component registration: ' + name);
        }
        map[name] = c;
    }

    /**
     * Get a component if registered.
     *
     * @param {string} name
     * @return {!Component}
     */
    getComponent(name) {
        return asserts.assertObject(this.components_[name]);
    }

    /** @override */
    go(route) {
        //route.touch(this);
        super.go(route);
    }

    /** @param {!Route} route */
    handle404(route) {
        this.notifyError("404 (Not Found): " + route.getPath());
    }

    /**
     * Get the header component.
     * @return {!Component}
     */
    getHeader() {
        return this.getComponent('header');
    }

    /**
     * Route to the given path.  This is delegated to the router, which
     * will loopback on this object to the go() method.
     *
     * @param {string} path
     * @return {!GoogPromise<!Route>}
     */
    route(path) {
        return this.router_.go(path).thenCatch(err => {
            console.log(`Routing failure while routing to ${path}`);
        });
    }

    /**
     * @param {!Array<string>} path
     */
    setLocation(path) {
        //console.log('setLocation', path);
        this.history_.setLocation(path.join('/'));
    }

    /** @override */
    disposeInternal() {
        super.disposeInternal();
        objects.clear(this.components_);
    }

}

exports.App = App;

