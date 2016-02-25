'use strict';

var async = require('async');

module.exports = {
    throws(req, res) {
        let mycro = req.mycro;
        async.waterfall([
            function(fn) {
                process.nextTick(function() {
                    return fn(new Error('Uh oh!'));
                });
            }
        ], mycro.services.error.interceptResponse(res, function(val) {
            res.json(200, {data: val});
        }));
    },

    doesntThrow(req, res) {
        let mycro = req.mycro;
        async.waterfall([
            function(fn) {
                process.nextTick(function() {
                    return fn(null, 'ok!');
                });
            }
        ], mycro.services.error.interceptResponse(res, function(val) {
            res.json(200, {data: val});
        }));
    }
};
