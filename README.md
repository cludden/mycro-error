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
Add a custom notifier. *By default, the only notifier enabled is a `logger` notifier*
```javascript
// hooks/bugsnag.js
var bugsnag = require('bugsnag');

module.exports = function(done) {
    let mycro = this;
    bugsnag.register(/* stuff */);
    mycro.services.error.addNotifier(bugsnag.notify);
    done();
}
```

Handle an error
```javascript
let errorService = mycro.services.error;
// ..
if (err) {
    errorService.notify(err);
}
```

Intercept an error
```javascript
// default functionality
somethingAsync(errorService.intercept(function(err, val) {
    // if an error occurred, all notifiers will be called with the
    // error, and the error will be available for additional handling here
}));

// prevent the callback from executing
somethingAsync(errorService.intercept(true, function(val) {
    // if an error occurred, all notifiers will be called with the
    // error, and this callback will never be called.
}));
```

Add a custom error response handler
```javascript
errorService.responseHandler = function(res, error) {
    // inspect the error or serialize it
    res.json(500, {errors: [error]});
}
```

Intercept a response handler
```javascript
async.waterfall([
    function findData(fn) {
        // ..
    },

    function processData(data, fn) {
        // ..
    }
], errorService.interceptResponse(res, function(data) {
    res.json(200, {data: data});
}));
```
