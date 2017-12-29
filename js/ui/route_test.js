goog.module('js.ui.RouteTest');
goog.setTestOnly('js.ui.RouteTest');

const Route = goog.require('js.ui.Route');
const Select = goog.require('js.ui.Select');
const jsunit = goog.require('goog.testing.jsunit');
const testSuite = goog.require('goog.testing.testSuite');

testSuite({

  setUp: () => {
    assertNotNull(jsunit);
  },
  
  testRouteChildOk: () => {
    const route = new Route(['', 'foo', 'bar']);
    const root = new Select();
    const parent = new Select();
    const child = new Select();
    root.addTab('foo', parent);
    parent.addTab('bar', child);
    root.render(document.body); // why this needed?

    assertEquals(0, route.index());
    root.go(route);

    assertEquals(root, route.get(0));
    assertEquals(parent, route.get(1));
    assertEquals(child, route.get(2));
    assertEquals(3, route.index());
    assertFalse(route.inProgress());
    assertFalse(route.didFail());
  },

  testRouteChildNotOk: () => {
    const route = new Route(['', 'foo', 'nope']);
    const root = new Select();
    const parent = new Select();
    const child = new Select();
    root.addTab('foo', parent);
    parent.addTab('bar', child);
    //root.render(document.body); 
    assertNotNull(route);
    assertEquals(0, route.index());
    //try {
    root.go(route);

    assertNull('First component root has no name', route.get(0).getName());
    assertEquals('Second component should be parent', 'foo', route.get(1).getName());
    assertNull('Third component should not exist', route.get(2));
    assertEquals('Route index should be 2', 2, route.index());
    assertFalse(route.inProgress());
    assertTrue(route.didFail());
    
    // Whty must handle the promise here?  If we let this go
    // un-observed, the test fails even if it says 'PASS'
    route.getPromise().then(() => {
      console.log('PASS');
    }, err => {
      console.log('NOT-PASS');
    });
  },
  
});
