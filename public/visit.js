/*
 * visits a url
 */

module.exports = function(state,js,cb) {
        state.browser.visit(js.url, function() {
                cb()
        })
}
