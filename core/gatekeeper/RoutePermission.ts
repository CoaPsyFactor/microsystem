import {IRole} from "./Role";

export class RoutePermission implements IRoutePermission
{

    readonly roles: {[roleId: string]: IRole} = {};

    hasAccess: boolean = false;

    public constructor(roles: IRole[], hasAccess: boolean)
    {

        roles.map((role: IRole) => {

            this.roles[role.id] = role;

        });

        this.hasAccess = hasAccess;

    }

    public hasRole(roleId: string): boolean
    {
        return typeof this.roles[roleId] !== 'undefined';
    }

}

export interface IRoutePermission
{

    readonly roles: {[roleId: string]: IRole};

    hasAccess?: boolean;

    hasRole(roleId: string): boolean;

}