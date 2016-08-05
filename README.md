# mycro-error
a [mycro](https://github.com/cludden/mycro) hook that provides an `error` service with utility error handling methods.

## Install
install
```bash
npm install --save mycro-error
```

add to hooks
```javascript
// in config/hooks.js
module.exports = {
    // ..
    'services',
    'mycro-error',
    // ..
}
```



## Getting Started
Add a custom notifier.

*By default, the only notifier enabled is a `logger` notifier*
```javascript
// /hooks/bugsnag.js
const bugsnag = require('bugsnag');

module.exports = function(done) {
    const mycro = this;
    const errorService = mycro.services.error;

    bugsnag.register(/* stuff */);

    errorService.addNotifier(bugsnag.notify);
    process.nextTick(done);
}
```

Allow all notifiers a chance to process the error.
```javascript
// ..
if (err) {
    errorService.notify(err);
}
```

Define named application errors in a config file
```javascript
// in /config/errors.js
module.exports = {
    badRequest: {
        status: 400,
        title: 'Bad Request'
    },
    query: {
        status: 500,
        title: 'Database Query Error'
    }
}
```

wrap your functions and callbacks
```javascript
function someFunctionThatThrows() {
    throw new Error('Uh oh!');
}
const wrapped = errorService.wrapSync('someError', 'my custom error message', someFunctionThatThrows);

somethingAsync(errorService.wrap('badRequest', function(err, data) {
    if (err) {
        console.log(err);
    }
}));
```

Add a custom error response handler
```javascript
errorService.defineResponseHandler(function(res, error) {
    // inspect the error or serialize it
    const payload = serialize(error);
    res.status(error.status).json(payload);
});
```

Intercept a response handler
```javascript
somethingAsync(errorService.sendResponse(res, function(data) {
    // if an error occurred, res will be handled by the responseHandler
    // and this will never execute
    res.status(200).json({ data });
}))

SomePromise()
.then(function(data) {
    res.status(200).json({ data });
})
.catch(errorService.sendResponse(res))
```




## Testing
run the test suite
```bash
npm test
```



## Contributing
1. [Fork it](https://github.com/cludden/mycro-error/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request



## License
Copyright (c) 2016 Chris Ludden. Licensed under the [MIT License](LICENSE.md)
