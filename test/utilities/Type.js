window.Type = window.Type || {
  registerNamespace: function (namespace) {
    var parts = namespace.split('.'),
        c = window;
    _.each(parts, function (part) {
      c[part] = {};
      c = c[part];
    });
  }
};
