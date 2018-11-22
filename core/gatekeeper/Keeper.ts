import {Service} from '../services/Service';

import {IRole, Role} from './Role';
import { Roles } from './Roles';
import {IRoute} from '../http/Router';
import {IDisposable} from '../System';
import DataAccess from '../dataaccess/DataAccess';
import GuestRole from '../../app/roles/GuestRole';

import randomString = require('randomstring');
import {IRoutePermission, RoutePermission} from "./RoutePermission";

export default class Keeper implements IDisposable
{
    /** @param {Number} DEFAULT_TOKEN_LIFE Default time of token existence in seconds */
    public static readonly DEFAULT_TOKEN_LIFE: number = 60;

    /** @param {Roles} roles Instance of 'GateKeeper.Roles' object that holds all existing roles */
    public readonly service: Service;

    /** @param {Object} database MongoDB connection handle database */
    private database: any;

    /** @param {Roles} registeredRoles All existing roles that are shared between requests for permission checking */
    public readonly registeredRoles: Roles;

    /** @param {GuestRole} guestRole Fallback role if none is registered */
    public readonly fallbackRole: Role;

    /**
     * @param {Roles} roles All existing roles that are shared between requests for permission checking
     */
    public constructor(roles: Roles)
    {

        this.registeredRoles = roles;

        this.fallbackRole = typeof roles.roles['fallback'] === 'undefined' ? new GuestRole() : roles.roles['fallback'] as Role;

    }

    /**
     *
     * Inserts role permission for token to mongo - ignores if duplicate token
     *
     * @param {Service} service
     * @param {Role} role
     * @param {*} entityId
     * @param {Function} callback
     *
     */
    public createServiceRoleToken(service: Service, role: Role, entityId: any, callback: Function)
    {
        let collection = this.database.collection('gatekeeper_tokens');

        (function insert() {

            let token: string = randomString.generate(64);

            collection.findOne({ token: token }, (error, foundEntity) => {

                if (error) {

                    return (typeof callback === 'function' ? callback.call(null, error, null) : null);

                }

                if (foundEntity) {

                    return insert();

                }

                let entity: IKeeperToken = {
                    token: token,
                    serviceIdentifier: service.name,
                    role: role.id,
                    lifeSpan: Keeper.DEFAULT_TOKEN_LIFE,
                    lastUsed: Math.round((new Date()).getTime() / 1000),
                    entityId: entityId
                };

                collection.insertOne(entity, (error, response) => {

                    if (error) {
                        throw error;
                    }

                    if (response && response.insertedId) {

                        entity.id = response.insertedId;

                        return (typeof callback === 'function' ? callback.call(null, null, entity) : null);

                    }

                    return (typeof callback === 'function' ? callback.call(null, null, null) : null);

                });

            });
        })();

    }

    /**
     *
     * @param {IRoute} route
     * @param {Role} role
     * @returns {IRoutePermission}
     */
    public getPermissions(route: IRoute, role: Role) : IRoutePermission
    {

        let roles: IRole[] = [];

        if (route.roles instanceof Array) {

            route.roles.map((routeRoleIdentifier: any) : void => {

                let routeRole: IRole = new routeRoleIdentifier() as IRole;

                if (role.id === routeRole.id) {

                    roles.push(role);

                }

                if (false === role.scope instanceof Array) {

                    return;

                }

                role.scope.map((roleScopeIdentifier: any) : void => {

                    let roleScope = new roleScopeIdentifier() as Role;

                    if (roleScope.id !== routeRole.id) {

                        return;

                    }

                    if (-1 === roles.indexOf(role)) {

                        roles.push(role);

                    }

                    roles.push(roleScope);

                });

            });

        }

        return new RoutePermission(roles, Object.keys(roles || {}).length > 0);

    }

    /**
     *
     * Set database parameter of current Keeper instance to MongoDB connection handler database
     *
     * @param {DataAccess} dataAccess
     */
    public setMongoDatabase(dataAccess: DataAccess) : void
    {
        if (dataAccess && dataAccess.getDatabase()) {
            this.database = dataAccess.getDatabase();
        }
    }

    /**
     *
     * TODO implement toke lifespan and remove it if its not valid
     *
     *
     * @param {String} token
     * @param {Service} service
     * @param {Function} onFinish
     * @return {IRole}
     */
    public getServiceRoleByToken(token: string, service: Service, onFinish: IServiceRoleCallback) : void
    {
        if (typeof this.database === 'undefined') {
            throw new Error('Missing MongoDB connection for Keeper.');
        }

        let collection = this.database.collection('gatekeeper_tokens');

        collection.findOne({ token: token, serviceIdentifier: service.name }, (error, entity) => {

             if (error) {
                 throw error;
             }

             if (null === entity) {

                 if (typeof onFinish === 'function') {

                     onFinish.call(null, this.fallbackRole, token);

                 }

                 return;

             }

             let roles: {[role: string]: Role} = this.registeredRoles.roles;

             let role: Role = typeof roles[entity.role] === 'undefined' ? null : roles[entity.role];

            if (typeof onFinish === 'function') {

                onFinish.call(null, role, token);

            }

        });
    }

    public dispose()
    {

        // delete.this.service;

        // delete.this.database;

        // delete.this.registeredRoles;

        // delete.this.fallbackRole;

    }
}

export interface IServiceRoleCallback
{
    /**
     *
     * NOTICE: REGISTERED ROLES SHARE SAME INSTANCE BETWEEN REQUESTS, DON'T AFFECT ROLE DIRECTLY INSTEAD MAKE CLONE
     * @param {Role} role Role corresponding to role name from entity.
     *
     */
    (role: Role, token: string) : void;
}

export interface IKeeperToken
{
    /** @param {String} token Token value */
    readonly token: string;

    /** @param {String} serviceIdentifier Name of service to which this token belongs */
    readonly serviceIdentifier: string;

    /** @param {String} role Name of role that has access to this token */
    readonly role: string;

    /** @param {Number} lifeSpan Life time of token, if not used for certain time becomes invalid */
    readonly lifeSpan: number;

    /** @param {Number} lastUsed Unix time stamp of when token was last accessed */
    lastUsed: number;

    /** @param {Number} id MongoDB ID value */
    id?: number;

    /** @param {*} entityId Value of custom Id for custom permissions */
    readonly entityId?: any;

}

export { Keeper }