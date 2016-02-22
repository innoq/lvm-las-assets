/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");
var List = global.List; // NB: List.js doesn't play well with CommonJS
var util = require("./util");

// `selector` specifies a list or table which is augmented with filtering and/or
// sorting capabilities: lists are always filterable, tables always sortable -
// the latter can be made filterable by adding the corresponding class
module.exports = function(selector) {
    var listing = selector.jquery ? selector : $(selector);

    // annoyingly, List.js expects a container element with an ID
    var id = "ljs" + Math.random().toString().substr(2); // XXX: brittle?
    var wrapper = listing.wrap('<div class="listing" />').parent()
        .attr("id", id);

    var table, list, sortable, filterable, valueNames;
    if(listing.is("table")) {
        table = listing;
        listing.find("tbody").addClass("list");
        sortable = true;
        filterable = table.hasClass("filterable");
        valueNames = determineColumnNames(table);
    } else {
        list = listing.addClass("list");
        sortable = false; // TODO: currently unsupported for lists
        filterable = true;
        // wrap individual items' contents to make them addressable for List.js
        // XXX: temporary workaround; cf. https://github.com/javve/list.js/issues/263
        list.children().each(function(i, node) {
            $(node).children().wrapAll('<div class="entry" />');
        });
        valueNames = ["entry"]; // TODO: support custom slots
    }

    listing.toggleClass("sortable", sortable);
    if(filterable) {
        wrapper.prepend('<input type="search" class="search" />');
        listing.addClass("filterable");
    }

    // modify List.js templater to allow for animations -- XXX: hacky
    var lister = new List(id, { valueNames: valueNames });
    lister.searchMethod = util.debounce(250, lister.searchMethod);
    var templater = lister.templater;
    templater.clear = $.noop; // relying on `show`/`hide` instead
    var show = animate(table ? "fadeIn" : "slideDown");
    templater.show = function(item) {
        show.apply(this, arguments);
        $(item.elm).parent().append(item.elm); // XXX: hack, required for sorting
    };
    templater.hide = animate(table ? "fadeOut" : "slideUp");

    return wrapper;
};

function animate(effect) {
    return function(item) {
        $(item.elm)[effect]();
    };
}

function determineColumnNames(table) {
    var cols = table.find("thead th");
    return Array.prototype.map.call(cols, function(cell) {
        return $(cell).attr("data-sort");
    });
}
