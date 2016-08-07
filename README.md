# mycro-error
a [mycro](https://github.com/cludden/mycro) hook that provides an `error` service with utility error handling methods courtesy of [boom](https://github.com/hapijs/boom).

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
    'mycro-error',
    // ..
}
```



## API

### *new* ErrorService(errors)
Constructor function.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| errors* | Object | error definitions |

###### Example
```javascript
const ErrorService = require('mycro-error/lib/service');

const errors = {
    accessTokenMissing: {
        status: 400,
        title: 'Missing Access Token',
        code: 'access-token-missing'
    }
};

const errorService = new Service(errors);
```
---

### #addNotifier(notifier)
Install a notifier.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| notifier* | Function | notifier function |

###### Example
```javascript
const bugsnag = require('bugsnag');
bugsnag.register({apiKey: '**************'})

errorService.addNotifier(bugsnag.notify);
```
---

### #get(name)
returns the error definition with the specified name or an undefined error definition.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| name* | String | definition key |

###### Example
```javascript
console.log(errorService.get('accessTokenMissing'));
```
---

### #initialize(err, nameOrStatus, msg, properties)
Convert an error into a boom error with additional definition data. See *wrap* for additional functionality.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| err* | Error | the error to convert. if not an Error instance, a new error will instantiated |
| nameOrStatus | Number,String | the name of the error definition or an http status |
| msg | String | custom message/detail to use. if not provided, the existing error message will be used |
| properties | Object | additional data to be included at `err.data` |

###### Returns
Error - the decorated error

###### Example
```javascript
if (err) {
    errorService.initialize(err, 'accessTokenMissing', 'No access token was found on the request', { id: req.id });
}
```
---

### #notify(...args)
Pass an error to all notifiers for handling.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| args* | * | all arguments will be passed to all notifiers |

###### Example
```javascript
if (err) {
    errorService.notify(err);
}
```
---

### #sendResponse(res, [cb])
Convenience function for sending error responses. If a callback is provided, it will be wrapped, and if an error is passed, this function will intercept it and pass it to the defined response handler. If no callback is provided, a new function will be returned, that will, if called with an error, pass it to the defined response handler.

###### Parameters
| Name | Type | Description |
| --- | --- | --- |
| res* | Response | the response instance |
| cb | Function | a callback function to intercept |

###### Example
```javascript
// in /app/controllers/users/get-by-id.js
module.exports = function(mycro) {
    return function getById(req, res, next) {
        const Err = mycro.services.error;
        const Users = mycro.models.user;

        Users.findById(req.params.user_id)
        .then(function(user) {
            res.status(200).send({ user });
        })
        .catch(Err.sendResponse(res))
    }
}

// in /app/controllers/user/query.js
module.exports = function(mycro) {
    return function query(req, res, next) {
        const Err = mycro.services.error;
        const Users = mycro.models.user;

        Users.find({}, Err.sendResponse(res, function(users) {
            res.status(200).send({ users });
        }));
    }
}
```
---

### #wrap(...args)
Wrap a callback function. If the callback is called with an error, convert it using the provided data, pass error to all notifiers, and then pass to the original callback. If no callback function is passed as an argument, a curried version of the wrapping function will be returned.

###### Example
```javascript
// convert any error passed by #doSomethingAsync using the "my-error" definition
doSomethingAsync(errorService.wrap('my-error', function(err, data) {
    console.log(err);
}));

// convert any error passed to a generic forbidden error.
doSomethingAsync(errorService.wrap(403, 'Uh oh! not allowed!', function(err, data) {
    console.log(err);
}));

const wrapReqError = errorService.wrap({ req: req.id });
const wrapMyError = wrapReqError('my-error');
doSomethingAsync(wrapMyError('my custom message', function(err, data) {
    console.log(err);
}));
```
---

### #wrapSync(...args)
Wrap a synchronous function that could potentially throw. Convert any error thrown using the provided data, pass error to all notifiers, and then throw the converted error. If no function is passed as an argument, a curried version of the wrapping function will be returned.

###### Example
```javascript
// convert any error passed by #doSomethingAsync using the "my-error" definition
function findMin(values) {
    if (!_.isArray(values) || !values.length) {
        throw new Error('Unable to find min of non/empty array');
    }
    return Math.min.apply(Math, values);
}
Transactions.findByAccountId(id)
.then(errorService.wrapSync(404, findMin))
.then(function(min) {
    res.status(200).send({ min });
})
.catch(Err.sendResponse(res))
```
---



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
