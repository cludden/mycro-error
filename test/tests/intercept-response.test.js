'use strict';

var chai = require('chai');
var expect = require('chai').expect;
var httpMocks = require('node-mocks-http');
var sinon = require('sinon');
var _ = require('lodash');

describe('#interceptResponse()', function() {
    it('should intercept an error passed to a response handler and send a 500', function(done) {
        request.get('/test/error')
            .set({ 'accept-version': '^1.0.0' })
            .expect(500)
            .end(done);
    });

    it('should strip the error from the callback if no `passErrorToCallback` value is provided', function(done) {
        request.get('/test/ok')
            .set({ 'accept-version': '^1.0.0' })
            .expect(200)
            .expect(function(res) {
                expect(res.body).to.have.property('data', 'ok!');
            })
            .end(done);
    });

    it('should allow a custom response handler to be defined', function(done) {
        mycro.services.error.responseHandler = function(res, err) {
            res.json(403, {error: [err]});
        };
        sinon.spy(mycro.services.error, 'responseHandler');
        request.get('/test/error')
            .set({ 'accept-version': '^1.0.0' })
            .expect(403)
            .end(function(err) {
                mycro.services.error.responseHandler.restore();
                done(err);
            });
    });

    it('should call callback regardless of error', function(done) {
        var Err = mycro.services.error;
        var res = httpMocks.createResponse();
        sinon.spy(res, 'json');
        var spy = sinon.spy();
        var fn = Err.interceptResponse(res, spy);
        fn(new Error('something unexpected'), 'a');
        setTimeout(function() {
            var e = _.attempt(function() {
                expect(res.json).to.have.been.called;
                expect(spy).to.have.been.called;
                expect(spy.lastCall.args).to.eql(['a']);
            });
            done(e);
        }, 0);
    });

    it('should allow for the error to be passed to callback for additional handling', function(done) {
        var Err = mycro.services.error;
        var res = httpMocks.createResponse();
        sinon.spy(res, 'json');
        var spy = sinon.spy();
        var fn = Err.interceptResponse(res, true, spy);
        var unexpected = new Error('something unexpected');
        fn(new Error('something unexpected'), 'a');
        setTimeout(function() {
            var e = _.attempt(function() {
                expect(res.json).to.have.been.called;
                expect(spy).to.have.been.called;
                expect(spy.lastCall.args).to.eql([unexpected, 'a']);
            });
            done(e);
        }, 0);
    })
});
