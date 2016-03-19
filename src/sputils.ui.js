(function () {
  /**
   * Selects all text in the element `el` visually
   * as though selected with the mouse, to be ready
   * for copying or something like that.
   * @function sputils.ui.selectElementText
   * @param {DOMElement} el the DOM element in which to select the text.
   * @param {Window} win @optional the relevant browsing context.
   * @example
   * sputils.selectElementText(document.querySelector('#container));
   */
  var selectElementText = function (el, win) {
    win = win || global;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
      sel = win.getSelection();
      range = doc.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (doc.body.createTextRange) {
      range = doc.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  };

  /** @namespace */
  sputils.ui = {
    selectElementText: selectElementText
  };
})();
