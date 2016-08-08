'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initialize;

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a new HttpError using the provided data
 * @param  {String|Number} status - the defined error code or http status
 * @param  {String} msg
 * @param  {Object} properties
 * @return {Error}
 */
function initialize(err, status, msg, properties) {
    if (_lodash2.default.isString(status)) {
        properties = _lodash2.default.merge({}, properties, this.get(status));
        status = properties.status;
    } else {
        properties = _lodash2.default.merge({}, properties);
        delete properties.status;
    }
    properties.detail = msg;
    if (typeof msg === 'string') {
        delete err.message;
    }
    if (!(err instanceof Error)) {
        err = _boom2.default.create(status, msg, properties);
    }
    err = _boom2.default.wrap(err, status, msg);
    err.data = properties;
    return err;
}
module.exports = exports['default'];