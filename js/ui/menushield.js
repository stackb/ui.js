goog.module('stack.ui.MenuShield');

const Component = goog.require('goog.ui.Component');
const Container = goog.require('goog.ui.Container');
const Coordinate = goog.require('goog.math.Coordinate');
const Menu = goog.require('goog.ui.Menu');
const MenuButton = goog.require('goog.ui.MenuButton');
const SubMenu = goog.require('goog.ui.SubMenu');
const asserts = goog.require('goog.asserts');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const style = goog.require('goog.style');

class MenuShield extends Component {

  /**
   * @param {!Container} menuBar
   * @param {?Map<!Menu,!MenuButton>=} opt_menuButtons
   * @param {?dom.DomHelper=} opt_domHelper
   */
  constructor(menuBar, opt_menuButtons, opt_domHelper) {
    super(opt_domHelper);

    /**
     * @const @private
     * @type {!Container}
     */
    this.menuBar_ = menuBar;

    /**
     * A mapping from menu to the parent menubutton. 
     *
     * @const @private
     * @type {!Map<!Menu,!MenuButton>}
     */
    this.menuButtons_ = opt_menuButtons || new Map();
  }

  /**
   * Associate the given button to the menu
   * @param {!Menu} menu 
   * @param {!MenuButton} button 
   */
  addMenuButton(menu, button) {
    this.menuButtons_.set(menu, button);
  }

  /**
   * @override
   */
  createDom() {
    const el = this.dom_.createDom(dom.TagName.DIV, {
      'class': goog.getCssName('goog-menu-shield'),
      'style': 'display: none; height: 7px;'
    });
    this.setElementInternal(el);
  }


  /**
   * @override
   */
  enterDocument() {
    super.enterDocument();

    this.getHandler().listen(this.menuBar_, [
      Component.EventType.SHOW,
      Component.EventType.HIDE
    ], this.handleMenuEvent);
  }


  /**
   * @param {!events.Event} e
   */
  handleMenuEvent(e) {
    // this.dir(e.target, e.type + ': ' + goog.getUid(e.target));
    if (e.target instanceof Menu && !(e.target.getParent() instanceof SubMenu)) {
      // should only ever be SHOW or HIDE
      this.setShown(e.type === Component.EventType.SHOW);
      this.move(/** @type {!Menu} */(e.target));
    }
  }


  /**
   * @param {!Menu} menu
   */
  move(menu) {
    const shield = this.getElementStrict();
    const button = this.menuButtons_.get(menu);
    asserts.assert(button);

    const e = button.getElement();

    const size = style.getBorderBoxSize(e);
    const coords = style.getClientPosition(e);

    const w = size.width - 2;  // 1 for each border
    style.setWidth(shield, w);

    const x = coords.x + 1;                // height of shield is 7
    const y = coords.y + size.height - 4;  // height of shield is 7

    style.setPosition(shield, new Coordinate(x, y));
  }


  /**
   * @param {boolean} b
   */
  setShown(b) {
    style.setElementShown(this.getElement(), b);
  }

}

exports = MenuShield;
