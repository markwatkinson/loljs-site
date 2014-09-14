;
var Remote;
(function() {

    function path(var_args) {
        var args = Array.prototype.slice.call(arguments);
        var ret = '/api';
        ko.utils.arrayForEach(args, function(a) {
            ret += '/' + encodeURIComponent(a);
        })
        return ret;
    }


    Remote = function(id, rev) {
        var self = this;

        this.programData = ko.observable({
            id: id,
            revision: rev
        });
        this.hasId = ko.computed(function() {
            var data = self.programData();
            return data.id != null;
        });

        this.saveNew = function(params) {
            var url = path('program', 'new');
            return $.post(url, {
                message: JSON.stringify({
                    'name' : params.name,
                    'program' : params.program
                })}, null, 'json')
            .done(function(data) {
                self.programData({
                    revision: data.revision,
                    id: data.id
                });
            });
        }

        this.update = function(params) {
            var url = path('program', 'save');
            return $.post(url, { message: JSON.stringify({
                'id' : self.programData().id,
                'program' : params.program
            })}, null, 'json').done(function(data) {
                self.programData({
                    revision: data.revision,
                    id: data.id
                });
            });
        }

        this.load = function(id, revision) {
            return $.getJSON(path('program', id, revision))
                .done(function(data) {
                    self.programData({
                        revision: data.revision,
                        id: data.id
                    });
                });
        }
    }
}());