/*
 * logout.js - general logout function for zombieFuzz
 */

module.exports = function(state,js,cb) {
        var url = js.url ? js.url : state.url;
        state.browser.visit(url, function() {
                console.log("connected")
                try {
                        state.browser.clickLink('Logout', function() {
                                console.log("logging out")
                                return cb()
                        })
                } catch(err) {
                        console.log("logout:err",err)
                        return cb(false)
                }

        })
}
