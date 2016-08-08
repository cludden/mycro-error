# mycro-error
an [errlich](https://github.com/cludden/errlich) hook for [mycro](https://github.com/cludden/mycro) apps.



## Installing
install
```bash
npm install --save mycro-error
```

add to hooks
```javascript
// in config/hooks.js
module.exports = {
    // ..
    'mycro-error',
    // ..
}
```



## Configure
define configuration file.
```javascript
// in /config/mycro-error.js

const bugsnag = require('bugsnag');

module.exports = function(mycro) {
    return {
        /**
         * Configure notifiers
         * @param  {[type]}   Err  [description]
         * @param  {Function} done [description]
         * @return {[type]}        [description]
         */
        configure(Err, done) {
            bugsnag.register({ apiKey: '*********' });
            Err.addNotifier(bugsnag.notify);
            process.nextTick(done);
        },

        /**
         * Define named errors.
         * @type {Object}
         */
        errors: {
            myError: {
                status: 500,
                title: 'My Custom Error'
            },
            myOtherError: {
                status: 403,
                title: 'Missing Token'
            }
        }
    };
}
```



## Testing
run tests
```bash
npm test
```

run coverage
```bash
npm run test
```



## Contributing
1. [Fork it](https://github.com/cludden/mycro-error/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request



## License
Copyright (c) 2016 Chris Ludden. Licensed under the [MIT License](LICENSE.md)
