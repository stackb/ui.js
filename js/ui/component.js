/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
goog.module('stack.ui.Component');

const BgColorTransform = goog.require('goog.fx.dom.BgColorTransform');
const GoogUiComponent = goog.require('goog.ui.Component');
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
        path.push(current.getName());
      //} else {
        //console.log('path: no name', current);
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
   * @param {!stack.ui.Route} route
   */
  go(route) {
    //console.info('go ' + route.getPath(), this);
    route.progress(this);
    if (route.atEnd()) {
      this.goHere(route);
    } else {
      this.goDown(route);
    }
  }

  /**
   * @param {!stack.ui.Route} route
   */
  goHere(route) {
    this.show();
    route.done(this);
  }

  /**
   * @param {!stack.ui.Route} route
   */
  goDown(route) {
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
    style.backgroundOpacity = '0.3';
    style.backgroundPosition = 'center center';
    style.height = '100%';
  }

}

exports = Component;
