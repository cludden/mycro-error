'use strict';

module.exports = [
    'server',
    'connections',
    'models',
    'services',
    require('../../../index'),
    'policies',
    'controllers',
    require('../hooks/bootstrap'),
    'routes',
    'start'
];
