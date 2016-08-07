'use strict';

import ErrorService from '../../lib/service';
import test from 'tape';

const errors = {
    myError: { status: 421, title: 'abcdefg', code: 'my-error' }
};
const errorService = new ErrorService(errors);

test('#initialize should be defined', function(t) {
    t.equal(typeof errorService.initialize, 'function', 'should be a function');
    t.end();
});

test('#initialize should wrap existing error with definition properties', function(t) {
    const def = errors.myError;
    const msg = 'custom message';
    const id = 5;
    const err = new Error('uh oh!');
    const initialized = errorService.initialize(err, 'myError', msg, { id });
    t.equal(err, initialized, 'should return the original error');
    t.equal(err.stack, initialized.stack, 'should retain original stack');
    t.equal(initialized.message, msg, 'should replace message');
    t.equal(typeof initialized.data, 'object', 'should add "data" attribute');
    t.equal(initialized.output.statusCode, def.status, 'should add status to output.statusCode');
    t.equal(initialized.data.title, def.title, 'should add title to data');
    t.equal(initialized.data.id, id, 'should include id in data');
    t.equal(initialized.data.code, def.code, 'should include code in data');
    t.equal(initialized.data.detail, msg, 'should include detail in data');
    t.end();
});

test('#initialize should wrap existing error with generic status properties', function(t) {
    const msg = 'custom message';
    const id = 5;
    const err = new Error('uh oh!');
    const initialized = errorService.initialize(err, 403, msg, { id });
    t.equal(err, initialized, 'should return the original error');
    t.equal(err.stack, initialized.stack, 'should retain the original stack');
    t.equal(initialized.message, msg, 'should replace message');
    t.equal(typeof initialized.data, 'object', 'should add "data" attribute');
    t.equal(initialized.output.statusCode, 403, 'should add status to output.statusCode');
    t.equal(initialized.output.payload.error, 'Forbidden', 'should have error set');
    t.end();
});

test('#initialize should instantiate new error if err is not an instanceof Error', function(t) {
    const def = errors.myError;
    const err = true;
    const initialized = errorService.initialize(err, 'myError');
    t.ok(initialized instanceof Error, 'should return an error');
    t.equal(initialized.message, 'Unknown', 'should not have a message');
    t.equal(initialized.output.statusCode, def.status, 'should include code in data');
    t.equal(initialized.data.title, def.title, 'should add title to data');
    t.equal(initialized.data.code, def.code, 'should include code in data');
    t.equal(initialized.data.detail, undefined, 'should include detail in data');
    t.end();
});
