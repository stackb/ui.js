
goog.module('stack.ui.ComponentTest');
goog.setTestOnly('stack.ui.ComponentTest');

const UiComponent = goog.require('stack.ui.Component');
const Route = goog.require('stack.ui.Route');
const classlist = goog.require('goog.dom.classlist');
const jsunit = goog.require('goog.testing.jsunit');
const testSuite = goog.require('goog.testing.testSuite');

testSuite({

  setUp: () => {
    console.log('****************************************************************', jsunit);
  },
  
  testName: () => {
    const c = new UiComponent();
    c.setName('foo');
    assertEquals('foo', c.getName());
  },

  testHide: () => {
    const c = new UiComponent();
    c.render(document.body);
    c.hide();
    assertEquals('none', c.getElement().style.display);
  },

  testShow: () => {
    const c = new UiComponent();
    c.render(document.body);
    c.hide();
    c.show();
    assertEquals('', c.getElement().style.display);
  },

  testLoading: () => {
    const c = new UiComponent();
    c.render(document.body);
    c.setLoading(true);
    assertTrue(classlist.contains(c.getElementStrict(), 'loading'));
    c.setLoading(false);
    assertFalse(classlist.contains(c.getElementStrict(), 'loading'));
  },

  testPath: () => {
    const parent = new UiComponent();
    parent.setName('foo');
    const child = new UiComponent();
    child.setName('bar');
    parent.addChild(child);
    const path = child.getPath();
    assertNotNull(path);
    assertEquals(2, path.length);
    assertEquals('foo', path[0]);
    assertEquals('bar', path[1]);
 },

  testRoute: () => {
    // The index will start at 0
    const route = new Route(['']);
    const c = new UiComponent();
    c.render(document.body); // why this needed?
    // starts off at 0
    assertEquals(0, route.index());
    c.go(route);
    // Last component matched
    assertEquals(c, route.get());
    // Peek looks at index position.  Should be undefined now.
    assertEquals(undefined, route.peek());
    // Should advance to 1
    assertEquals(1, route.index());
    // Should rest in done state.
    assertFalse(route.inProgress());
    assertFalse(route.didFail());
  },
  
});
