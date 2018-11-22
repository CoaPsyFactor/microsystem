import { ServerResponse, IncomingMessage, createServer } from 'http';
import { fork, isMaster, isWorker, Worker } from 'cluster';

import { Services } from './services/Services';
import { Service } from './services/Service';

import { Request } from './http/Request';
import { Response } from './http/Response';
import Router from './http/Router';
import {IRouteHandlerData} from './http/Router';
import Keeper from './gatekeeper/Keeper';
import DataAccess from './dataaccess/DataAccess';
import Roles from './gatekeeper/Roles';
import {IRoutePermission} from "./gatekeeper/RoutePermission";
import {ServiceHttpController} from "./services/ServiceHttpController";

export namespace Micro {
    export class System implements IDisposable
    {

        /** @param {String} Binding IP address */
        private ip: string = '127.0.0.1';

        /** @param {RegExp} Regular expression for checking ip address */
        private ipRegex: RegExp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        /** @param {Router} router Router instance used to determine request route and route parameters */
        private router: Router;

        /** @param {Keeper} keeper Instance of GateKeeper used to check and validate tokens and permissions */
        private keeper: Keeper;

        /** @param {Roles} roles Instance of all registered roles for current system. */
        private roles: Roles;

        /** @param {Number} maxServiceCrash Maximum number of crashed services restoration */
        private maxServiceCrash: number;

        private crashedServices: {[serviceName: string]: number} = {};

        /**
         *
         * @param {ISystemConfiguration} [configuration]
         */
        public constructor(configuration: ISystemConfiguration)
        {

            if (typeof configuration.ip === 'string' && null !== configuration.ip.match(this.ipRegex)) {

                this.ip = configuration.ip;

            } else if (isMaster) {

                console.log(`No IP provided, leaving default ${this.ip}`);

            }

            this.maxServiceCrash = configuration.serviceMaxCrashTimes || 0;

            this.router = new Router();

            this.keeper = new Keeper(configuration.roles);

            this.roles = configuration.roles;
        }

        /**
         * Iterate through all registered services and triggers their cluster process creation
         */
        public start(services: Services)
        {

            let serviceNames: string[] = Object.keys(services.services);

            let self: System = this;

            (function setupService(serviceNames: string[]): void {

                let serviceName: string = serviceNames.shift();

                if (typeof serviceName === 'undefined') {
                    return;
                }

                self.createServiceWorker( services.services[serviceName] );

                return setupService(serviceNames);

            })(serviceNames);
        }

        /**
         *
         * Creates cluster process for single service. Also keeps eye on process crashing to create new one.
         *
         * @param {Service} service
         */
        public createServiceWorker(service: Service) : void
        {

            let worker: Worker = fork({

                type: 'service',

                service: service.name,

                port: service.port

            });

            if (typeof this.crashedServices[service.name] === 'undefined') {

                this.crashedServices[service.name] = 0;

            }

            worker.on('disconnect', (error) => {

                this.crashedServices[service.name]++;

                console.log(`Service ${service.name} stopped working. Restarting...`);

                if (0 === this.maxServiceCrash || this.crashedServices[service.name] < this.maxServiceCrash) {

                    this.createServiceWorker(service);

                } else {

                    console.log(`Service ${service.name} crashed too many times.`);

                    service.dispose();

                    worker.destroy();

                }

            });

        }

        /**
         *
         * Starts service on given port
         *
         * @param {Service} service Service to be execute
         * @param {Number} port Port on which service should be listening
         * @param {DataAccess} dataAccess connection to mongodb - required for gatekeeper
         */
        public startService(service: Service, port: Number, dataAccess: DataAccess)
        {

            console.info(`Starting service ${service.name} on port ${port}`);

            let cleanPort: any = Number(port);

            if ( isNaN(cleanPort) || 0 === cleanPort ) {

                port = service.port;

            }

            this.keeper.setMongoDatabase(dataAccess);

            service.keeper = this.keeper;

            createServer( (clientRequest: IncomingMessage, serverResponse: ServerResponse) => {

                if (false === isWorker) {

                    serverResponse.end(`Invalid ${service.name} service worker.`);

                    return;

                }

                let serviceHttpController = service.getServiceHttpController();

                if (false === serviceHttpController instanceof ServiceHttpController) {

                    serverResponse.end(`Invalid http action on service ${service.name}`);

                }

                let request: Request = new Request(clientRequest);

                let response: Response = new Response(serverResponse);

                this.router.parseServiceRoutes(serviceHttpController);

                let handlerData: IRouteHandlerData = this.router.getRouterHandlerData(request, serviceHttpController);

                if (null === handlerData || null === handlerData.handler) {

                    response.send({message: `Invalid ${service.name} service handler.`}, 404);

                    return;

                }

                request.setUrlParameters(handlerData.parameters);

                this.keeper.getServiceRoleByToken(request.getToken(), service, (accessRole, token) => {

                    let routePermissions: IRoutePermission = this.keeper.getPermissions(handlerData.route, accessRole);

                    serviceHttpController.handlePermission(token, routePermissions);

                    if (false === routePermissions.hasAccess) {

                        response.send({message: 'Access Denied.'}, 403);

                    } else {

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

            }).listen(port, () => {

                console.log(`Service ${service.name} listening on port ${port}`);

            });

            console.info(`Service ${service.name} started.`);

        }

        public dispose()
        {

            this.ip = null;

            this.keeper = null;

            this.ipRegex = null;

            this.router = null;

            this.roles = null;

            this.maxServiceCrash = null;

            this.crashedServices = null;

        }
    }

    export interface ISystemConfiguration
    {

        roles: Roles;

        ip?: string;

        serviceMaxCrashTimes?: number;

        maxServices?: number;

    }
}

export interface IDisposable
{
    dispose();
}

export default Micro;