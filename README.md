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

Define your applications errors in a config file
```javascript
// in config/errors.js
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

Convert errors into defined errors
```javascript
Posts.find({ published: true }, function(err, posts) {
    if (err) {
        err = errorService.get('query', err.message);
        console.log(err); // { status: 500, title: 'Database Query Error', detail: 'ECONNECT'}
    }
});
```

Or, better yet, wrap your callbacks
```javascript
joi.validate(req.body, schema, errorService.wrap('badRequest', function(err, data) {
    if (err) {
        console.log(err); // { status: 400, title: 'Bad Request', detail: 'Child \'attr\' fails because \'attr\' is required'}
    }
}));
```

And, you can even call your notifiers with the raw error first
```javascript
Posts.find({ published: true }, errorService.wrap(true, 'query', function(err, posts) {
    if (err) {
        console.log(err); // { status: 500, title: 'Database Query Error', detail: 'ECONNECT'}
    }
}));
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
