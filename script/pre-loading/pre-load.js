/* eslint-disable no-var */

(function preloadScript() {
  var indexSrc = window.jsonpScriptSrc['views-home-hor-index'];
  loadScript(indexSrc);
  function loadScript(src) {
    if (!src) {
      return;
    }
    var scripts = document.querySelectorAll('script');
    var lastScript = scripts[scripts.length - 1];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = src;

    lastScript.parentElement.appendChild(newScript);
  }
}());
