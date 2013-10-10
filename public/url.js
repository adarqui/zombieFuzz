/*
 * Sets a general purpose url for subsequent requests
 */

module.exports = function(state,js,cb) {
        state.url = js.url
        return cb()
}
