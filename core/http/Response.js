"use strict";
var Response = (function () {
    function Response(serverResponse) {
        this.response = serverResponse;
    }
    /**
     *
     * Finish request with given status code
     *
     * @param {*} data
     * @param {Number} status
     */
    Response.prototype.send = function (data, status) {
        if (status === void 0) { status = 200; }
        this.response.statusCode = status;
        this.response.end(typeof data === 'object' ? JSON.stringify(data) : data.toString());
    };
    Response.prototype.dispose = function () {
        this.response = null;
    };
    return Response;
}());
exports.Response = Response;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Response;
