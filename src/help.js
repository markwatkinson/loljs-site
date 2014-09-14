"use strict";
var app = $.extend(app || {}, {
    Help: function() {
        var self = this;
        
        this.showMenu = ko.observable(false);
        this.showManual = ko.observable(false);
        this.showAbout = ko.observable(false);
        var t = 200;
        // We can't easily use CSS to transition some of these things, so we'll
        // go the easy route and jQuery it instead.
        this.showMenu.subscribe(function(s) {
            if (s) { $('.help-menu').slideDown(t); }
            else { $('.help-menu').slideUp(t); }
        });

        this.showAbout.subscribe(function(s) {
            var $p = $('.about.overlay');
            if (s) { $p.fadeIn(t); }
            else { $p.fadeOut(t); }
        })

        this.showMenuClick = function(model, ev) {
            ev.preventDefault();
            this.showMenu(!this.showMenu());
        }.bind(this);

        this.menuAboutClick = function(model, ev) {
            ev.preventDefault();
            this.showMenu(false);
            this.showAbout(true);
        }.bind(this);


        this.aboutCloseClick = function(model, ev) {
            ev.preventDefault();
            this.showAbout(false);
        }.bind(this);

        this.aboutContentHeight = ko.observable(0);


        this.refreshAbout = function() {
            var $p = $('.about.overlay');
            var $c = $p.find('.content');
            var overhead = $c.outerHeight(true) - $c.height();
            var h = $p.height() - $c.position().top - overhead + 'px';
            this.aboutContentHeight(h);
        }.bind(this);

        this.showAbout.subscribe(function() {
            this.refreshAbout();
        }.bind(this));
    }
});