/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");
global.jQuery = global.$ = $; // shim required for non-CommonJS libraries
require("bootstrap"); // most widgets initialized via markup
// TODO: require("bootstrap-tabdrop");
var shortcutsInfo = require("./shortcuts");
var OneBox = require("./onebox");
var StickyNav = require("stickynav");
var collectionPreview = require("./collection_preview");
var gridSelector = require("./grid_selector"); // XXX: bad name
var ediTable = require("./editable");
var Accordion = require("./accordion");
var listing = require("./listing");

shortcutsInfo();

$(".onebox").each(function(i, node) {
    new OneBox(node);
});

var contextNav = $(".customer-card-wrapper, .branch-selector-fullwidth-wrapper")
    .wrapAll('<div class="context-nav" />').parent();
new StickyNav(contextNav, {
    fixedClass: "is-fixed",
    callback: function(fixed) {
        contextNav.find(".branch-selector-item-icon")
            .toggleClass("is-condensed", fixed); // XXX: non-generic / brittle
    }
});

$("a.collection-preview").each(function(i, node) {
    new collectionPreview(node);
});

$(".expandable-grid").each(function(i, node) { // XXX: bad class name
    gridSelector(node);
});

$("table.extensible").each(function(i, node) {
    new ediTable(node);
});

$(".accordion").each(function(i, node) {
    new Accordion(node);
});

$("table, ul, ol").filter(".sortable, .filterable").each(function(i, node) {
    var wrapper = listing(node);
    // app-specific adjustments
    // XXX: inelegant, but should be rendered (and functional) server-side anyway
    var filter = wrapper.find("input.search").attr("placeholder", "Filtern");
    var header = wrapper.prev(".listing-header");
    if(header.length === 0) { // responsive table
        header = wrapper.closest(".table-responsive").prev(".listing-header");
    }
    if(filter.length && header.length) {
        filter.appendTo(header);
    }
});

// TODO: $(".nav-tabs").tabdrop();

// initialize Bootstrap widgets

$("[data-toggle=tooltip]").tooltip(); // XXX: inefficient selector

$("[data-toggle=popover]").popover({ // XXX: inefficient selector
    trigger: "hover focus",
    container: "body"
});

// ensure drop-down menus do not extend beyond the viewport
$(".dropdown").on("shown.bs.dropdown", function(ev, ctx) {
    var menu = $(".dropdown-menu", this);
    ensureVisible(menu);
});

// Clone some markup in order to avoid styling for breakpoints in JS
// Also see src/styles/customer-card.less
$(".customer-card-portfolio").clone().prependTo(".customer-card-details");
$(".customer-card-flags").clone().prependTo(".customer-card-details");
$(".customer-card-drawer").clone().appendTo(".customer-card-details");

function ensureVisible(el) {
    var max = $(window).width();
    var right = el.offset().left + el.outerWidth();
    if(right > max) {
        el.css("transform", "translateX(" + (max - right) + "px)");
    }
}
