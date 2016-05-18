var initializeDOM = function () {
  // Clean the DOM
  document.body.innerHTML = '';

  var input = document.createElement('input');
  input.value = 'TestValue';
  input.id = '__REQUESTDIGEST';
  document.body.appendChild(input);
};

initializeDOM();

