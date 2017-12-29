goog.module('js.ui.App');

const Body = goog.require('js.ui.Body');
const BzlHistory = goog.require('js.ui.History');
const Component = goog.require('js.ui.Component');
const HEventType =  goog.require('goog.history.EventType');
const Keyboard = goog.require('js.ui.Keyboard');
const Promise_ =  goog.require('goog.Promise');
const Router =  goog.require('js.ui.Router');
const asserts =  goog.require('goog.asserts');
const dom =  goog.require('goog.dom');


class App extends Component {

  /**
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(opt_domHelper) {
    super(opt_domHelper);
    
    /**
     * A registry of components that can be accessed by a common name.
     * @private
     * @type {!Object<string,!Component>}
     */
    this.components_ = {};

    /** @private @type {!BzlHistory} */
    this.history_ = new BzlHistory();
    this.getHandler().listen(this.history_, HEventType.NAVIGATE, this.handleHistoryNavigate);
    this.registerDisposable(this.history_);
    /** @private @type {!Keyboard} */
    this.kbd_ = new Keyboard();
    this.registerDisposable(this.kbd_);

    /** @private @type {!Router} */
    var router = this.router_ = new Router(this, this.history_);
    this.registerDisposable(router);

    /** @private @type {!Component} */
    this.body_ = new Body(this.dom_);
    this.registerDisposable(this.body_);

    
  }

  start() {
    this.history_.setEnabled(true);
  }
  
  /**
   * @param {!goog.history.Event} e
   */
  handleHistoryNavigate(e) {
    //console.log('NAVIGATE2!', e);
    this.router_.go(e.token).thenCatch(err => {
      console.log(`Routing failure while nagivating to ${e.token}`);
    });
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

  /** @override */
  enterDocument() {
    super.enterDocument();
    //this.addChild(this.header_, true);
    //this.addChild(new Logo(), true);
    this.addChild(this.body_, true);
    //this.addChild(this.footer_, true);
    //this.resizeHeaderHeight();
  }

  resizeHeaderHeight() {
    //var headerSize = style.getSize(this.header_.getElementStrict());
    //var el = this.body_.getElement();
    //el.style.position = 'fixed';
    //el.style.mar = headerSize.height + 'px';
    //el.style.maxHeight = '100%';
    //el.style.overflow = 'auto';
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
    route.touch(this);
    route.progress(this);
    this.body_.go(route);
  }
  
  /** @param {!js.ui.Route} route */
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
   * @return {!Promise_<!js.ui.Route>}
   */
  route(path) {
    //console.log('App.route', path);
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
    delete this.components_;
  }

}

exports = App;
