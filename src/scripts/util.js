/* jshint node: true, browser: true */
"use strict";

// adapted from StuffJS (https://github.com/bengillies/stuff-js)
exports.debounce = function(wait, fn) {
    var timer;
    return function() {
        var self = this,
            args = arguments;
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function() {
            fn.apply(self, args);
            timer = null;
        }, wait);
    };
};

exports.contains = function(str, value, caseSensitive) {
    if(!caseSensitive) {
        str = str.toLowerCase();
        value = value.toLowerCase();
    }
    return str.indexOf(value) !== -1;
};
