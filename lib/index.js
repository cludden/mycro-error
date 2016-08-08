'use strict';

import Errlich from 'errlich';
import { get, isFunction, set } from 'lodash';


/**
 * Hook function. Instantiates new errlich instance and exports it as
 * a mycro service.
 * @param  {Function} done
 * @this mycro
 */
export default function mycro_error(done) {
    const mycro = this;

    const config = get(mycro, 'config.mycro-error', get(mycro, '_config.mycro-error', {}));
    const errors = config.errors || {};
    const configure = config.configure;
    const serviceName = config.serviceName || 'error';

    const errlich = new Errlich(errors);
    set(mycro, `services.${serviceName}`, errlich);

    if (isFunction(configure)) {
        return configure(errlich, done);
    }
    process.nextTick(done);
}
