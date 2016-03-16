/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");
require("velocity-animate");
require('velocity-animate/velocity.ui')

module.exports = function(container) {
    container = container.jquery ? container : $(container);
    container.addClass("expandable-grid"). // XXX: bad class name, redundant
        on("click", ".expansion-trigger", onToggle); // XXX: bad class name
};

function onToggle(ev) {
    /*jshint validthis: true */
    ev.preventDefault();

    var item = $(this).closest(".expandable-grid-item"); // XXX: bad class name
    var container = item.closest(".expandable-grid");

    // reset
    container.find(".dummy").remove();
    if(item.is(".expanded")) {
        item.removeClass("expanded");
        item.find(".product-selector-help").hide();
        return;
    }
    container.find(".expanded").removeClass("expanded");

    // insert dummy to retain layout
    item.clone().addClass("dummy").insertAfter(item);

    // animate position
    var pos = item.position();
    item.css({ top: pos.top, left: pos.left }).addClass("expanded");
    // force animation
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            item.removeAttr("style");
            // FIXME: fugly hack, breaking separation of concerns on multiple dimensions
            item.find(".product-selector-help").
                velocity("transition.slideDownIn", { delay: 300 });
        });
    });
}
