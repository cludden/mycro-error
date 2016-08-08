'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = get;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieve an error definition. If not found, return a generic "undefined-error" definition.
 * @param  {String} code
 * @return {Object}
 */
function get(code) {
    var err = _lodash2.default.get(this.errors, code, {
        status: 500,
        title: 'Undefined Error',
        code: 'undefined-error'
    });
    return _lodash2.default.merge({}, err);
}
module.exports = exports['default'];