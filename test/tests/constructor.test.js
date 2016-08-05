'use strict';

const ErrorService = require('../../lib/service');
const test = require('tape');


const nonObjects = [1, 'hello', /world/g, new Date()];
nonObjects.forEach(function(nonObject) {
    const desc = typeof nonObject + ' (' + nonObject.toString() + ')';
    test('should ignore "errors" if instantiated with a(n) ' + desc, function(t) {
        const errorService = new ErrorService(nonObject);
        t.equal(Object.keys(errorService.errors).length, 0, 'should set empty errors');
        t.end();
    });
});


test('should set valid errors property', function(t) {
    const errors = { myError: { status: 400, title: 'My Super Awesome Title' }};
    const errorService = new ErrorService(errors);
    t.deepEqual(errorService.errors.myError, errors.myError, 'should set errors property');
    t.end();
});
