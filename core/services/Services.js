'use strict';
var Services = (function () {
    function Services() {
        /** @param {Service[]} services Registered services */
        this.services = {};
    }
    /**
     *
     * @param {Service} service Service that will be registered
     */
    Services.prototype.registerService = function (service) {
        if (typeof this.services[service.name] !== 'undefined') {
            throw new Error("Service " + service.name + " already registered.");
        }
        this.services[service.name] = service;
    };
    Services.prototype.registerServices = function (services) {
        var _this = this;
        services.forEach(function (service) {
            _this.registerService(service);
        });
    };
    Services.prototype.dispose = function () {
        // delete.this.services;
    };
    return Services;
}());
exports.Services = Services;
