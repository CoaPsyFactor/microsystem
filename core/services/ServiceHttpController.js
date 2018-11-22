"use strict";
/**
 * Service Http Controller is controller for http requests, unlike Service each http request uses new instance of
 * service http controller
 */
var ServiceHttpController = (function () {
    function ServiceHttpController(service) {
        this.service = service;
    }
    /**
     * Method called after requests finishes
     */
    ServiceHttpController.prototype.dispose = function () {
        this.service = null;
    };
    return ServiceHttpController;
}());
exports.ServiceHttpController = ServiceHttpController;
