'use strict';

const boom = require('boom');
const _ = require('lodash');


/**
 * Create a new HttpError using the provided data
 * @param  {String|Number} status - the defined error code or http status
 * @param  {String} msg
 * @param  {Object} properties
 * @return {Error}
 */
module.exports = function initialize(err, status, msg, properties) {
    const def = _.isString(status) ? this.get(status) : this.get('undefined');
    properties = _.merge({}, properties, def);
    if (_.isString(status)) {
        status = properties.status;
    } else {
        delete properties.status;
    }
    properties.detail = msg;
    if (typeof msg === 'string') {
        delete err.message;
    }
    if (!(err instanceof Error)) {
        err = boom.create(status, msg, properties);
    }
    err = boom.wrap(err, status, msg);
    err.data = properties;
    return err;
};
