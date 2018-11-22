"use strict";
var System_1 = require("./core/System");
var cluster_1 = require("cluster");
var process_1 = require("process");
var Services_1 = require("./core/services/Services");
var DataAccess_1 = require("./core/dataaccess/DataAccess");
var Roles_1 = require("./core/gatekeeper/Roles");
var GuestRole_1 = require("./app/roles/GuestRole");
var UserRole_1 = require("./app/roles/UserRole");
var ModeratorRole_1 = require("./app/roles/ModeratorRole");
var SuperUserRole_1 = require("./app/roles/SuperUserRole");
var CacheService_1 = require("./app/services/Cache/CacheService");
var registeredServices = [
    new CacheService_1.CacheService(8889)
];
var roles = new Roles_1.default();
roles.addRoles([
    new GuestRole_1.default(),
    new UserRole_1.default(),
    new ModeratorRole_1.default(),
    new SuperUserRole_1.default()
]);
var micro = new System_1.default.System({ roles: roles, serviceMaxCrashTimes: 5 });
var processType = typeof process_1.env.type === 'string' && process_1.env.type === 'service' ? process_1.env.type : null;
var serviceName = typeof process_1.env.service === 'string' ? process_1.env.service : null;
var servicePort = false === isNaN(Number(process_1.env.port || NaN)) ? process_1.env.port : null;
if (cluster_1.isMaster) {
    var services = new Services_1.Services();
    services.registerServices(registeredServices);
    micro.start(services);
}
else if (cluster_1.isWorker && processType && serviceName) {
    var appConfig = require('./app/config.json');
    new DataAccess_1.default(appConfig.mongo || {}, function (dataAccess) {
        console.log('Established connection with MongoDB');
        var registeredService = [];
        registeredService = registeredServices.filter(function (service, index) {
            if (service.name === serviceName && 0 === registeredService.length) {
                micro.startService(service, servicePort, dataAccess);
                return true;
            }
            // Dispose service as its not usable
            service.dispose();
            delete registeredServices[index];
            return false;
        });
        if (0 === registeredService.length) {
            throw new Error("Failed to initialize service " + serviceName);
        }
        // Free some memory :)
        delete registeredService[0];
    });
}
