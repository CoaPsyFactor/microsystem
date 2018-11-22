import {IDisposable} from '../System';
import {Service} from '../services/Service';
import {IKeeperToken} from './Keeper';
abstract class Role implements IRole, IDisposable
{
    public static readonly DEFAULT_TOKEN_LIFESPAN = 60;

    abstract id: string;

    abstract readonly scope?: any[];

    public dispose()
    {

        // delete.this.id;

        // delete.this.scope;

    }
}

interface IRole
{
    /** @param {String} id Name of rule */
    readonly id: string;

    /** @param {IRole[]} scope Roles where current role has permission */
    readonly scope?: any[];
}

export { Role, IRole }