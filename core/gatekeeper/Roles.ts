import {IRole, Role} from './Role';
import {IDisposable} from '../System';

export default class Roles implements IDisposable
{
    public readonly roles: {[roleName: string]: Role} = {};

    public addRole(role: Role)
    {
        if (typeof this.roles[role.id] !== 'undefined') {
            throw new Error(`Role ${role.id} already registered.`);
        }

        this.roles[role.id] = role;
    }

    public addRoles(roles: Role[]) : void
    {
        if (false === roles instanceof Array) {
            console.error('Roles: Invalid roles provided.');

            return;
        }

        roles.forEach((role: Role) => {
           this.addRole(role);
        });
    }

    public getRole(id: string) : Role
    {
        return typeof this.roles[id] === 'undefined' ? null : this.roles[id];
    }

    public dispose()
    {

        // delete.this.roles;

    }

}

export { Roles }