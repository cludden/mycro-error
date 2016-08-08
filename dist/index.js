'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = mycro_error;

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Mycro hook. Instantiates a new error service using errors defined in
 * "/config/errors.js" and exports the service as "error".
 * @param  {Function} done
 * @this mycro
 */
function mycro_error(done) {
    var mycro = this;

    // instantiate a new error service
    var errors = (0, _lodash.get)(mycro, 'config.errors', {});
    var errorService = new _service2.default(errors);

    // export it as a mycro service
    (0, _lodash.set)(mycro, 'services.error', errorService);

    process.nextTick(done);
}
module.exports = exports['default'];