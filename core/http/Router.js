"use strict";
var Router = (function () {
    function Router() {
    }
    /**
     *
     * Prepare route regular expressions and sort order of routes executing, based on parameters count
     *
     * @param {ServiceHttpController} serviceHttpController
     */
    Router.prototype.parseServiceRoutes = function (serviceHttpController) {
        var id = 0;
        (function parseRoute() {
            if (false === id < serviceHttpController.routes.length) {
                return;
            }
            serviceHttpController.routes[id].parameters = [];
            var parsedRoute = serviceHttpController.routes[id].route.replace(/\:[a-z0-9\_]+/ig, function (parameter) {
                var parameterIdentifier = parameter.substr(1);
                serviceHttpController.routes[id].parameters.push(parameterIdentifier);
                return '(.+)';
            });
            serviceHttpController.routes[id].routeRegExp = new RegExp(parsedRoute);
            id++;
            return parseRoute();
        })();
        serviceHttpController.routes.sort(function (routeA, routeB) {
            var routeARank = routeA.parameters.length;
            var routeBRank = routeB.parameters.length;
            return routeARank < routeBRank ? -1 : routeARank > routeBRank ? 1 : 0;
        });
    };
    /**
     *
     * Retrieve corresponding service handler and url parameters for specific url
     *
     * @param {Request} request
     * @param {ServiceHttpController} serviceHttpController
     * @return {{handler: IServiceHandler, parameters: {[p: string]: string}}}
     */
    Router.prototype.getRouterHandlerData = function (request, serviceHttpController) {
        var id = 0;
        var parameters = {};
        var handler = (function processRoute() {
            if (false === id < serviceHttpController.routes.length) {
                return null;
            }
            var route = serviceHttpController.routes[id];
            var routeData = route.routeRegExp.exec(request.url);
            if (routeData && routeData instanceof Array) {
                if (route.methods instanceof Array && route.methods.length && -1 === route.methods.indexOf(request.method)) {
                    return null;
                }
                routeData.shift();
                routeData.map(function (parameter, index) {
                    parameters[route.parameters[index]] = parameter;
                });
                return route.handler;
            }
            id++;
            return processRoute();
        })();
        return {
            handler: handler,
            route: typeof serviceHttpController.routes[id] === 'undefined' ? null : serviceHttpController.routes[id],
            parameters: parameters
        };
    };
    return Router;
}());
exports.Router = Router;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Router;
