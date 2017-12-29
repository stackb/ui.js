goog.provide('js.ui.main');

/**
 * Main entry point for the browser application setup.
 * @export
 */
js.ui.main = function() {

  window['datalayer'] = [];
  
  const App = goog.require("js.ui.App");

  // Increase stacktrace limit in chrome
  Error['stackTraceLimit'] = 150;

  const app = new App();
  app.render(document.body);
  app.start();
};
