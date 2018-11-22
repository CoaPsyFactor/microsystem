import {IServiceHandler} from '../services/ServiceHttpController';
import {Service} from '../services/Service';
import {RequestMethod, default as Request} from './Request';
import {ServiceHttpController} from "../services/ServiceHttpController";

export default class Router
{

    /**
     *
     * Prepare route regular expressions and sort order of routes executing, based on parameters count
     *
     * @param {ServiceHttpController} serviceHttpController
     */
    public parseServiceRoutes(serviceHttpController: ServiceHttpController<Service>) : void
    {
        let id: number = 0;

        (function parseRoute() : void {

            if ( false === id < serviceHttpController.routes.length) {
                return;
            }

            serviceHttpController.routes[id].parameters = [];

            let parsedRoute: string = serviceHttpController.routes[id].route.replace(/\:[a-z0-9\_]+/ig, (parameter) : string => {

                let parameterIdentifier  = parameter.substr(1);

                serviceHttpController.routes[id].parameters.push(parameterIdentifier);

                return '(.+)';

            });

            serviceHttpController.routes[id].routeRegExp = new RegExp(parsedRoute);

            id++;

            return parseRoute();

        })();

        serviceHttpController.routes.sort((routeA, routeB)=> {

            let routeARank: number = routeA.parameters.length;

            let routeBRank: number = routeB.parameters.length;

            return routeARank < routeBRank ? -1 : routeARank > routeBRank ? 1 : 0;

        });

    }

    /**
     *
     * Retrieve corresponding service handler and url parameters for specific url
     *
     * @param {Request} request
     * @param {ServiceHttpController} serviceHttpController
     * @return {{handler: IServiceHandler, parameters: {[p: string]: string}}}
     */
    public getRouterHandlerData(request: Request, serviceHttpController: ServiceHttpController<Service>) : IRouteHandlerData
    {
        let id: number = 0;

        let parameters: {[parameter: string]: string} = {};

        let handler: IServiceHandler = (function processRoute() : IServiceHandler {

            if (false === id < serviceHttpController.routes.length) {
                return null;
            }

            let route: IRoute = serviceHttpController.routes[id];

            let routeData = route.routeRegExp.exec(request.url);

            if (routeData && routeData instanceof Array) {

                if (route.methods instanceof Array && route.methods.length && -1 === route.methods.indexOf(request.method)) {
                    return null;
                }

                routeData.shift();

                routeData.map((parameter, index) => {
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

        }
    }
}

/**
 * Signature of data that are retrieved while handling one service http request
 */
export interface IRouteHandlerData
{

    handler: IServiceHandler,

    route: IRoute,

    parameters: {[parameter: string]: string}
}

/**
 * Signature of Service Http Controller route
 */
export interface IRoute
{
    readonly route: string;

    readonly handler: IServiceHandler;

    readonly methods?: RequestMethod[];

    roles?: any[];

    parameters?: any[];

    rank?: Number;

    routeRegExp?: RegExp;
}

export { Router }