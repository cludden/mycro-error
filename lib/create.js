'use strict';

const createError = require('http-errors');
const _ = require('lodash');


/**
 * Create a new HttpError using the provided data
 * @param  {String|Number} statusOrCode - the defined error code or http status
 * @param  {String} msg
 * @param  {Object} properties
 * @param  {Functino} [ctx]
 * @return {HttpError}
 */
module.exports = function create(statusOrCode, msg, properties, ctx) {
    if (_.isNumber(statusOrCode)) {
        properties = _.merge({}, properties, this.get(statusOrCode));
        statusOrCode = properties.status;
    }
    const err = createError(statusOrCode, msg, properties);
    Error.captureStackTrace(err, ctx || create);
    return err;
};
