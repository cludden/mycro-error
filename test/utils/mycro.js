'use strict';

function Mycro(errors) {

    if (errors) {
        this.config = { errors };
    }

    this.log = function() {
        const args = Array.prototype.slice.call(arguments);
        console.error.apply(console, args);
    };
}

module.exports = Mycro;
