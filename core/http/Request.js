"use strict";
var url_1 = require("url");
var querystring_1 = require("querystring");
var Request = (function () {
    /**
     * @param {IncomingMessage} incomingMessage default node IncomingMessage object
     */
    function Request(incomingMessage) {
        this.urlParameters = {};
        this.clientRequest = incomingMessage;
        this.method = RequestMethod[incomingMessage.method];
        this.url = incomingMessage.url;
        this.urlData = url_1.parse(this.url);
        this.parameters = querystring_1.parse(this.urlData.query || '');
    }
    /**
     *
     * Attach route/url parameters to request class
     *
     * @param {Object} urlParameters Url parameter that should be set as used.
     */
    Request.prototype.setUrlParameters = function (urlParameters) {
        this.urlParameters = urlParameters;
    };
    /**
     *
     * Retrieves requested parameter from request query as its default type.
     * In case that parameter does not exists, defaultValue will be returned.
     *
     * @param {String} key Name of property from request query
     * @param {*} defaultValue Value that is returned in case that requested parameter does not exists
     * @param {IDataTransformer<?>} dataTransformer Transformer used to convert input data to desire value
     * @returns {*}
     */
    Request.prototype.get = function (key, defaultValue, dataTransformer) {
        if (defaultValue === void 0) { defaultValue = null; }
        if (dataTransformer === void 0) { dataTransformer = null; }
        var value = typeof this.parameters[key] === 'undefined' ? defaultValue : this.parameters[key];
        if (dataTransformer && typeof dataTransformer.getTransformed === 'function') {
            return dataTransformer.getTransformed(value);
        }
        return value;
    };
    /**
     *
     * Retrieves requested parameter from request query as number type.
     * In case that parameter does not exists or that it isn't number defaultValue will be returned
     *
     * @param {String} key Name of property from request query
     * @param {Number} defaultValue Value that is returned in case that requested parameter does not exists
     * @returns {Number}
     */
    Request.prototype.getNumeric = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var value = this.get(key, NaN);
        var numericValue = Number(value);
        return isNaN(numericValue) ? defaultValue : numericValue;
    };
    /**
     *
     * Retrieves value of parameter in route
     *
     * @param {String} key Name of route parameters placeholder, without :
     * @param {*} defaultValue Value that should be returned in case that parameter doesn't exists. Default: null
     *
     * @returns {*}
     */
    Request.prototype.getUrlParameter = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        return typeof this.urlParameters[key] === 'undefined' ? defaultValue : this.urlParameters[key];
    };
    /**
     *
     * Retrieves token from headers or query parameters
     *
     * @returns {String}
     */
    Request.prototype.getToken = function () {
        var token = this.clientRequest.headers['_service_token'] || '';
        return this.get('_service_token', token);
    };
    Request.prototype.dispose = function () {
        this.urlParameters = null;
        this.clientRequest = null;
        this.urlData = null;
        this.parameters = null;
    };
    return Request;
}());
exports.Request = Request;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Request;
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["GET"] = 0] = "GET";
    RequestMethod[RequestMethod["POST"] = 1] = "POST";
    RequestMethod[RequestMethod["PUT"] = 2] = "PUT";
    RequestMethod[RequestMethod["DELETE"] = 3] = "DELETE";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
