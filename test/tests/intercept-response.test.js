'use strict';

var chai = require('chai'),
    sinon = require('sinon');

let expect = chai.expect;

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
});
