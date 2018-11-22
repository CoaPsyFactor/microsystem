'use strict';

import { IRole } from '../gatekeeper/Role';

import { Request } from '../http/Request';
import { Response } from '../http/Response';
import {IDisposable} from '../System';
import Keeper, {IKeeperToken} from '../gatekeeper/Keeper';
import {ServiceHttpController} from "./ServiceHttpController";

/**
 * Service is singleton, which means that same instance of one service is shared through out all http requests
 * Service controller is the one that has new instance on each request
 */
export abstract class Service implements IDisposable
{
    /** @param {Number} port Port on which is service listening */
    public readonly port: Number;

    /** @param {String} name Name of service */
    public readonly name: string;

    /**
     *
     * Service controller that response to Http requests
     * Should return new instance of controller class unless controller is also shared through out all requests
     *
     * @type {ServiceHttpController}
     */
    public abstract getServiceHttpController<T extends Service>(): ServiceHttpController<T>;

    public keeper: Keeper;

    /**
     * Creates token with role attached to current service
     */
    public abstract createToken(): Promise<IKeeperToken>;

    /**
     *
     * @param {String} name Name of service
     * @param {Number} port Port on wich service should listen
     */
    public constructor(name: string, port: Number)
    {

        this.port = port;

        this.name = name;

    }

    /**
     * Clear data when service is disabled/crashed
     */
    public dispose()
    {

        this.keeper = null;

    }

}

export interface IConfiguration
{
    /** @param {Number} port Port on which is service listening */
    readonly port: Number;

    /** @param {String} name Name of service */
    readonly name: string;

    /** @param {IRole[]} roles Roles that has access to service */
    readonly roles: IRole[];
}