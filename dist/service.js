'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _addNotifier = require('./add-notifier');

var _addNotifier2 = _interopRequireDefault(_addNotifier);

var _defineResponseHandler = require('./define-response-handler');

var _defineResponseHandler2 = _interopRequireDefault(_defineResponseHandler);

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _initialize = require('./initialize');

var _initialize2 = _interopRequireDefault(_initialize);

var _notify = require('./notify');

var _notify2 = _interopRequireDefault(_notify);

var _sendResponse = require('./send-response');

var _sendResponse2 = _interopRequireDefault(_sendResponse);

var _validateErrorDefinitions = require('./validate-error-definitions');

var _validateErrorDefinitions2 = _interopRequireDefault(_validateErrorDefinitions);

var _wrap = require('./wrap');

var _wrap2 = _interopRequireDefault(_wrap);

var _wrapSync = require('./wrap-sync');

var _wrapSync2 = _interopRequireDefault(_wrapSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorService = function ErrorService(errors) {
    _classCallCheck(this, ErrorService);

    this.notifiers = [];

    this.addNotifier = this.addNotifier.bind(this);
    this.defineResponseHandler = this.defineResponseHandler.bind(this);
    this.get = this.get.bind(this);
    this.initialize = this.initialize.bind(this);
    this.notify = this.notify.bind(this);
    this.sendResponse = this.sendResponse.bind(this);
    this.validateErrorDefinitions = this.validateErrorDefinitions.bind(this);
    this.wrap = this.wrap.bind(this);
    this.wrapSync = this.wrapSync.bind(this);

    this.errors = this.validateErrorDefinitions(errors);
};

ErrorService.prototype.addNotifier = _addNotifier2.default;
ErrorService.prototype.defineResponseHandler = _defineResponseHandler2.default;
ErrorService.prototype.get = _get2.default;
ErrorService.prototype.initialize = _initialize2.default;
ErrorService.prototype.notify = _notify2.default;
ErrorService.prototype.sendResponse = _sendResponse2.default;
ErrorService.prototype.validateErrorDefinitions = _validateErrorDefinitions2.default;
ErrorService.prototype.wrap = _wrap2.default;
ErrorService.prototype.wrapSync = _wrapSync2.default;

exports.default = ErrorService;
module.exports = exports['default'];