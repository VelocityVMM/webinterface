/*
 * A list of users (for u/user/list)
 */
export class Users {
    public users: User[]
    constructor(users: User[]) {
        this.users = users;
    }
}
 
/*
 * A User (for /u/user/list and create user)
 */
export class User {
    public uid: number;
    public name: string;

    constructor(uid: number, name: string) {
        this.uid = uid;
        this.name = name;
    }
}

/*
 * Classes for u/user Endpoint
 */
export class UserInfo {
    uid: number;
    name: string;
    memberships: Membership[];

    constructor(uid: number, name: string, memberships: Membership[]) {
        this.uid = uid;
        this.name = name;
        this.memberships = memberships
    }

    public has_permission_global(name: string): boolean {
        for(let membership of this.memberships) {
            if(membership.has_permission(name)) {
                return true;
            }
        }
        return false;
    }

    public has_permissions_global(names: string[]): boolean {
        for(let name of names) {
            if(!this.has_permission_global(name)) {
                return false;
            }
        }
        return true;
    }
}

export class Membership {
    gid: number;
    name: string;
    parent_gid: number;
    permissions: Permission[];

    constructor(gid: number, name: string, parent_gid: number, permissions: Permission[]) {
        this.gid = gid;
        this.name = name;
        this.parent_gid = parent_gid;
        this.permissions = permissions;
    }

    public has_permission(name: string): boolean {
        for(let permission of this.permissions) {
            if(permission.name == name) {
                return true;
            }
        }
        return false;
    }
}

export class Permission {
    pid: number;
    name: string;
    description: string;

    constructor(pid: number, name: string, description: string) {
        this.pid = pid;
        this.name = name;
        this.description = description
    }
}
