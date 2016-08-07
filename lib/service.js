'use strict';

import addNotifier from './add-notifier';
import defineResponseHandler from './define-response-handler';
import get from './get';
import initialize from './initialize';
import notify from './notify';
import sendResponse from './send-response';
import validateErrorDefinitions from './validate-error-definitions';
import wrap from './wrap';
import wrapSync from './wrap-sync';

class ErrorService {
    constructor(errors) {
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
    }
}

ErrorService.prototype.addNotifier = addNotifier;
ErrorService.prototype.defineResponseHandler = defineResponseHandler;
ErrorService.prototype.get = get;
ErrorService.prototype.initialize = initialize;
ErrorService.prototype.notify = notify;
ErrorService.prototype.sendResponse = sendResponse;
ErrorService.prototype.validateErrorDefinitions = validateErrorDefinitions;
ErrorService.prototype.wrap = wrap;
ErrorService.prototype.wrapSync = wrapSync;

export default ErrorService;
