/*
 * select.js - general routine to fire off a querySelector operation
 *
 */
winston = require('winston');

module.exports = function(state,js,cb) {

    var query = js.query

    try {
        var results = state.browser.document.querySelectorAll(query);
        return cb()
    } catch(err) {
        console.log("inputs: error", err);
        return cb()
    }
}
