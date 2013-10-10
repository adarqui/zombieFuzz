/*
 * login.js - genral login routine for zombieFuzz
 *
 */
winston = require('winston');

module.exports = function(state,js,cb) {
        var url = js.url ? js.url : state.url;
        state.browser.visit(url, function() {
                try {
                        for (var k in js) {
                                var v = js[k]
                                if(k == 'op' || k == 'button') continue;
                                state.browser.fill(k,v)
                        }
                        if(js.button) {
                                state.browser.clickLink(js.button, function() {
//                                        console.log(state.browser.html())
                                        return cb()
                                })
                        } else {
                                return cb()
                        }
                } catch(err) {
                        return cb()
                }
        })
}
