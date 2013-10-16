/*
 * clickLink.js - genral routine to click a link
 *
 */
winston = require('winston');

module.exports = function(state,js,cb) {

    var query = "input";
    var fields = "";

    if(js.fields) {
        fields = js.fields;
        query = query + "[" + fields + "]";
    }

    try {
        var inputs = state.browser.document.querySelectorAll(query);
        $$(inputs).each(function(index,value) {
            // temporary debugging
            console.log("input value:", "name="+$$(value).attr('name'), "id="+$$(value).attr('id'))
        })
        return cb()
    } catch(err) {
        console.log("inputs: error", err);
        return cb()
    }
}
