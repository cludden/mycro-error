'use strict';

const _ = require('lodash');

/**
 * Validate a potential error definition, applying defaults where necessary.
 * @param  {Object} errors
 * @return {Object}
 */
module.exports = function validateErrorDefinitions(errors) {
    if (!(_.isObject(errors) && !_.isFunction(errors))) {
        errors = {};
    }
    return Object.keys(errors).reduce(function(memo, code) {
        const err = _validateDefinition(errors[code], code);
        memo[code] = err;
        return memo;
    }, {});
};


/**
 * Validate an invidividual error definition.
 * @param  {*} err
 * @param  {String} code - error code
 * @return {Object}
 */
function _validateDefinition(err, code) {
    // if a non object definition passed, reset
    if (!_.isObject(err)) {
        err = {};
    }

    // validate status
    let status = err.status;
    if (!_.isInteger(status)) {
        status = parseInt(err.status);
        if (isNaN(status)) {
            status = 500;
        }
    }
    if (status < 400 || status >= 600) {
        status = 500;
    }
    err.status = status;

    // apply default title
    if (!_.isString(err.title)) {
        err.title = _.startCase(code);
    }

    if (!_.isString(code)) {
        err.code = code;
    }

    return err;
}
