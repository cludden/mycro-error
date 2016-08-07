'use strict';

import ErrorService from '../../lib/service';
import test from 'tape';

const errors = {
    'my-error': {
        status: 400,
        title: 'My Error'
    }
};
const errorService = new ErrorService(errors);

test('#get should be defined', function(t) {
    t.equal(typeof errorService.get, 'function', 'should be a function');
    t.end();
});

test('#get should retrieve a copy of the error definition', function(t) {
    const err = errorService.get('my-error');
    const myError = errors['my-error'];
    t.equal(typeof err, 'object', 'should return an object');
    t.notEqual(err, myError, 'should not return a reference to the definition');
    t.equal(err.status, myError.status, 'should have status: ' + myError.status);
    t.equal(err.title, myError.title, 'should have title: ' + myError.title);
    t.equal(err.code, 'my-error', 'should have code: my-error');
    t.end();
});

test('#get should retrieve a copy of the "undefined-error" definition if the requested definition does not exist', function(t) {
    const err = errorService.get('my-other-error');
    t.equal(typeof err, 'object', 'should return an object');
    t.equal(err.status, 500, 'should have status: 500');
    t.equal(err.title, 'Undefined Error', 'should have title: Undefined Error');
    t.equal(err.code, 'undefined-error', 'should have code: undefined-error');
    t.end();
});
