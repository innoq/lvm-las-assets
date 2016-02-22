/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");
require("velocity-animate");

module.exports = Accordion;

function Accordion(selector) {
    // TODO: protect against multiple matches
    this.container = selector.jquery ? selector : $(selector);
    this.container.addClass("accordion");

    this.title = this.container.find(".accordion-title");
    this.toggle = $('<span class="accordion-toggle"></span>')
        .appendTo(this.title);

    var details = this.determineNonEssentials();
    this.collapsed = !details.is(":visible") ||
        this.container.hasClass("is-collapsed"); // NB: heuristic
    this.setState(true);

    this.toggle.click(this.onToggle.bind(this)); // TODO: support event delegation
}

Accordion.prototype.onToggle = function(ev) {
    this.collapsed = !this.collapsed;
    this.setState();
    ev.preventDefault();
};

Accordion.prototype.setState = function(immediate) {
    this.toggle.toggleClass("toggled", !this.collapsed);
    this.container.toggleClass("is-collapsed", this.collapsed);

    var actions = immediate ? ["hide", "show"] : ["slideUp", "slideDown"];
    var action = this.collapsed ? actions[0] : actions[1];
    var details = this.determineNonEssentials();
    if(immediate) {
        details[action]();
    } else {
        details.velocity(action);
    }
};

Accordion.prototype.determineNonEssentials = function() {
    var essentials = this.title.parentsUntil(".accordion").andSelf();
    return this.container.children().not(essentials);
};
