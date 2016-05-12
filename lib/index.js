'use strict';

var _ = require('lodash');

module.exports = function mycro_error(done) {
    let mycro = this;
    if (!mycro.services) {
        return done('Please place this hook after the `services` hook');
    }

    mycro.services.error = require('./services/error')(mycro);
    done();
};
