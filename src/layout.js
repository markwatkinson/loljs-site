"use strict";
var app;
(function() {
    function heightOverhead($el) {
        return $el.outerHeight(true) - $el.height();
    }

    app = $.extend(app || {}, {
        Layout: function(cm) {
            var self = this;
            this.codeHeight = ko.observable(0);
            this.outputHeight = ko.observable(100); // constant

            this.watchListHeight = ko.observable(0);
            this.debugInnerHeight = ko.observable(0);
            var defaultBottomSize = null;

            // Window resize event will update the heights
            this.refresh = function() {
                var availableHeight;
                var windowHeight = $(window).height();
                console.log(windowHeight);
                var vStart = $('.ide').offset().top;
                var outputHeightOverhead = heightOverhead($('.output-container'));
                availableHeight = $(window).height();
                availableHeight -= vStart;
                availableHeight -= (outputHeightOverhead + self.outputHeight());
                self.codeHeight(availableHeight);
                cm.refresh();

                var debugToolbarHeight = $('.debugger-panel .watch').offset().top;
                self.watchListHeight(availableHeight - debugToolbarHeight);
                var debugInnerHeight = availableHeight - $('.debugger-inner').outerHeight(true) -
                    $('.debugger-inner').height();
                self.debugInnerHeight(debugInnerHeight);

                if (defaultBottomSize === null) {
                    defaultBottomSize = $('.bottom').height();
                }
            }

            var hideTimer = null;
            this.showBottomPanel = function() {
                $('.bottom').stop(true).animate(
                    {'height': defaultBottomSize + 'px'}, 'fast');
                $('.output-container').stop(true).animate(
                    {'margin-bottom': defaultBottomSize + 'px'}, 'fast');
            }
            this.hideBottomPanel = function() {
                var targetHeight = '8px';
                $('.bottom').stop(true).animate({'height': targetHeight}, 'fast');
                $('.output-container').stop(true).animate({'margin-bottom': targetHeight}, 'fast');
            }
            this.scheduleHideBottomPanel = function() {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(function() {
                    self.hideBottomPanel()},
                1000);
            }
//             $('.bottom').hover(function() {
//                 clearTimeout(hideTimer);
//                 self.showBottomPanel();
//             }, function() {
//                 self.scheduleHideBottomPanel();
//             });
            $(window).resize(this.refresh);
        }
    });
}());