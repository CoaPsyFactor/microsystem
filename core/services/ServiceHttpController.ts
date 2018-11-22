import {IRoute} from "../http/Router";
import {Service} from "./Service";
import {IRoutePermission} from "../gatekeeper/RoutePermission";
import {IDisposable} from "../System";
import {Request} from '../http/Request';
import {Response} from '../http/Response';

/**
 * Service Http Controller is controller for http requests, unlike Service each http request uses new instance of
 * service http controller
 */
export abstract class ServiceHttpController<T extends Service> implements IDisposable
{
    /**
     *
     * Routes for service actions
     *
     * @type {IRoute[]}
     */
    public abstract readonly routes: IRoute[];

    /**
     *
     * Service that holds current http controller
     *
     * @type {Service}
     */
    protected service: T;

    public constructor(service: T)
    {

        this.service = service;

    }

    /**
     * Method called after requests finishes
     */
    public dispose(): void
    {

        this.service = null;

    }

    /**
     *
     * Custom processor for permission that was found on given token.
     *
     * To deny request access just change "permission.hasAccess" to false
     *
     * @param {String} token
     * @param {IRoutePermission} permission
     */
    public abstract handlePermission(token: string, permission: IRoutePermission): void;

}

/**
 * Signature of method that is used to handle HTTP request
 */
export interface IServiceHandler
{
    (request: Request, response: Response): Response
}
