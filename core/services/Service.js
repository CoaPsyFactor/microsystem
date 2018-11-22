'use strict';
/**
 * Service is singleton, which means that same instance of one service is shared through out all http requests
 * Service controller is the one that has new instance on each request
 */
var Service = (function () {
    /**
     *
     * @param {String} name Name of service
     * @param {Number} port Port on wich service should listen
     */
    function Service(name, port) {
        this.port = port;
        this.name = name;
    }
    /**
     * Clear data when service is disabled/crashed
     */
    Service.prototype.dispose = function () {
        this.keeper = null;
    };
    return Service;
}());
exports.Service = Service;
