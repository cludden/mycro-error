'use strict';

import ErrorService from './service';
import { get, set } from 'lodash';


/**
 * Mycro hook. Instantiates a new error service using errors defined in
 * "/config/errors.js" and exports the service as "error".
 * @param  {Function} done
 * @this mycro
 */
export default function mycro_error(done) {
    const mycro = this;

    // instantiate a new error service
    const errors = get(mycro, 'config.errors', get(mycro, '_config.errors', {}));
    const errorService = new ErrorService(errors);

    // export it as a mycro service
    set(mycro, 'services.error', errorService);

    process.nextTick(done);
}
