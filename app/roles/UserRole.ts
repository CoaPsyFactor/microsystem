import {Role} from '../../core/gatekeeper/Role';
import GuestRole from './GuestRole';

export default class UserRole extends Role
{
    readonly id: string = 'user';

    readonly scope: any[] = [
        new GuestRole
    ];
}