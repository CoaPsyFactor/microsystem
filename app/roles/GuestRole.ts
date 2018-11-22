import {Role} from '../../core/gatekeeper/Role';

export default class GuestRole extends Role
{
    readonly id: string = 'guest';

    readonly scope: any[];
}