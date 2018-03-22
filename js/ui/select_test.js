goog.module('stack.ui.SelectTest');
goog.setTestOnly('stack.ui.SelectTest');

const Route = goog.require('stack.ui.Route');
const Select = goog.require('stack.ui.Select');
const jsunit = goog.require('goog.testing.jsunit');
const testSuite = goog.require('goog.testing.testSuite');

testSuite({

  setUp: () => {
    assertNotNull(jsunit);
  },
  
  testRouteChild: () => {
    // The index will start at 0
    const route = new Route(['', 'foo', 'bar']);
    const root = new Select();
    const parent = new Select();
    const child = new Select();
    root.addTab('foo', parent);
    parent.addTab('bar', child);
    root.render(document.body); // why this needed?
    // starts off at 0
    assertEquals(0, route.index());
    root.go(route);
    // Last component matched should be child
    assertEquals(root, route.get(0));
    assertEquals(parent, route.get(1));
    assertEquals(child, route.get(2));
    // Should advance to 1
    assertEquals(3, route.index());
    // Should rest in done state.
    assertFalse(route.inProgress());
    assertFalse(route.didFail());
  },
  
});
