describe('UI stuff', function () {
  describe('selectElementText', function () {
    it('should select the text in the element', function () {
      var span = document.createElement('span');
      span.innerHTML = 'teststring';
      sputils.ui.selectElementText(span);
      // more test needed, prolly.
    });
  });
});
