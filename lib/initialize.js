'use strict';

import boom from 'boom';
import _ from 'lodash';


/**
 * Create a new HttpError using the provided data
 * @param  {String|Number} status - the defined error code or http status
 * @param  {String} msg
 * @param  {Object} properties
 * @return {Error}
 */
export default function initialize(err, status, msg, properties) {
    if (_.isString(status)) {
        properties = _.merge({}, properties, this.get(status));
        status = properties.status;
    } else {
        properties = _.merge({}, properties);
        delete properties.status;
    }
    properties.detail = msg;
    if (typeof msg === 'string') {
        delete err.message;
    }
    if (!(err instanceof Error)) {
        err = boom.create(status, msg, properties);
    }
    err = boom.wrap(err, status, msg);
    err.data = properties;
    return err;
}
