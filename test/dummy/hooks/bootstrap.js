'use strict';

var async = require('async');

module.exports = function(done) {
    let mycro = this;
    async.parallel({
        addErrorHandlers: function(fn) {
            let bugsnag = mycro.bugsnag = {notify: function() {
                    console.error('bugsnag.notify()');
                }},
                notifier = function(err, meta) {
                    bugsnag.notify(err, meta);
                };
            mycro.services.error.addNotifier(notifier);
            fn();
        }
    }, done);
};
