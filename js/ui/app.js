goog.module('stack.ui.App');

const BzlHistory = goog.require('stack.ui.History');
const Component = goog.require('stack.ui.Component');
const HistoryEvent = goog.require('goog.history.Event');
const HistoryEventType = goog.require('goog.history.EventType');
const Injector = goog.require('stack.ui.Injector');
const Keyboard = goog.require('stack.ui.Keyboard');
const Promise_ = goog.require('goog.Promise');
const Route = goog.require('stack.ui.Route');
const Router = goog.require('stack.ui.Router');
const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const objects = goog.require('goog.object');


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

    /** @const @private @type {!BzlHistory} */
    this.history_ = new BzlHistory();
    this.getHandler().listen(this.history_, HistoryEventType.NAVIGATE, this.handleHistoryNavigate);
    this.registerDisposable(this.history_);

    /** @const @private @type {!Keyboard} */
    this.kbd_ = new Keyboard();
    this.registerDisposable(this.kbd_);

    /** @const @private @type {!Router} */
    var router = this.router_ = new Router(this, this.history_);
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
    // this.popup('', msg, {
    //   'position': 'top center',
    //   'variation': 'very wide basic',
    //   'offset': 30,
    //   'className': {
    //     'popup': 'ui popup ' + goog.getCssName('bg_yellow')
    //   }
    // });
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
   * @return {!Promise_<!Route>}
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
    // console.log('setLocation', path);
    this.history_.setLocation(path.join('/'));
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    objects.clear(this.components_);
  }

}

exports = App;
