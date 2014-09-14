"use strict";

var ast = lol.ast;

var utils = {
    watcher: function(v) {
        var value = v;
        var watchers = [];

        var ret = function(v) {
            if (arguments.length) {
                var old = value;
                value = v;
                watchers.forEach(function(f) {
                    f(value, old);
                });
            }
            else {
                return value;
            }
        };
        ret.watch = function(f) {
            watchers.push(f);
        };
        ret.unWatch = function(f) {
            var index;
            while ((index = watchers.indexOf(f) >= 0)) {
                watchers.splice(index, 1);
            }
        };
        return ret;
    }

};

var app = {
    program: {
        running: utils.watcher(false),
        pausedAtLine: utils.watcher(null),
        interpreter: null,
        init: function(app) {
            this.interpreter = new lol(function() {
                app.program.running(false);
                app.program.pausedAtLine(null);
            }, function() {
                var line = this._currentNode._location.first_line - 1;
                app.program.pausedAtLine(line);
            });
        }
    },
    ui: {
        cm: null,
        $cm: null,
        $code: null,
        $debugTooltip: null,
        debugHoverToken: utils.watcher(null),
        cmMouseMove: null,
        watchExps: [],

        init: function(app) {
            this.cm = CodeMirror.fromTextArea(document.getElementById('code'), {
                lineNumbers: true,
                theme: 'ambiance'
            });
            this.$cm = $(this.cm.display.wrapper);
            this.$code = this.$cm.find('.CodeMirror-code');
            this.$debugTooltip = $('#variable-state-inspector-tooltip');
            this.cmMouseMove = function(ev) {
                var $target = $(ev.target);
                if ($target.is('.cm-identifier')) {
                    this.debugHoverToken($target);
                }
            }.bind(this);

            $('#run').click(function() {
                var code = app.ui.cm.getValue();
                try {
                    var tree = parser.parse(code);
                } catch (err) {
                    return;
                }
                app.program.running(true);
                app.program.interpreter.evaluate(tree);
            });
            $('#next').click(function() {
                app.program.interpreter.next();
            });

            app.program.pausedAtLine.watch(function(l, oldL) {
                if (l !== null) {
                    app.ui.cm.addLineClass(l, 'wrap', 'paused');
                }
                if (oldL !== null) {
                    app.ui.cm.removeLineClass(oldL, 'wrap', 'paused');
                }
            });

            app.program.running.watch(function(r, oldR) {
                var c = 'running';
                if (r && !oldR) {
                    this.$cm.addClass(c);
                    this.$code.bind('mousemove', this.cmMouseMove);
                }
                else if (!r) {
                    this.$code.unbind('mousemove', this.cmMouseMove);
                    this.$cm.removeClass(c);
                }
                this.debugHoverToken(null);
            }.bind(this));

            this.debugHoverToken.watch(function(t, old) {
                if (old) {
                    old.removeClass('debug-focus');
                }
                if (t) {
                    var text = t.text();
                    var value;
                    try {
                        value = app.program.interpreter.getSymbol(text);
                    } catch(err) {
                        debugger;
                        value = '[out of scope]';
                    }
                    value = lol.utils.toYarn(value);
                    var pos = t.offset();
                    pos.top += t.outerHeight(true) + 5;
                    this.$debugTooltip
                        .text(value)
                        .show()
                        .offset(pos);
                    var ttWidthOverhead = this.$debugTooltip.outerWidth(true) -
                        this.$debugTooltip.width();
                    this.$debugTooltip.css('min-width', t.outerWidth(true) -
                        ttWidthOverhead);
                    t.addClass('debug-focus');
                } else if (old) {
                    this.$debugTooltip.hide();
                }
            }.bind(this));
        }
    },
    init: function() {
        this.program.init(this);
        this.ui.init(this);
    }
};

$(document).ready(function() {
    app.init();
});
