"use strict";
var http_1 = require("http");
var cluster_1 = require("cluster");
var Request_1 = require("./http/Request");
var Response_1 = require("./http/Response");
var Router_1 = require("./http/Router");
var Keeper_1 = require("./gatekeeper/Keeper");
var ServiceHttpController_1 = require("./services/ServiceHttpController");
var Micro;
(function (Micro) {
    var System = (function () {
        /**
         *
         * @param {ISystemConfiguration} [configuration]
         */
        function System(configuration) {
            /** @param {String} Binding IP address */
            this.ip = '127.0.0.1';
            /** @param {RegExp} Regular expression for checking ip address */
            this.ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            this.crashedServices = {};
            if (typeof configuration.ip === 'string' && null !== configuration.ip.match(this.ipRegex)) {
                this.ip = configuration.ip;
            }
            else if (cluster_1.isMaster) {
                console.log("No IP provided, leaving default " + this.ip);
            }
            this.maxServiceCrash = configuration.serviceMaxCrashTimes || 0;
            this.router = new Router_1.default();
            this.keeper = new Keeper_1.default(configuration.roles);
            this.roles = configuration.roles;
        }
        /**
         * Iterate through all registered services and triggers their cluster process creation
         */
        System.prototype.start = function (services) {
            var serviceNames = Object.keys(services.services);
            var self = this;
            (function setupService(serviceNames) {
                var serviceName = serviceNames.shift();
                if (typeof serviceName === 'undefined') {
                    return;
                }
                self.createServiceWorker(services.services[serviceName]);
                return setupService(serviceNames);
            })(serviceNames);
        };
        /**
         *
         * Creates cluster process for single service. Also keeps eye on process crashing to create new one.
         *
         * @param {Service} service
         */
        System.prototype.createServiceWorker = function (service) {
            var _this = this;
            var worker = cluster_1.fork({
                type: 'service',
                service: service.name,
                port: service.port
            });
            if (typeof this.crashedServices[service.name] === 'undefined') {
                this.crashedServices[service.name] = 0;
            }
            worker.on('disconnect', function (error) {
                _this.crashedServices[service.name]++;
                console.log("Service " + service.name + " stopped working. Restarting...");
                if (0 === _this.maxServiceCrash || _this.crashedServices[service.name] < _this.maxServiceCrash) {
                    _this.createServiceWorker(service);
                }
                else {
                    console.log("Service " + service.name + " crashed too many times.");
                    service.dispose();
                    worker.destroy();
                }
            });
        };
        /**
         *
         * Starts service on given port
         *
         * @param {Service} service Service to be execute
         * @param {Number} port Port on which service should be listening
         * @param {DataAccess} dataAccess connection to mongodb - required for gatekeeper
         */
        System.prototype.startService = function (service, port, dataAccess) {
            var _this = this;
            console.info("Starting service " + service.name + " on port " + port);
            var cleanPort = Number(port);
            if (isNaN(cleanPort) || 0 === cleanPort) {
                port = service.port;
            }
            this.keeper.setMongoDatabase(dataAccess);
            service.keeper = this.keeper;
            http_1.createServer(function (clientRequest, serverResponse) {
                if (false === cluster_1.isWorker) {
                    serverResponse.end("Invalid " + service.name + " service worker.");
                    return;
                }
                var serviceHttpController = service.getServiceHttpController();
                if (false === serviceHttpController instanceof ServiceHttpController_1.ServiceHttpController) {
                    serverResponse.end("Invalid http action on service " + service.name);
                }
                var request = new Request_1.Request(clientRequest);
                var response = new Response_1.Response(serverResponse);
                _this.router.parseServiceRoutes(serviceHttpController);
                var handlerData = _this.router.getRouterHandlerData(request, serviceHttpController);
                if (null === handlerData || null === handlerData.handler) {
                    response.send({ message: "Invalid " + service.name + " service handler." }, 404);
                    return;
                }
                request.setUrlParameters(handlerData.parameters);
                _this.keeper.getServiceRoleByToken(request.getToken(), service, function (accessRole, token) {
                    var routePermissions = _this.keeper.getPermissions(handlerData.route, accessRole);
                    serviceHttpController.handlePermission(token, routePermissions);
                    if (false === routePermissions.hasAccess) {
                        response.send({ message: 'Access Denied.' }, 403);
                    }
                    else {
                        handlerData.handler.call(null, request, response);
                    }
                    serviceHttpController.dispose();
                    serviceHttpController = null;
                    routePermissions = null;
                    request = null;
                    response = null;
                    handlerData.handler = null;
                    handlerData.route = null;
                    handlerData.parameters = null;
                    handlerData = null;
                    clientRequest = null;
                    serverResponse = null;
                });
            }).listen(port, function () {
                console.log("Service " + service.name + " listening on port " + port);
            });
            console.info("Service " + service.name + " started.");
        };
        System.prototype.dispose = function () {
            this.ip = null;
            this.keeper = null;
            this.ipRegex = null;
            this.router = null;
            this.roles = null;
            this.maxServiceCrash = null;
            this.crashedServices = null;
        };
        return System;
    }());
    Micro.System = System;
})(Micro = exports.Micro || (exports.Micro = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Micro;
