"use strict";

// Necessary for the way the parser works.
var ast = lol.ast;

var app = $.extend(app || {}, {
    Program: function() {
        var self = this;
        this.isRunning = ko.observable(false);
        this.pausedAtLineNo = ko.observable(null);
        this.error = ko.observable(null);
        this.isPaused = ko.computed(function() {
            return self.pausedAtLineNo() != null;
        });
        this.output = ko.observable(null);

        this.reset = function(dontClearOutput) {
            self.isRunning(false);
            self.error(null);
            self.pausedAtLineNo(null);
            if (!dontClearOutput) {
                self.output(null);
            }
        }
        this.interpreter = new lol(function() {
            self.reset(true);
        }, function() {
            self.pausedAtLineNo(null);
            if (this.errors().length) {
               self.error({
                    pos: this.pos(),
                    msg: this.errors()[0]
               });
               self.isRunning(false);
            } else {
                self.pausedAtLineNo(this.pos().line);
            }
        });

        this.interpreter.setIo({
            visible: function(text) {
                var current = self.output() || '';
                current += text + '\n';
                self.output(current);
            }
        });


        this.compile = function(code) {
            parser.yy.parseError = function (err, hash) {
                var cErr = new CompileError(err, hash, this);
                var pos = cErr.pos;
                var text = cErr.text();
                // Jison reports the location of the current token rather than
                // the unexpected one, so we have to transform it.
                var lines = code.split(/\r\n|\r|\n/);
                var substr = lines[pos.lineEnd].substr(pos.colEnd);
                var ltrimmed = substr.replace(/^[^\S\r\n]+/, '');
                var spaces = substr.length - ltrimmed.length;

                pos.line = pos.lineEnd;
                pos.col = pos.colEnd + spaces;
                pos.lineEnd = pos.line;
                pos.colEnd = pos.col + hash.text.length;

                self.error({
                    pos: pos,
                    msg: text
                });
                var e = new Error(err);
                e.dontReThrow = true;
                throw e;
            };
            try {
                var tree = parser.parse(code);
                return tree;
            } catch (err) {
                if (!err.dontReThrow) { throw err; }
                return null;
            }
        }
    },
    Debugger: function(cm, program) {
        var self = this;

        this.watchExpressions = ko.observableArray([]);

        this.hoverToken = ko.observable(null);
        // We can't hook into any templates or bindings for the CodeMirror
        // augmentations, so we have to do it the old fashioned way.
        var $cm = $(cm.display.wrapper),
            $code = $cm.find('.CodeMirror-code');
        var mouseMove = function(ev) {
            var $target = $(ev.target);
            if ($target.is('.cm-identifier')) {
                var existing = self.hoverToken();
                if (existing) { $(existing).removeClass('debug-focus'); }
                $(ev.target).addClass('debug-focus');
                self.hoverToken(ev.target);
            }
        };
        var mouseMoveBound = false;
        var pauseLine = null;

        program.isPaused.subscribe(function(p) {
            refreshWatchExpressions();
        });

        function refreshWatchExpressions(done) {
            async.each(self.watchExpressions(), function(w, cb) {
                w.update(true, cb);
            }, done || function() {});
        }


        this.addWatchExpression = function() {
            self.watchExpressions.push({
                expression: ko.observable(''),
                _calculatedExpression: '',
                output: ko.observable(null),
                update: function(force, done) {
                    var w = this;
                    var expr = w.expression();
                    if (expr === w._calculatedExpression && !force) { return; }
                    expr = expr.replace(/^\s+|\s+$/g, '');
                    w._calculatedExpression = expr;
                    if (expr === '') {
                        w.output('');
                    } else {
                        var e = null;
                        parser.yy.parseError = function(err, hash) {
                            e = new CompileError(err, hash, this).text();
                            throw new Error('');
                        };
                        try {
                            var tree = parser.parse(expr);
                        } catch(err) {}

                        if (e) {
                            w.output('<' + (e.msg || e) + '>');
                            done && done();
                            return;
                        }

                        program.interpreter.evaluateWatchExpression(tree, function(ret) {
                            w.expression(expr);
                            w.output(lol.utils.toYarn(ret));
                            self.watchExpressions.valueHasMutated();
                            done && done();
                        }, function() {
                            w.expression(expr);
                            w.output(this.errors()[0]);
                            self.watchExpressions.valueHasMutated();
                            done && done();
                        });
                    }
                }
            });
        };

        this.removeWatchExpression = function(index) {
            self.watchExpressions.splice(index, 1);
        };

//         this.addWatchExpression();
//         this.addWatchExpression();
//         this.addWatchExpression();
//         this.watchExpressions()[0].expression('SUM OF 1 AN 2');
//         this.watchExpressions()[1].expression('"AAAAAAAAAAAAAAAAAAAAAAA"');
//         this.watchExpressions()[2].expression('SUM OF 1 AN 2');
//         refreshWatchExpressions();

        this.tooltip = {
            visible: ko.computed(function() {
                var v = !!this.hoverToken();
                return v;
            }, this),
            offset: ko.computed(function() {
                var t = this.hoverToken();
                if (t) {
                    var p = $(t).offset();
                    p.top += $(t).outerHeight() + 5;
                    p.top += 'px';
                    p.left += 'px';
                    return p;
                } else {
                    return {top: 0, left: 0};
                }
            }, this),
            width: ko.computed(function() {
                var t = this.hoverToken();
                if (!t) { return 0; }
                var $dom = $('#debug-state-inspector');
                var widthOffset = $dom.outerWidth(true) - $dom.width();
                return $(t).outerWidth(true) - widthOffset + 'px';
            }, this),
            value: ko.computed(function() {
                var t = this.hoverToken();
                value = null;
                if (t) {
                    var value = '[Out of scope]';
                    try {
                        value = program.interpreter.getSymbol($(t).text());
                        value = lol.utils.toYarn(value);
                    } catch (err) {}
                }
                return value;
            }, this)
        };

        program.isPaused.subscribe(function(r) {
            if (r) {
                $cm.addClass('running');
                cm.setOption('readOnly', true);
                if (!mouseMoveBound) {
                    $code.bind('mousemove', mouseMove);
                    mouseMoveBound = true;
                }
            }
            else {
                $cm.removeClass('running');
                cm.setOption('readOnly', false);
                if (mouseMoveBound) {
                    $code.unbind('mousemove', mouseMove);
                    mouseMoveBound = false;
                }
                self.hoverToken(null);
            }
        });
        program.pausedAtLineNo.subscribe(function(line) {
            if (pauseLine != null) {
                cm.removeLineClass(pauseLine, 'wrap', 'paused');
            }
            pauseLine = line;
            if (pauseLine != null) {
                cm.addLineClass(pauseLine, 'wrap', 'paused');
            }
            refreshWatchExpressions();
        });


        var widgets = [];
        program.error.subscribe(function(e) {
            if (!e) { return; }
            var line = e.pos.line;
            var err = $('<div>')
                .addClass('gutter-error')
                [0];
            var $msg = $('<div>')
                .addClass('line-error')
            $('<div>')
                .addClass('summary')
                .text(e.msg.msg || e.msg)
                .appendTo($msg);
            if (e.msg.more) {
                $('<div>').addClass('more')
                    .text(e.msg.more)
                    .appendTo($msg);
            }


            cm.setGutterMarker(line, 'CodeMirror-errors', err);
            var o = cm.addLineWidget(line, $msg[0], {coverGutter: false, noHScroll: true});
            widgets.push(o);
            var doc = cm.getDoc();
            o = doc.markText({line: e.pos.line, ch: e.pos.col},
                         {line: e.pos.lineEnd, ch: e.pos.colEnd},
                         {className: 'inline-error'}
            );
            widgets.push(o);
        });

        this.reset = function() {
            cm.clearGutter('CodeMirror-errors');
            ko.utils.arrayForEach(widgets, function(w) { w.clear(); });
            self.hoverToken(null);
        };
    },

    App: function(error) {
        var self = this;
        this.help = new app.Help();
        this.remote = new Remote(LOAD.id, LOAD.revision);

        this.remote.programData.subscribe(function(data) {
            var path = '/p/' + data.id + '/' + data.revision;
            window.history.pushState(null, '', path);
//             window.location = path;
        });

        this.examples = new app.Examples();

        if (error) {
            this.layout = { refresh : function() {} };
            return;
        }

        var cm = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            theme: 'ambiance',
            gutters: ['CodeMirror-errors'],
        });
        cm.setSize(null, '100%');
        cm.refresh();
        this.program = new app.Program();
        this.debug = new app.Debugger(cm, this.program);
        this.layout = new app.Layout(cm);
//         this.urlWatcher = new UrlWatcher(this, cm);

        this.save = function() {
            var code = cm.getValue();
            if (!self.remote.hasId()) {
                self.remote.saveNew({
                    name: 'New',
                    program: code
                });
            } else {
                self.remote.update({
                    program: code
                });
            }
        };

        this.run = function() {
            self.program.reset();
            self.debug.reset();

            var code = cm.getValue();
            var tree = self.program.compile(code);

            if (tree) {
                self.program.isRunning(true);
                self.program.interpreter.evaluate(tree);
            }
        };

        this.setCode = function(code) {
            cm.setValue(code);
        };

    },

    init: function() {
        var app = new this.App($('body.error').length > 0);
        ko.applyBindings(app);
        return app;
    }
});

var a;
$(document).ready(function() {


    a = app.init();
    a.layout.refresh();
    a.help.refreshAbout();
    $('.overlay')
        .draggable({
            containment: 'document',
            handle: '.header'
        })
        .resizable({
            containment: 'document',
            handles: 'n, e, s, w, ne, se, sw, nw'
        });

    $('.overlay.about').on('resize', function() {
        a.help.refreshAbout();
    });

    a.help.showAbout(true);

});
