'use strict';

import _ from 'lodash';


/**
 * Retrieve an error definition. If not found, return a generic "undefined-error" definition.
 * @param  {String} code
 * @return {Object}
 */
export default function get(code) {
    const err = _.get(this.errors, code, {
        status: 500,
        title: 'Undefined Error',
        code: 'undefined-error'
    });
    return _.merge({}, err);
}
