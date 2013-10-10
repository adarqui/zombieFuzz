/*
 * clickLink.js - genral routine to click a link
 *
 */
winston = require('winston');

module.exports = function(state,js,cb) {
        var url = js.url ? js.url : state.url;
        try {
                state.browser.clickLink(js.link, function() {
                        return cb()
                })
        } catch(err) {
                return cb()
        }
}
