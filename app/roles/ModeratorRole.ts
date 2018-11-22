import {Role} from '../../core/gatekeeper/Role';
import UserRole from './UserRole';
import GuestRole from './GuestRole';

export default class ModeratorRole extends Role
{
    readonly id: string = 'moderator';

    readonly scope: any[] = [
        UserRole,
        GuestRole
    ]
}