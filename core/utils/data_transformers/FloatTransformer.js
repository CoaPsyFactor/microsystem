"use strict";
var FloatTransformer = (function () {
    function FloatTransformer() {
    }
    /**
     *
     * Return input value converted into float
     *
     * @param {*} input
     * @returns {number}
     */
    FloatTransformer.prototype.getTransformed = function (input) {
        var output = 0;
        try {
            output = parseFloat(input);
        }
        catch (exception) {
            exception = null;
        }
        return output;
    };
    return FloatTransformer;
}());
exports.FloatTransformer = FloatTransformer;
