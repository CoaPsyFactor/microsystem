"use strict";
var IntegerTransformer = (function () {
    function IntegerTransformer() {
    }
    /**
     *
     * Return input value converted into integer
     *
     * @param {*} input
     * @returns {number}
     */
    IntegerTransformer.prototype.getTransformed = function (input) {
        var output = 0;
        try {
            output = parseInt(input);
        }
        catch (exception) {
            exception = null;
        }
        return output;
    };
    return IntegerTransformer;
}());
exports.IntegerTransformer = IntegerTransformer;
