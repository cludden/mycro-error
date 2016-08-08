'use strict';


export default class Mycro {
    constructor(config) {
        this.config = config;
        this.log = function(...args) {
            console.error.apply(console, args);
        };
    }
}
