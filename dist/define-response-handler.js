'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = defineResponseHandler;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defineResponseHandler(handler) {
    if (!_lodash2.default.isFunction(handler)) {
        throw new Error('Invalid handler passed to #defineResponseHandler');
    }
    this.responseHandler = handler;
}
module.exports = exports['default'];