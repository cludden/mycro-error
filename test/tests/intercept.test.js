/* jshint expr:true */
'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    _ = require('lodash');

let expect = chai.expect;

function errorProneFunction(obj, cb) {
    process.nextTick(function() {
        return cb(new Error('Something unexpected'));
    });
}

function okFunction(obj, cb) {
    process.nextTick(function() {
        return cb(null, 'ok!');
    });
}

describe('#intercept()', function() {
    it('should intercept a truthy error value', function(done) {
        sinon.spy(mycro.services.error, 'notify');
        errorProneFunction({}, mycro.services.error.intercept(true, function() {
            expect(mycro.services.error.notify).to.have.been.called;
            mycro.services.error.notify.restore();
            done();
        }));
    });

    it('should extract the error from a successful callback if no `passErrorToCallback` option is provided', function(done) {
        sinon.spy(mycro.services.error, 'notify');
        okFunction({}, mycro.services.error.intercept(function(val) {
            expect(mycro.services.error.notify).to.not.have.been.called;
            mycro.services.error.notify.restore();
            expect(val).to.equal('ok!');
            done();
        }));
    });
});
