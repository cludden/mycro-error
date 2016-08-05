'use strict';

const ErrorService = require('./service');
const _ = require('lodash');


/**
 * Mycro hook function
 * @param  {Function} done
 * @this mycro
 */
module.exports = function mycro_error(done) {
    const mycro = this;

    // instantiate a new error service
    const errors = _.get(mycro, 'config.errors', {});
    const errorService = new ErrorService(errors);

    // export it as a mycro service
    _.set(mycro, 'services.error', errorService);

    process.nextTick(done);
};
