window.initialize_jquery = function () {
  jQuery.ajax = function(config){ throw "Don't forget to mock!"; };
};

initialize_jquery();
