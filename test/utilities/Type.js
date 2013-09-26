window.Type = window.Type || {
  registerNamespace: function (namespace) {
    var parts = namespace.split('.'),
        c = window;
    parts.forEach(function (part) {
      c[part] = {};
      c = c[part];
    });
  }
};
