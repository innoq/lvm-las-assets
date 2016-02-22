/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");

module.exports = function(link) {
    var dom;
    var elements = function(prop) {
        return function() {
            if(!dom) {
                dom = popover(this);
            }
            return dom[prop];
        };
    };

    $(link).popover({
        container: "body",
        trigger: "click", // TODO: dismiss anywhere
        placement: "bottom",
        html: "true",
        title: elements("title"),
        content: elements("content")
    }).click(function(ev) {
        ev.preventDefault();
    });
};

function popover(link) {
    link = $(link);
    var uri = link.attr("href");

    var content = link.data("popover-content");
    content = $(content).clone(); // XXX: `clone` unnecessary?

    var title = content.find(".collection-excerpt-title").remove();

    return { content: content.html(), title: title.html() };
}
