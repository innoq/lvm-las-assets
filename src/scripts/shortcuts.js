/* jshint node: true, browser: true */
"use strict";

// displays and handles keyboard shortcuts

var $ = require("jquery");

// XXX: explicit references to `document` are bad!?

module.exports = function() {
    new ShortcutManager("/help/shortcuts"); // XXX: hard-coded URI
};

function ShortcutManager(uri) {
    this.uri = uri;
    $(document).on("keypress", $.proxy(this, "onKeyPress"));
}

ShortcutManager.prototype.onKeyPress = function(ev) {
    // suppress on form controls or otherwise editable elements
    // adapted from Mousetrap (http://craig.is/killing/mice)
    if(["INPUT", "SELECT", "TEXTAREA"].indexOf(ev.target.tagName) !== -1 ||
            ev.target.isContentEditable) {
        return;
    }

    var key = ev.which;
    if(key === 0) { // ESC
        this.toggleHelp(true);
        this.toggleHighlight(true);
    } else if(key === 33) { // "!"
        this.toggleHighlight();
    } else if(key === 63) { // "?"
        this.toggleHelp();
    } else if(this.commands && key >= 49 && key <= 57) { // XXX: only supports number keys
        var index = key - 49;
        this.commands.eq(index).click(); // XXX: `click` non-generic?
        this.toggleHighlight();
    }
};

ShortcutManager.prototype.toggleHighlight = function(forceClose) {
    var shortcuts = $(".kbd", document.body);
    shortcuts.find(".help-key").remove();

    if(!shortcuts.length && !forceClose) { // no custom shortcuts; display help
        this.toggleHelp(function(dialog) {
            var msg = $('<p class="alert alert-warning" role="alert" />')
                .text("Auf dieser Seite sind keine Tastaturkürzel vorhanden.");
            dialog.find(".modal-header").append(msg); // XXX: breaks encapsulation
        });
        return;
    }

    if(this.commands || forceClose) {
        delete this.commands;

        if(this.shroud) { // required for `forceClose`
            this.shroud.remove();
        }
        delete this.shroud;
        $(".kbd.highlighted", document.body).removeClass("highlighted");
    } else {
        this.shroud = $('<div class="modal-backdrop fade in" />')
            .appendTo(document.body);

        shortcuts.addClass("highlighted");
        this.commands = shortcuts.each(function(i, node) {
            var el = $('<kbd class="help-key" />');
            $("<span />").text(i + 1).appendTo(el);
            el.prependTo(node);
        });
    }
};

ShortcutManager.prototype.toggleHelp = function(forceClose, callback) {
    if(this.inProgress) {
        return;
    }

    if(forceClose && forceClose.call) { // shift arguments
        callback = forceClose;
        forceClose = null;
    }

    this.inProgress = true;
    var self = this;
    if(this.dialog || forceClose) {
        var dialog = this.dialog || $(); // required for `forceClose` -- XXX: hacky
        dialog.modal("hide");
        setTimeout(function() { // XXX: fugly hack
            dialog.remove();
            delete self.dialog;
            delete self.inProgress;
        }, 500);
    } else {
        this.dialog = $("<div />").load(this.uri, function(data, status, xhr) {
            self.spawnModal();
            if(callback) {
                callback(self.dialog);
            }
            delete self.inProgress;
        });
    }
};

ShortcutManager.prototype.spawnModal = function() {
    // XXX: ESC dismissal doesn't work for modal
    this.dialog = this.dialog.children().appendTo(document.body).modal();
};
