'use strict';

import boom from 'boom';
import ErrorService from '../../lib/service';
import EventEmitter from 'events';
import httpMocks from 'node-mocks-http';
import td from 'testdouble';
import test from 'tape';


const errorService = new ErrorService();


test('#sendResponse should be defined', function(t) {
    t.equal(typeof errorService.sendResponse, 'function', 'should be a function');
    t.end();
});

test('#sendResponse should return a function if no callback is provided', function(t) {
    const res = httpMocks.createResponse({
        eventEmitter: EventEmitter
    });
    res.on('end', function() {
        t.equal(res.statusCode, 403, 'should have status: 403');
        t.end();
    });
    const sendError = errorService.sendResponse(res);
    const err = boom.forbidden();
    t.equal(typeof sendError, 'function', 'should be a function');
    sendError(err);
});

test('#sendResponse should wrap a callback function', function(t) {
    const res = httpMocks.createResponse({
        eventEmitter: EventEmitter
    });
    res.on('end', function() {
        t.equal(res.statusCode, 403, 'should have status: 403');
        t.error(td.verify(callback(), {times: 0}), 'should not call callback');
        t.end();
    });
    const callback = td.function();
    const fn = td.function();
    td.when(fn()).thenCallback(true);
    fn(errorService.sendResponse(res, callback));
});
