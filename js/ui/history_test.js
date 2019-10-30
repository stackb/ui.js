// Copyright 2016 The Closure Rules Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.module('stack.ui.HistoryTest');
goog.setTestOnly('stack.ui.HistoryTest');

const BzlHistory = goog.require('stack.ui.History');
const HEvent = goog.require('stack.ui.history.Event');
const TagName = goog.require('goog.dom.TagName');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
// const jsunit = goog.require('goog.testing.jsunit');
const strings = goog.require('goog.string');
const testSuite = goog.require('goog.testing.testSuite');

/** @type {?BzlHistory} */
let history = null;

testSuite({

  setUp: () => {
    history = new BzlHistory();
  },

  
  testSetLocation: () => {
    assertNotNull(history);
    const token = strings.getRandomString();
    history.setLocation(token);
    assertTrue(strings.endsWith(document.location.href, '/' + token));
  },

  
  // /**
  //  * Should not trigger nagivate event as the hash does not start with /#/.
  //  */
  // testDocumentClickNormalHrefDoesNotTriggersNavigate: () => {
  //   assertNotNull(history);
  //   events.listen(history, 'navigate', handleEvent);
  //   const a = createAnchor("/foo");
  //   document.body.appendChild(a);
  //   a.click();
  //   assertEquals(0, eventStack.length);
  // },

  
  /**
   * Should trigger nagivate event as the hash does not start with /#/.
   * @suppress {checkTypes}
   */
  testDocumentClickSpecialHrefTriggersNavigate: () => {
    assertNotNull(history);

    /** @type {!Array<!HEvent>} */
    let eventStack = [];

    events.listen(history, 'navigate', (/** !HEvent */e) => {
      eventStack.push(e);
    });

    const a = createAnchor("/#/foo/bar/baz");
    document.body.appendChild(a);
    a.click();

    console.log(`eventstack.length ${eventStack.length}`);

    assertEquals(1, eventStack.length);
    const event = eventStack[0];
    assertNotNull(event);

    console.log(`typeof event ${typeof event}`);
    console.log(`event keys ${Object.keys(event)}`);
    console.log(`event.type ${event.type}`);
    console.log(`event.target ${event.target}`);
    // console.log(`event.$b$ ${event["$b$"]}`);
    // console.log(`event.$c$ ${event["$c$"]}`);
    console.log(`typeof event.path ${typeof event.path}`);

    for (const key of Object.keys(event)) {
      console.log(`${key} = ${event[key]}`);
    }

    console.log(`event.path.length ${event.path.length}`);

    // Seems to be a disconnect in the transpilation here, I can't access the
    // path variable but it does seem to exist as $b$.
    assertNotNull(event.path);

    assertEquals(4, event.path.length);
    assertEquals("", event.path[0]);
    assertEquals("foo", event.path[1]);
    assertEquals("bar", event.path[2]);
    assertEquals("baz", event.path[3]);

  },
  
});


/**
 * @param {string} href
 * @return {!HTMLAnchorElement} 
 */
function createAnchor(href) {
  const a = dom.createElement(TagName.A);
  a.href = href;
  return a;
}
