import {Role} from '../../core/gatekeeper/Role';
import GuestRole from './GuestRole';
import UserRole from './UserRole';
import ModeratorRole from './ModeratorRole';

export default class SuperUserRole extends Role
{
    readonly id: string = 'super-user';

    readonly scope: any[] = [
        ModeratorRole,
        UserRole,
        GuestRole
    ]
}