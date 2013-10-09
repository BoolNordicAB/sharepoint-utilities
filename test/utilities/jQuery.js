$.extend(jQuery, function(el) {
  console.log(el);
});

window.initialize_jquery = function () {
  jQuery.ajax = function(config){ throw "Don't forget to stub!"; };
};

initialize_jquery();
