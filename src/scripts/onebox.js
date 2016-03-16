/* jshint node: true, browser: true */
"use strict";

var $ = require("jquery");
require("velocity-animate");
require('velocity-animate/velocity.ui')
var util = require("./util");

module.exports = OneBox;

function OneBox(selector) {
    var form = selector.jquery ? selector : $(selector);
    this.results = form.next().find(".list-group-item").hide(); // XXX: hard-coded
    var onQuery = this.onQuery.bind(this);
    form.on("submit", onQuery);
    this.input = form.find(".onebox-search")
        .on("keyup", util.debounce(250, onQuery));
}

OneBox.prototype.onQuery = function(ev) {
    var query = this.input.val();
    var matches = [];
    var rejects = [];
    this.results.each(function(i, node) {
        var item = $(node);
        var txt = item.text();
        var group = query && util.contains(txt, query) ? matches : rejects;
        group.push(node);
    });

    var animation = { drag: true, stagger: 55, duration: 325 };
    // NB: "selected" class avoids repeat animations
    $(rejects).removeClass("selected")
        .velocity("transition.slideDownOut", animation);
    $(matches).not(".selected").addClass("selected")
        .velocity("transition.slideUpIn", animation);

    ev.preventDefault();
};
