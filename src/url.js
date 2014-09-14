"use strict";
var UrlWatcher;
(function() {
    UrlWatcher = function(app, cm) {
        var hashLock = false;

        this.bangPath = ko.computed(function() {
            var data = app.remote.programData();
            var pId = data.id,
                rev = data.revision;

            if (pId == null || rev == null) {
                return '';
            }
            return '!/' + pId + '/' + rev;
        });


        this.bangPath.subscribe(function(p) {
            hashLock = true;
            location.hash = p;
        });

        $(window).on('hashchange', function() {
            if (hashLock) { return; }
            hashLock = false;
            var hash = location.hash,
                parts = hash.substr(3).split('/');
            var id = parts[0],
                revision = parts[1];
            if (typeof id !== 'undefined' && typeof revision !== 'undefined') {
                app.remote.load(id, revision)
                    .done(function(data) {
                        cm.setValue(data.program);
                    })
                    .fail(function(data) {
                        cm.setValue('');
                    });
            }
        });
        $(window).trigger('hashchange');
    };
}());