'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = validateErrorDefinitions;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validate a potential error definition, applying defaults where necessary.
 * @param  {Object} errors
 * @return {Object}
 */
function validateErrorDefinitions(errors) {
    if (!(_lodash2.default.isObject(errors) && !_lodash2.default.isFunction(errors))) {
        errors = {};
    }

    var initialErrors = {
        'undefined': {
            status: 500,
            title: 'Undefined Error',
            code: 'undefined-error'
        }
    };

    return Object.keys(errors).reduce(function (memo, code) {
        var err = _validateDefinition(errors[code], code);
        memo[code] = err;
        return memo;
    }, initialErrors);
}

/**
 * Validate an invidividual error definition.
 * @param  {*} err
 * @param  {String} code - error code
 * @return {Object}
 */
function _validateDefinition(err, code) {
    // if a non object definition passed, reset
    if (!(_lodash2.default.isObject(err) && !_lodash2.default.isFunction(err))) {
        err = {};
    }

    // validate status
    var status = err.status;
    if (!_lodash2.default.isInteger(status)) {
        status = 500;
    }
    if (status < 400 || status >= 600) {
        status = 500;
    }
    err.status = status;

    // apply default title
    if (!_lodash2.default.isString(err.title)) {
        err.title = _lodash2.default.startCase(code);
    }

    if (!_lodash2.default.isString(err.code)) {
        err.code = _lodash2.default.kebabCase(code);
    }

    return err;
}
module.exports = exports['default'];