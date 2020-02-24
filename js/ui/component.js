/**
 * @fileoverview
 */
goog.module('stack.ui.Component');

const BgColorTransform = goog.require('goog.fx.dom.BgColorTransform');
const ComponentEventType = goog.require('goog.ui.Component.EventType');
const GoogUiComponent = goog.require('goog.ui.Component');
const Route = goog.require('stack.ui.Route');
const asserts = goog.require('goog.asserts');
const easing = goog.require('goog.fx.easing');
const strings = goog.require('goog.string');
const style = goog.require('goog.style');

/**
 * A component that adds routing capabilities.
 */
class Component extends GoogUiComponent {

  /**
   * @param {?goog.dom.DomHelper=} opt_domHelper
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
      // } else {
      //   console.log('path: no name', current);
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
   * Navigate to the given route.  If the route has "at end", it means that the
   * current component is the terminal component to be rendered/shown; in this
   * case `.goHere(route)` will be called.  If the route has additional
   * component the `.goDown(route)` method will be called.
   *
   * If the route is not "in progress" (failed, cancelled, timed-out), this
   * method returns immediately.
   * 
   * @param {!Route} route
   */
  go(route) {
    if (!route.inProgress()) {
      console.log(`Aborting go route ${route.getPath()} (not in-progress)`, this);
      return;
    }
    route.progress(this);
    if (route.atEnd()) {
      this.goHere(route);
    } else {
      // console.warn(`Component ${this.getName()} going down to: "${route.peek()}"`);
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
    // console.warn(`Component ${this.getName()} failed at ${route.peek()}`);
    route.fail(this);
  }

  /**
   * @return {?stack.ui.Component}
   */
  parent() {
    return /** @type {?stack.ui.Component} */ (
      this.getParent()
    );
  }

  // /**
  //  * @override
  //  */
  // dispatchEvent(e) {
  //   console.log("dispatching event", e, this);


  //   var ancestorsTree, ancestor = this.getParentEventTarget();
  //   if (ancestor) {
  //     ancestorsTree = [];
  //     for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
  //       ancestorsTree.push(ancestor);
  //     }
  //   }

  //   console.log("ancestors tree", ancestorsTree);

  //   return super.dispatchEvent(e);
  // }

  // /**
  //  * Handle a keydown event.  Base implementation just propagates to parent
  //  * component.  Can be used to implement key handling. 
  //  * @param {!goog.events.BrowserEvent=} e
  //  */
  // handleKeyDown(e) {
  //   const parent = this.parent();
  //   if (parent) {
  //     parent.handleKeyDown(e);
  //   }
  // }

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
   * @return {?stack.ui.Component}
   */
  child(id) {
    return /** @type {?stack.ui.Component} */ (
      this.getChild(id)
    );
  }

  /**
   * @param {number} index
   * @return {!stack.ui.Component}
   */
  childAt(index) {
    return /** @type {!stack.ui.Component} */ (
      asserts.assertObject(this.getChildAt(index))
    );
  }

  /**
   * @param {string} id
   * @return {!stack.ui.Component}
   */
  strictchild(id) {
    return /** @type {!stack.ui.Component} */ (
      asserts.assertObject(this.getChild(id))
    );
  }

  /**
   * Return the root component.
   * 
   * @return {!stack.ui.Component}
   */
  getRoot() {
    /** @type {?stack.ui.Component} */
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
   * @param {?goog.events.EventHandler=} opt_eventHandler Optional event handler
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
    //style.backgroundOpacity = '0.3';
    style.backgroundPosition = 'center center';
    style.height = '100%';
  }

  /**
   * @return {?Array<!goog.ui.Control>}
   */
  getMenuItems() {
    return null;
  }

}

exports = Component;
