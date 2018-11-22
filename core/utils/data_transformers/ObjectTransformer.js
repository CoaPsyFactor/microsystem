"use strict";
var ObjectTransformer = (function () {
    function ObjectTransformer() {
    }
    ObjectTransformer.prototype.getTransformed = function (input) {
        if (typeof input === 'string') {
            try {
                return JSON.parse(input);
            }
            catch (exception) {
                console.warn('Input is not valid json');
                exception = null;
            }
        }
        return new Object(input);
    };
    return ObjectTransformer;
}());
exports.ObjectTransformer = ObjectTransformer;
