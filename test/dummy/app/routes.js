'use strict';

module.exports = function(mycro) {
    return {
        'v1.0.0': {
            '/health': {
                get(req, res) {
                    res.json(200, {status: 'healthy'});
                }
            },
            '/test': {
                '/error': {
                    get: 'test.throws'
                },
                '/ok': {
                    get: 'test.doesntThrow'
                }
            }
        }
    };
};
