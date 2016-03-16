/* jshint node: true, browser: true */
"use strict";

// makes a table editable
// XXX: hardly ROCA compliant

var $ = require("jquery");
require("velocity-animate");
require('velocity-animate/velocity.ui')

module.exports = EdiTable;

// `selector` specifies a table which is to be edited
function EdiTable(selector) {
    var table = selector.jquery ? selector : $(selector);
    this.table = table.addClass("editable");

    this.cols = table.find("thead th").length;

    var self = this;
    table.on("click", "a.transclude", function(ev) {
        self.onSelect.call(self, ev, this);
    }).on("click", ".breadcrumb a", function(ev) {
        self.onReturn.call(self, ev, this);
    });
}

EdiTable.prototype.onReturn = function(ev, link) { // XXX: partially duplicates `onSelect`
    link = $(link);
    var uri = link.attr("href");
    var prevDialog = link.closest(".dialog");

    replaceDialog(prevDialog, uri, true);

    ev.preventDefault();
};

EdiTable.prototype.onSelect = function(ev, link) {
    ev.preventDefault();

    link = $(link);
    var uri = link.attr("href");
    var row = link.closest("tr");

    var prevDialog = row.closest(".dialog");
    if(prevDialog.length) { // nested dialog -- XXX: callback hell
        replaceDialog(prevDialog, uri);
        return;
    }

    // abort if already expanded
    if(row.hasClass("dialog") || row.hasClass("is-selected")) {
        toggleSelection(row, false);
        var dummyRow = row.next(".dialog");
        dummyRow.find(".dialog").velocity("slideUp", {
            complete: function() {
                dummyRow.remove();
            }
        });
        return;
    }

    // spawn dialog
    var self = this;
    loadDialog(uri, function(dialog) {
        var cell = insertDummyRow(row, self.cols);
        dialog.hide().appendTo(cell).velocity("slideDown");
    });

    toggleSelection(row, true);
};

// loads a new dialog, replacing the existing one
function replaceDialog(prevDialog, uri, reverseAnimation) { // XXX: callback hell
    var animation = {
        translateX: (reverseAnimation ? 1 : -1) * prevDialog.outerWidth(),
        opacity: 0
    };
    var effect = reverseAnimation ? "transition.slideLeftBigIn" :
            "transition.slideRightBigIn";
    loadDialog(uri, function(newDialog) {
        prevDialog.velocity(animation, {
            complete: function() {
                swapDialog(prevDialog, newDialog, effect);
            }
        });
    });
}

function loadDialog(uri, callback) {
    $("<div />").load(uri, function() {
        var dialog = $(this).find(".dialog");
        callback(dialog);
    });
}

// replaces the existing dialog with a new one, animating the transition
function swapDialog(prevDialog, newDialog, effect) {
    newDialog.insertAfter(prevDialog);
    var height = Math.max(prevDialog.outerHeight(),
            newDialog.outerHeight());
    newDialog.parent().css("height", height); // XXX: context-dependent
    newDialog.hide().velocity(effect);
    prevDialog.remove();
}

function toggleSelection(row, selected) {
    row.toggleClass("is-selected", selected).children()
        .velocity({ opacity: selected ? 0.2 : 1 });
}

function insertDummyRow(reference, colspan) {
    var cell = $("<td />").attr("colspan", colspan);
    $('<tr class="dialog" />').append(cell)
        .insertAfter(reference);
    return cell;
}
