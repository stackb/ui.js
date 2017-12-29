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

goog.module('js.ui.HistoryTest');
goog.setTestOnly('js.ui.HistoryTest');

const BzlHistory = goog.require('js.ui.History');
const HEvent = goog.require('js.ui.history.Event');
const TagName = goog.require('goog.dom.TagName');
const dom = goog.require('goog.dom');
const events = goog.require('goog.events');
const jsunit = goog.require('goog.testing.jsunit');
const strings = goog.require('goog.string');
const testSuite = goog.require('goog.testing.testSuite');

/** @type {?BzlHistory} */
let history = null;

/** @type {!Array<!HEvent>} */
let eventStack = [];

testSuite({

  setUp: () => {
    console.log('======================================================', jsunit);
    history = new BzlHistory();
  },

  
  testSetLocation: () => {
    assertNotNull(history);
    const token = strings.getRandomString();
    history.setLocation(token);
    assertTrue(strings.endsWith(document.location.href, '/' + token));
  },

  
  /**
   * Should not trigger nagivate event as the hash does not start with /#/.
   */
  testDocumentClickNormalHrefDoesNotTriggersNavigate: () => {
    assertNotNull(history);
    events.listen(history, 'navigate', handleEvent);
    const a = createAnchor("/foo");
    document.body.appendChild(a);
    a.click();
    assertEquals(0, eventStack.length);
  },

  
  /**
   * Should trigger nagivate event as the hash does not start with /#/.
   */
  testDocumentClickSpecialHrefTriggersNavigate: () => {
    assertNotNull(history);
    events.listen(history, 'navigate', handleEvent);
    const a = createAnchor("/#/foo/bar/baz");
    document.body.appendChild(a);
    a.click();
    assertEquals(1, eventStack.length);
    const event = eventStack[0];
    assertNotNull(event);
    assertNotNull(event.path);
    assertEquals(3, event.path.length);
    assertEquals("foo", event.path[0]);
    assertEquals("bar", event.path[1]);
    assertEquals("baz", event.path[2]);
  },
  
});


/**
 * @param {!HEvent} e
 */
function handleEvent(e) {
  eventStack.push(e);
}


/**
 * @param {string} href
 * @return {!HTMLAnchorElement} 
 */
function createAnchor(href) {
  const a = dom.createElement(TagName.A);
  a.href = href;
  return a;
}
